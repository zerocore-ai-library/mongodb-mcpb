import type { MongoLogId } from "mongodb-log-writer";
import type { LoggingMessageNotification } from "@modelcontextprotocol/sdk/types.js";
import { EventEmitter } from "events";
import type { Server } from "../lib.js";
import type { Keychain } from "./keychain.js";
export type LogLevel = LoggingMessageNotification["params"]["level"];
export declare const LogId: {
    readonly serverStartFailure: MongoLogId;
    readonly serverInitialized: MongoLogId;
    readonly serverCloseRequested: MongoLogId;
    readonly serverClosed: MongoLogId;
    readonly serverCloseFailure: MongoLogId;
    readonly serverDuplicateLoggers: MongoLogId;
    readonly serverMcpClientSet: MongoLogId;
    readonly atlasCheckCredentials: MongoLogId;
    readonly atlasDeleteDatabaseUserFailure: MongoLogId;
    readonly atlasConnectFailure: MongoLogId;
    readonly atlasInspectFailure: MongoLogId;
    readonly atlasConnectAttempt: MongoLogId;
    readonly atlasConnectSucceeded: MongoLogId;
    readonly atlasApiRevokeFailure: MongoLogId;
    readonly atlasIpAccessListAdded: MongoLogId;
    readonly atlasIpAccessListAddFailure: MongoLogId;
    readonly atlasApiBaseUrlInsecure: MongoLogId;
    readonly telemetryDisabled: MongoLogId;
    readonly telemetryEmitFailure: MongoLogId;
    readonly telemetryEmitStart: MongoLogId;
    readonly telemetryEmitSuccess: MongoLogId;
    readonly telemetryMetadataError: MongoLogId;
    readonly deviceIdResolutionError: MongoLogId;
    readonly deviceIdTimeout: MongoLogId;
    readonly telemetryClose: MongoLogId;
    readonly toolExecute: MongoLogId;
    readonly toolExecuteFailure: MongoLogId;
    readonly toolDisabled: MongoLogId;
    readonly toolMetadataChange: MongoLogId;
    readonly mongodbConnectFailure: MongoLogId;
    readonly mongodbDisconnectFailure: MongoLogId;
    readonly mongodbConnectTry: MongoLogId;
    readonly mongodbCursorCloseError: MongoLogId;
    readonly mongodbIndexCheckFailure: MongoLogId;
    readonly toolUpdateFailure: MongoLogId;
    readonly resourceUpdateFailure: MongoLogId;
    readonly updateToolMetadata: MongoLogId;
    readonly toolValidationError: MongoLogId;
    readonly streamableHttpTransportStarted: MongoLogId;
    readonly streamableHttpTransportSessionCloseFailure: MongoLogId;
    readonly streamableHttpTransportSessionCloseNotification: MongoLogId;
    readonly streamableHttpTransportSessionCloseNotificationFailure: MongoLogId;
    readonly streamableHttpTransportRequestFailure: MongoLogId;
    readonly streamableHttpTransportCloseFailure: MongoLogId;
    readonly streamableHttpTransportKeepAliveFailure: MongoLogId;
    readonly streamableHttpTransportKeepAlive: MongoLogId;
    readonly streamableHttpTransportHttpHostWarning: MongoLogId;
    readonly streamableHttpTransportSessionNotFound: MongoLogId;
    readonly streamableHttpTransportDisallowedExternalSessionError: MongoLogId;
    readonly exportCleanupError: MongoLogId;
    readonly exportCreationError: MongoLogId;
    readonly exportCreationCleanupError: MongoLogId;
    readonly exportReadError: MongoLogId;
    readonly exportCloseError: MongoLogId;
    readonly exportedDataListError: MongoLogId;
    readonly exportedDataAutoCompleteError: MongoLogId;
    readonly exportLockError: MongoLogId;
    readonly oidcFlow: MongoLogId;
    readonly atlasPaSuggestedIndexesFailure: MongoLogId;
    readonly atlasPaDropIndexSuggestionsFailure: MongoLogId;
    readonly atlasPaSchemaAdviceFailure: MongoLogId;
    readonly atlasPaSlowQueryLogsFailure: MongoLogId;
    readonly atlasLocalDockerNotRunning: MongoLogId;
    readonly atlasLocalUnsupportedPlatform: MongoLogId;
};
export interface LogPayload {
    id: MongoLogId;
    context: string;
    message: string;
    noRedaction?: boolean | LoggerType | LoggerType[];
    attributes?: Record<string, string>;
}
export type LoggerType = "console" | "disk" | "mcp";
type EventMap<T> = Record<keyof T, any[]> | DefaultEventMap;
type DefaultEventMap = [never];
export declare abstract class LoggerBase<T extends EventMap<T> = DefaultEventMap> extends EventEmitter<T> {
    private readonly keychain;
    private readonly defaultUnredactedLogger;
    constructor(keychain: Keychain | undefined);
    log(level: LogLevel, payload: LogPayload): void;
    protected abstract readonly type?: LoggerType;
    protected abstract logCore(level: LogLevel, payload: LogPayload): void;
    private redactIfNecessary;
    info(payload: LogPayload): void;
    error(payload: LogPayload): void;
    debug(payload: LogPayload): void;
    notice(payload: LogPayload): void;
    warning(payload: LogPayload): void;
    critical(payload: LogPayload): void;
    alert(payload: LogPayload): void;
    emergency(payload: LogPayload): void;
    protected mapToMongoDBLogLevel(level: LogLevel): "info" | "warn" | "error" | "debug" | "fatal";
}
export declare class ConsoleLogger extends LoggerBase {
    protected readonly type: LoggerType;
    constructor(keychain: Keychain);
    protected logCore(level: LogLevel, payload: LogPayload): void;
    private serializeAttributes;
}
export declare class DiskLogger extends LoggerBase<{
    initialized: [];
}> {
    private bufferedMessages;
    private logWriter?;
    constructor(logPath: string, onError: (error: Error) => void, keychain: Keychain);
    private initialize;
    protected type: LoggerType;
    protected logCore(level: LogLevel, payload: LogPayload): void;
}
export declare class McpLogger extends LoggerBase {
    private readonly server;
    static readonly LOG_LEVELS: LogLevel[];
    constructor(server: Server, keychain: Keychain);
    protected readonly type: LoggerType;
    protected logCore(level: LogLevel, payload: LogPayload): void;
}
export declare class CompositeLogger extends LoggerBase {
    protected readonly type?: LoggerType;
    private readonly loggers;
    private readonly attributes;
    constructor(...loggers: LoggerBase[]);
    addLogger(logger: LoggerBase): void;
    log(level: LogLevel, payload: LogPayload): void;
    protected logCore(): void;
    setAttribute(key: string, value: string): void;
}
export {};
//# sourceMappingURL=logger.d.ts.map