import { TransportRunnerBase, type TransportRunnerConfig } from "./base.js";
export declare class StreamableHttpRunner extends TransportRunnerBase {
    private httpServer;
    private sessionStore;
    constructor(config: TransportRunnerConfig);
    get serverAddress(): string;
    start(): Promise<void>;
    closeTransport(): Promise<void>;
    private withErrorHandling;
    private shouldWarnAboutHttpHost;
}
//# sourceMappingURL=streamableHttp.d.ts.map