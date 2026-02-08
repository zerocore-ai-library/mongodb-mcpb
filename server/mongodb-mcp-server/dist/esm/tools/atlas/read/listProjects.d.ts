import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasToolBase } from "../atlasTool.js";
import type { OperationType } from "../../tool.js";
import type { ToolArgs } from "../../tool.js";
export declare class ListProjectsTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        orgId: import("zod").ZodOptional<import("zod").ZodString>;
    };
    protected execute({ orgId }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=listProjects.d.ts.map