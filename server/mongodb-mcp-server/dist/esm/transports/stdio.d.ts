import { TransportRunnerBase, type TransportRunnerConfig } from "./base.js";
export declare class StdioRunner extends TransportRunnerBase {
    private server;
    constructor(config: TransportRunnerConfig);
    start(): Promise<void>;
    closeTransport(): Promise<void>;
}
//# sourceMappingURL=stdio.d.ts.map