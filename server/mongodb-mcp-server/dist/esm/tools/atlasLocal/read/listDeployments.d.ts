import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasLocalToolBase } from "../atlasLocalTool.js";
import type { OperationType, ToolArgs } from "../../tool.js";
import type { Client } from "@mongodb-js/atlas-local";
export declare class ListDeploymentsTool extends AtlasLocalToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {};
    protected executeWithAtlasLocalClient(_args: ToolArgs<typeof this.argsShape>, { client }: {
        client: Client;
    }): Promise<CallToolResult>;
    private formatDeploymentsTable;
}
//# sourceMappingURL=listDeployments.d.ts.map