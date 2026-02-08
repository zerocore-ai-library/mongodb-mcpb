import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { LogId } from "../common/logger.js";
import { TransportRunnerBase } from "./base.js";
export class StdioRunner extends TransportRunnerBase {
    constructor(config) {
        super(config);
    }
    async start() {
        try {
            this.server = await this.setupServer();
            const transport = new StdioServerTransport();
            await this.server.connect(transport);
        }
        catch (error) {
            this.logger.emergency({
                id: LogId.serverStartFailure,
                context: "server",
                message: `Fatal error running server: ${error}`,
            });
            process.exit(1);
        }
    }
    async closeTransport() {
        await this.server?.close();
    }
}
//# sourceMappingURL=stdio.js.map