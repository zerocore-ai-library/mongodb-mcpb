import type { LoggerBase } from "./logger.js";
/**
 * Minimal interface for a transport that can be stored in a SessionStore.
 * The transport must have a close method for cleanup.
 */
export type CloseableTransport = {
    close(): Promise<void>;
};
export declare class SessionStore<T extends CloseableTransport = CloseableTransport> {
    private readonly idleTimeoutMS;
    private readonly notificationTimeoutMS;
    private readonly logger;
    private sessions;
    constructor(idleTimeoutMS: number, notificationTimeoutMS: number, logger: LoggerBase);
    getSession(sessionId: string): T | undefined;
    private resetTimeout;
    private sendNotification;
    setSession(sessionId: string, transport: T, logger: LoggerBase): void;
    closeSession(sessionId: string, closeTransport?: boolean): Promise<void>;
    closeAllSessions(): Promise<void>;
}
//# sourceMappingURL=sessionStore.d.ts.map