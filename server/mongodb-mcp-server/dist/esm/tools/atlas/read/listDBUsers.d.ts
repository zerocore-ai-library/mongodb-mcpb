import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasToolBase } from "../atlasTool.js";
import type { ToolArgs, OperationType } from "../../tool.js";
export declare const ListDBUsersArgs: {
    projectId: import("zod").ZodString;
};
export declare class ListDBUsersTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectId: import("zod").ZodString;
    };
    protected execute({ projectId }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=listDBUsers.d.ts.map