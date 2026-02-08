import fs from "fs/promises";
import { mongoLogId, MongoLogManager } from "mongodb-log-writer";
import { redact } from "mongodb-redact";
import { EventEmitter } from "events";
export const LogId = {
    serverStartFailure: mongoLogId(1000001),
    serverInitialized: mongoLogId(1000002),
    serverCloseRequested: mongoLogId(1000003),
    serverClosed: mongoLogId(1000004),
    serverCloseFailure: mongoLogId(1000005),
    serverDuplicateLoggers: mongoLogId(1000006),
    serverMcpClientSet: mongoLogId(1000007),
    atlasCheckCredentials: mongoLogId(1001001),
    atlasDeleteDatabaseUserFailure: mongoLogId(1001002),
    atlasConnectFailure: mongoLogId(1001003),
    atlasInspectFailure: mongoLogId(1001004),
    atlasConnectAttempt: mongoLogId(1001005),
    atlasConnectSucceeded: mongoLogId(1001006),
    atlasApiRevokeFailure: mongoLogId(1001007),
    atlasIpAccessListAdded: mongoLogId(1001008),
    atlasIpAccessListAddFailure: mongoLogId(1001009),
    atlasApiBaseUrlInsecure: mongoLogId(1001010),
    telemetryDisabled: mongoLogId(1002001),
    telemetryEmitFailure: mongoLogId(1002002),
    telemetryEmitStart: mongoLogId(1002003),
    telemetryEmitSuccess: mongoLogId(1002004),
    telemetryMetadataError: mongoLogId(1002005),
    deviceIdResolutionError: mongoLogId(1002006),
    deviceIdTimeout: mongoLogId(1002007),
    telemetryClose: mongoLogId(1002008),
    toolExecute: mongoLogId(1003001),
    toolExecuteFailure: mongoLogId(1003002),
    toolDisabled: mongoLogId(1003003),
    toolMetadataChange: mongoLogId(1003004),
    mongodbConnectFailure: mongoLogId(1004001),
    mongodbDisconnectFailure: mongoLogId(1004002),
    mongodbConnectTry: mongoLogId(1004003),
    mongodbCursorCloseError: mongoLogId(1004004),
    mongodbIndexCheckFailure: mongoLogId(1004005),
    toolUpdateFailure: mongoLogId(1005001),
    resourceUpdateFailure: mongoLogId(1005002),
    updateToolMetadata: mongoLogId(1005003),
    toolValidationError: mongoLogId(1005004),
    streamableHttpTransportStarted: mongoLogId(1006001),
    streamableHttpTransportSessionCloseFailure: mongoLogId(1006002),
    streamableHttpTransportSessionCloseNotification: mongoLogId(1006003),
    streamableHttpTransportSessionCloseNotificationFailure: mongoLogId(1006004),
    streamableHttpTransportRequestFailure: mongoLogId(1006005),
    streamableHttpTransportCloseFailure: mongoLogId(1006006),
    streamableHttpTransportKeepAliveFailure: mongoLogId(1006007),
    streamableHttpTransportKeepAlive: mongoLogId(1006008),
    streamableHttpTransportHttpHostWarning: mongoLogId(1006009),
    streamableHttpTransportSessionNotFound: mongoLogId(1006010),
    streamableHttpTransportDisallowedExternalSessionError: mongoLogId(1006011),
    exportCleanupError: mongoLogId(1007001),
    exportCreationError: mongoLogId(1007002),
    exportCreationCleanupError: mongoLogId(1007003),
    exportReadError: mongoLogId(1007004),
    exportCloseError: mongoLogId(1007005),
    exportedDataListError: mongoLogId(1007006),
    exportedDataAutoCompleteError: mongoLogId(1007007),
    exportLockError: mongoLogId(1007008),
    oidcFlow: mongoLogId(1008001),
    atlasPaSuggestedIndexesFailure: mongoLogId(1009001),
    atlasPaDropIndexSuggestionsFailure: mongoLogId(1009002),
    atlasPaSchemaAdviceFailure: mongoLogId(1009003),
    atlasPaSlowQueryLogsFailure: mongoLogId(1009004),
    atlasLocalDockerNotRunning: mongoLogId(1010001),
    atlasLocalUnsupportedPlatform: mongoLogId(1010002),
};
export class LoggerBase extends EventEmitter {
    constructor(keychain) {
        super();
        this.keychain = keychain;
        this.defaultUnredactedLogger = "mcp";
    }
    log(level, payload) {
        // If no explicit value is supplied for unredacted loggers, default to "mcp"
        const noRedaction = payload.noRedaction !== undefined ? payload.noRedaction : this.defaultUnredactedLogger;
        this.logCore(level, {
            ...payload,
            message: this.redactIfNecessary(payload.message, noRedaction),
        });
    }
    redactIfNecessary(message, noRedaction) {
        if (typeof noRedaction === "boolean" && noRedaction) {
            // If the consumer has supplied noRedaction: true, we don't redact the log message
            // regardless of the logger type
            return message;
        }
        if (typeof noRedaction === "string" && noRedaction === this.type) {
            // If the consumer has supplied noRedaction: logger-type, we skip redacting if
            // our logger type is the same as what the consumer requested
            return message;
        }
        if (typeof noRedaction === "object" &&
            Array.isArray(noRedaction) &&
            this.type &&
            noRedaction.indexOf(this.type) !== -1) {
            // If the consumer has supplied noRedaction: array, we skip redacting if our logger
            // type is included in that array
            return message;
        }
        return redact(message, this.keychain?.allSecrets ?? []);
    }
    info(payload) {
        this.log("info", payload);
    }
    error(payload) {
        this.log("error", payload);
    }
    debug(payload) {
        this.log("debug", payload);
    }
    notice(payload) {
        this.log("notice", payload);
    }
    warning(payload) {
        this.log("warning", payload);
    }
    critical(payload) {
        this.log("critical", payload);
    }
    alert(payload) {
        this.log("alert", payload);
    }
    emergency(payload) {
        this.log("emergency", payload);
    }
    mapToMongoDBLogLevel(level) {
        switch (level) {
            case "info":
                return "info";
            case "warning":
                return "warn";
            case "error":
                return "error";
            case "notice":
            case "debug":
                return "debug";
            case "critical":
            case "alert":
            case "emergency":
                return "fatal";
            default:
                return "info";
        }
    }
}
export class ConsoleLogger extends LoggerBase {
    constructor(keychain) {
        super(keychain);
        this.type = "console";
    }
    logCore(level, payload) {
        const { id, context, message } = payload;
        // eslint-disable-next-line no-console
        console.error(`[${level.toUpperCase()}] ${id.__value} - ${context}: ${message} (${process.pid}${this.serializeAttributes(payload.attributes)})`);
    }
    serializeAttributes(attributes) {
        if (!attributes || Object.keys(attributes).length === 0) {
            return "";
        }
        return `, ${Object.entries(attributes)
            .map(([key, value]) => `${key}=${value}`)
            .join(", ")}`;
    }
}
export class DiskLogger extends LoggerBase {
    constructor(logPath, onError, keychain) {
        super(keychain);
        this.bufferedMessages = [];
        this.type = "disk";
        void this.initialize(logPath, onError);
    }
    async initialize(logPath, onError) {
        try {
            await fs.mkdir(logPath, { recursive: true });
            const manager = new MongoLogManager({
                directory: logPath,
                retentionDays: 30,
                // eslint-disable-next-line no-console
                onwarn: console.warn,
                // eslint-disable-next-line no-console
                onerror: console.error,
                gzip: false,
                retentionGB: 1,
            });
            await manager.cleanupOldLogFiles();
            this.logWriter = await manager.createLogWriter();
            for (const message of this.bufferedMessages) {
                this.logCore(message.level, message.payload);
            }
            this.bufferedMessages = [];
            this.emit("initialized");
        }
        catch (error) {
            onError(error);
        }
    }
    logCore(level, payload) {
        if (!this.logWriter) {
            // If the log writer is not initialized, buffer the message
            this.bufferedMessages.push({ level, payload });
            return;
        }
        const { id, context, message } = payload;
        const mongoDBLevel = this.mapToMongoDBLogLevel(level);
        this.logWriter[mongoDBLevel]("MONGODB-MCP", id, context, message, payload.attributes);
    }
}
export class McpLogger extends LoggerBase {
    constructor(server, keychain) {
        super(keychain);
        this.server = server;
        this.type = "mcp";
    }
    logCore(level, payload) {
        // Only log if the server is connected
        if (!this.server.mcpServer.isConnected()) {
            return;
        }
        const minimumLevel = McpLogger.LOG_LEVELS.indexOf(this.server.mcpLogLevel);
        const currentLevel = McpLogger.LOG_LEVELS.indexOf(level);
        if (minimumLevel > currentLevel) {
            // Don't log if the requested level is lower than the minimum level
            return;
        }
        void this.server.mcpServer.server.sendLoggingMessage({
            level,
            data: `[${payload.context}]: ${payload.message}`,
        });
    }
}
McpLogger.LOG_LEVELS = [
    "debug",
    "info",
    "notice",
    "warning",
    "error",
    "critical",
    "alert",
    "emergency",
];
export class CompositeLogger extends LoggerBase {
    constructor(...loggers) {
        // composite logger does not redact, only the actual delegates do the work
        // so we don't need the Keychain here
        super(undefined);
        this.loggers = [];
        this.attributes = {};
        this.loggers = loggers;
    }
    addLogger(logger) {
        this.loggers.push(logger);
    }
    log(level, payload) {
        // Override the public method to avoid the base logger redacting the message payload
        for (const logger of this.loggers) {
            const attributes = Object.keys(this.attributes).length > 0 || payload.attributes
                ? { ...this.attributes, ...payload.attributes }
                : undefined;
            logger.log(level, { ...payload, attributes });
        }
    }
    logCore() {
        throw new Error("logCore should never be invoked on CompositeLogger");
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
    }
}
//# sourceMappingURL=logger.js.map