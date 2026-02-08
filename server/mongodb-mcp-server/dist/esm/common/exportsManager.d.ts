import z from "zod";
import EventEmitter from "events";
import type { AggregationCursor, FindCursor } from "mongodb";
import type { UserConfig } from "./config/userConfig.js";
import type { LoggerBase } from "./logger.js";
export declare const jsonExportFormat: z.ZodEnum<["relaxed", "canonical"]>;
export type JSONExportFormat = z.infer<typeof jsonExportFormat>;
interface CommonExportData {
    exportName: string;
    exportTitle: string;
    exportURI: string;
    exportPath: string;
}
interface ReadyExport extends CommonExportData {
    exportStatus: "ready";
    exportCreatedAt: number;
    docsTransformed: number;
}
interface InProgressExport extends CommonExportData {
    exportStatus: "in-progress";
}
type StoredExport = ReadyExport | InProgressExport;
/**
 * Ideally just exportName and exportURI should be made publicly available but
 * we also make exportPath available because the export tool, also returns the
 * exportPath in its response when the MCP server is running connected to stdio
 * transport. The reasoning behind this is that a few clients, Cursor in
 * particular, as of the date of this writing (7 August 2025) cannot refer to
 * resource URIs which means they have no means to access the exported resource.
 * As of this writing, majority of the usage of our MCP server is behind STDIO
 * transport so we can assume that for most of the usages, if not all, the MCP
 * server will be running on the same machine as of the MCP client and thus we
 * can provide the local path to export so that these clients which do not still
 * support parsing resource URIs, can still work with the exported data. We
 * expect for clients to catch up and implement referencing resource URIs at
 * which point it would be safe to remove the `exportPath` from the publicly
 * exposed properties of an export.
 *
 * The editors that we would like to watch out for are Cursor and Windsurf as
 * they don't yet support working with Resource URIs.
 *
 * Ref Cursor: https://forum.cursor.com/t/cursor-mcp-resource-feature-support/50987
 * JIRA: https://jira.mongodb.org/browse/MCP-104 */
export type AvailableExport = Pick<StoredExport, "exportName" | "exportTitle" | "exportURI" | "exportPath">;
export type ExportsManagerConfig = Pick<UserConfig, "exportsPath" | "exportTimeoutMs" | "exportCleanupIntervalMs">;
type ExportsManagerEvents = {
    closed: [];
    "export-expired": [string];
    "export-available": [string];
};
export declare class ExportsManager extends EventEmitter<ExportsManagerEvents> {
    private readonly exportsDirectoryPath;
    private readonly config;
    private readonly logger;
    private storedExports;
    private exportsCleanupInProgress;
    private exportsCleanupInterval?;
    private readonly shutdownController;
    private constructor();
    get availableExports(): AvailableExport[];
    protected init(): void;
    close(): Promise<void>;
    readExport(exportName: string): Promise<{
        content: string;
        docsTransformed: number;
    }>;
    createJSONExport({ input, exportName, exportTitle, jsonExportFormat, }: {
        input: FindCursor | AggregationCursor;
        exportName: string;
        exportTitle: string;
        jsonExportFormat: JSONExportFormat;
    }): Promise<AvailableExport>;
    private startExport;
    private getEJSONOptionsForFormat;
    private docToEJSONStream;
    private cleanupExpiredExports;
    private silentlyRemoveExport;
    private assertIsNotShuttingDown;
    static init(config: ExportsManagerConfig, logger: LoggerBase, sessionId?: string): ExportsManager;
}
export declare function decodeAndNormalize(text: string): string;
/**
 * Ensures the path ends with the provided extension */
export declare function ensureExtension(pathOrName: string, extension: string): string;
export declare function isExportExpired(createdAt: number, exportTimeoutMs: number): boolean;
export {};
//# sourceMappingURL=exportsManager.d.ts.map