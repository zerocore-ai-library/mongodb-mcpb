import z from "zod";
import path from "path";
import fs from "fs/promises";
import EventEmitter from "events";
import { createWriteStream } from "fs";
import { EJSON, ObjectId } from "bson";
import { Transform } from "stream";
import { pipeline } from "stream/promises";
import { LogId } from "./logger.js";
export const jsonExportFormat = z.enum(["relaxed", "canonical"]);
export class ExportsManager extends EventEmitter {
    constructor(exportsDirectoryPath, config, logger) {
        super();
        this.exportsDirectoryPath = exportsDirectoryPath;
        this.config = config;
        this.logger = logger;
        this.storedExports = {};
        this.exportsCleanupInProgress = false;
        this.shutdownController = new AbortController();
    }
    get availableExports() {
        this.assertIsNotShuttingDown();
        return Object.values(this.storedExports)
            .filter((storedExport) => {
            return (storedExport.exportStatus === "ready" &&
                !isExportExpired(storedExport.exportCreatedAt, this.config.exportTimeoutMs));
        })
            .map(({ exportName, exportTitle, exportURI, exportPath }) => ({
            exportName,
            exportTitle,
            exportURI,
            exportPath,
        }));
    }
    init() {
        if (!this.exportsCleanupInterval) {
            this.exportsCleanupInterval = setInterval(() => void this.cleanupExpiredExports(), this.config.exportCleanupIntervalMs);
        }
    }
    async close() {
        if (this.shutdownController.signal.aborted) {
            return;
        }
        try {
            clearInterval(this.exportsCleanupInterval);
            this.shutdownController.abort();
            await fs.rm(this.exportsDirectoryPath, { force: true, recursive: true });
            this.emit("closed");
        }
        catch (error) {
            this.logger.error({
                id: LogId.exportCloseError,
                context: "Error while closing ExportsManager",
                message: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async readExport(exportName) {
        try {
            this.assertIsNotShuttingDown();
            exportName = decodeAndNormalize(exportName);
            const exportHandle = this.storedExports[exportName];
            if (!exportHandle) {
                throw new Error("Requested export has either expired or does not exist.");
            }
            if (exportHandle.exportStatus === "in-progress") {
                throw new Error("Requested export is still being generated. Try again later.");
            }
            const { exportPath, docsTransformed } = exportHandle;
            return {
                content: await fs.readFile(exportPath, { encoding: "utf8", signal: this.shutdownController.signal }),
                docsTransformed,
            };
        }
        catch (error) {
            this.logger.error({
                id: LogId.exportReadError,
                context: `Error when reading export - ${exportName}`,
                message: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async createJSONExport({ input, exportName, exportTitle, jsonExportFormat, }) {
        try {
            this.assertIsNotShuttingDown();
            const exportNameWithExtension = decodeAndNormalize(ensureExtension(exportName, "json"));
            if (this.storedExports[exportNameWithExtension]) {
                return Promise.reject(new Error("Export with same name is either already available or being generated."));
            }
            const exportURI = `exported-data://${encodeURIComponent(exportNameWithExtension)}`;
            const exportFilePath = path.join(this.exportsDirectoryPath, exportNameWithExtension);
            const inProgressExport = (this.storedExports[exportNameWithExtension] = {
                exportName: exportNameWithExtension,
                exportTitle,
                exportPath: exportFilePath,
                exportURI: exportURI,
                exportStatus: "in-progress",
            });
            void this.startExport({ input, jsonExportFormat, inProgressExport });
            return Promise.resolve(inProgressExport);
        }
        catch (error) {
            this.logger.error({
                id: LogId.exportCreationError,
                context: "Error when registering JSON export request",
                message: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async startExport({ input, jsonExportFormat, inProgressExport, }) {
        try {
            let pipeSuccessful = false;
            let docsTransformed = 0;
            try {
                await fs.mkdir(this.exportsDirectoryPath, { recursive: true });
                const outputStream = createWriteStream(inProgressExport.exportPath);
                const ejsonTransform = this.docToEJSONStream(this.getEJSONOptionsForFormat(jsonExportFormat));
                await pipeline([input.stream(), ejsonTransform, outputStream], {
                    signal: this.shutdownController.signal,
                });
                docsTransformed = ejsonTransform.docsTransformed;
                pipeSuccessful = true;
            }
            catch (error) {
                // If the pipeline errors out then we might end up with
                // partial and incorrect export so we remove it entirely.
                delete this.storedExports[inProgressExport.exportName];
                // do not block the user, just delete the file in the background
                void this.silentlyRemoveExport(inProgressExport.exportPath, LogId.exportCreationCleanupError, `Error when removing incomplete export ${inProgressExport.exportName}`);
                throw error;
            }
            finally {
                if (pipeSuccessful) {
                    this.storedExports[inProgressExport.exportName] = {
                        ...inProgressExport,
                        exportCreatedAt: Date.now(),
                        exportStatus: "ready",
                        docsTransformed,
                    };
                    this.emit("export-available", inProgressExport.exportURI);
                }
                void input.close();
            }
        }
        catch (error) {
            this.logger.error({
                id: LogId.exportCreationError,
                context: `Error when generating JSON export for ${inProgressExport.exportName}`,
                message: error instanceof Error ? error.message : String(error),
            });
        }
    }
    getEJSONOptionsForFormat(format) {
        switch (format) {
            case "relaxed":
                return { relaxed: true };
            case "canonical":
                return { relaxed: false };
            default:
                return undefined;
        }
    }
    docToEJSONStream(ejsonOptions) {
        let docsTransformed = 0;
        const result = Object.assign(new Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
                try {
                    const doc = EJSON.stringify(chunk, undefined, undefined, ejsonOptions);
                    if (docsTransformed === 0) {
                        this.push("[" + doc);
                    }
                    else {
                        this.push(",\n" + doc);
                    }
                    docsTransformed++;
                    callback();
                }
                catch (err) {
                    callback(err);
                }
            },
            flush(callback) {
                if (docsTransformed === 0) {
                    this.push("[]");
                }
                else {
                    this.push("]");
                }
                result.docsTransformed = docsTransformed;
                callback();
            },
        }), { docsTransformed });
        return result;
    }
    async cleanupExpiredExports() {
        if (this.exportsCleanupInProgress) {
            return;
        }
        this.exportsCleanupInProgress = true;
        try {
            // first, unregister all exports that are expired, so they are not considered anymore for reading
            const exportsForCleanup = [];
            for (const expiredExport of Object.values(this.storedExports)) {
                if (expiredExport.exportStatus === "ready" &&
                    isExportExpired(expiredExport.exportCreatedAt, this.config.exportTimeoutMs)) {
                    exportsForCleanup.push(expiredExport);
                    delete this.storedExports[expiredExport.exportName];
                }
            }
            // and then remove them (slow operation potentially) from disk.
            const allDeletionPromises = [];
            for (const { exportPath, exportName } of exportsForCleanup) {
                allDeletionPromises.push(this.silentlyRemoveExport(exportPath, LogId.exportCleanupError, `Considerable error when removing export ${exportName}`));
            }
            await Promise.allSettled(allDeletionPromises);
        }
        catch (error) {
            this.logger.error({
                id: LogId.exportCleanupError,
                context: "Error when cleaning up exports",
                message: error instanceof Error ? error.message : String(error),
            });
        }
        finally {
            this.exportsCleanupInProgress = false;
        }
    }
    async silentlyRemoveExport(exportPath, logId, logContext) {
        try {
            await fs.unlink(exportPath);
        }
        catch (error) {
            // If the file does not exist or the containing directory itself
            // does not exist then we can safely ignore that error anything else
            // we need to flag.
            if (error.code !== "ENOENT") {
                this.logger.error({
                    id: logId,
                    context: logContext,
                    message: error instanceof Error ? error.message : String(error),
                });
            }
        }
    }
    assertIsNotShuttingDown() {
        if (this.shutdownController.signal.aborted) {
            throw new Error("ExportsManager is shutting down.");
        }
    }
    static init(config, logger, sessionId = new ObjectId().toString()) {
        const exportsDirectoryPath = path.join(config.exportsPath, sessionId);
        const exportsManager = new ExportsManager(exportsDirectoryPath, config, logger);
        exportsManager.init();
        return exportsManager;
    }
}
export function decodeAndNormalize(text) {
    return decodeURIComponent(text).normalize("NFKC");
}
/**
 * Ensures the path ends with the provided extension */
export function ensureExtension(pathOrName, extension) {
    const extWithDot = extension.startsWith(".") ? extension : `.${extension}`;
    if (pathOrName.endsWith(extWithDot)) {
        return pathOrName;
    }
    return `${pathOrName}${extWithDot}`;
}
export function isExportExpired(createdAt, exportTimeoutMs) {
    return Date.now() - createdAt > exportTimeoutMs;
}
//# sourceMappingURL=exportsManager.js.map