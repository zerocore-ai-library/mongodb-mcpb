import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { type ToolArgs, type OperationType } from "../../tool.js";
import { AtlasToolBase } from "../atlasTool.js";
export declare class CreateFreeClusterTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectId: import("zod").ZodString;
        name: import("zod").ZodString;
        region: import("zod").ZodDefault<import("zod").ZodString>;
    };
    protected execute({ projectId, name, region }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=createFreeCluster.d.ts.map