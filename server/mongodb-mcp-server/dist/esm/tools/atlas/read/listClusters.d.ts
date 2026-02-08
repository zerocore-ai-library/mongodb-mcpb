import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasToolBase } from "../atlasTool.js";
import type { ToolArgs, OperationType } from "../../tool.js";
export declare const ListClustersArgs: {
    projectId: import("zod").ZodOptional<import("zod").ZodString>;
};
export declare class ListClustersTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectId: import("zod").ZodOptional<import("zod").ZodString>;
    };
    protected execute({ projectId }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    private formatAllClustersTable;
    private formatClustersTable;
}
//# sourceMappingURL=listClusters.d.ts.map