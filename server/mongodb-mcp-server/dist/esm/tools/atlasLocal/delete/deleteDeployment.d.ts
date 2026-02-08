import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasLocalToolBase } from "../atlasLocalTool.js";
import type { OperationType, ToolArgs } from "../../tool.js";
import type { Client } from "@mongodb-js/atlas-local";
export declare class DeleteDeploymentTool extends AtlasLocalToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        deploymentName: import("zod").ZodString;
    };
    protected executeWithAtlasLocalClient({ deploymentName }: ToolArgs<typeof this.argsShape>, { client }: {
        client: Client;
    }): Promise<CallToolResult>;
}
//# sourceMappingURL=deleteDeployment.d.ts.map