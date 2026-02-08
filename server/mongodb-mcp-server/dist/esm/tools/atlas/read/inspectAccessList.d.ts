import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { type OperationType, type ToolArgs } from "../../tool.js";
import { AtlasToolBase } from "../atlasTool.js";
export declare const InspectAccessListArgs: {
    projectId: import("zod").ZodString;
};
export declare class InspectAccessListTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectId: import("zod").ZodString;
    };
    protected execute({ projectId }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=inspectAccessList.d.ts.map