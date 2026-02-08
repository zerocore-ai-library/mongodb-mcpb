import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { type OperationType, type ToolArgs } from "../../tool.js";
import { AtlasToolBase } from "../atlasTool.js";
export declare class CreateProjectTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectName: import("zod").ZodOptional<import("zod").ZodString>;
        organizationId: import("zod").ZodOptional<import("zod").ZodString>;
    };
    protected execute({ projectName, organizationId }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=createProject.d.ts.map