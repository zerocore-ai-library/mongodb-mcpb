import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { type OperationType, type ToolArgs } from "../../tool.js";
import { AtlasToolBase } from "../atlasTool.js";
export declare const InspectClusterArgs: {
    projectId: import("zod").ZodString;
    clusterName: import("zod").ZodString;
};
export declare class InspectClusterTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectId: import("zod").ZodString;
        clusterName: import("zod").ZodString;
    };
    protected execute({ projectId, clusterName }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    private formatOutput;
}
//# sourceMappingURL=inspectCluster.d.ts.map