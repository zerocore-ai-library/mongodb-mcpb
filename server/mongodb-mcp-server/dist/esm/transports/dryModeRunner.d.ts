import { TransportRunnerBase, type TransportRunnerConfig } from "./base.js";
export type DryRunModeTestHelpers = {
    logger: {
        log(this: void, message: string): void;
        error(this: void, message: string): void;
    };
};
type DryRunModeRunnerConfig = TransportRunnerConfig & DryRunModeTestHelpers;
export declare class DryRunModeRunner extends TransportRunnerBase {
    private server;
    private consoleLogger;
    constructor({ logger, ...transportRunnerConfig }: DryRunModeRunnerConfig);
    start(): Promise<void>;
    closeTransport(): Promise<void>;
    private dumpConfig;
    private dumpTools;
}
export {};
//# sourceMappingURL=dryModeRunner.d.ts.map