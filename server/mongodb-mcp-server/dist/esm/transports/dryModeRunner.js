import { InMemoryTransport } from "./inMemoryTransport.js";
import { TransportRunnerBase } from "./base.js";
export class DryRunModeRunner extends TransportRunnerBase {
    constructor({ logger, ...transportRunnerConfig }) {
        super(transportRunnerConfig);
        this.consoleLogger = logger;
    }
    async start() {
        this.server = await this.setupServer();
        const transport = new InMemoryTransport();
        await this.server.connect(transport);
        this.dumpConfig();
        this.dumpTools();
    }
    async closeTransport() {
        await this.server?.close();
    }
    dumpConfig() {
        this.consoleLogger.log("Configuration:");
        this.consoleLogger.log(JSON.stringify(this.userConfig, null, 2));
    }
    dumpTools() {
        const tools = this.server?.tools
            .filter((tool) => tool.isEnabled())
            .map((tool) => ({
            name: tool.name,
            category: tool.category,
        })) ?? [];
        this.consoleLogger.log("Enabled tools:");
        this.consoleLogger.log(JSON.stringify(tools, null, 2));
    }
}
//# sourceMappingURL=dryModeRunner.js.map