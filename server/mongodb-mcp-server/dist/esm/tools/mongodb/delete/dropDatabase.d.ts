import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType } from "../../tool.js";
export declare class DropDatabaseTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        database: import("zod").ZodString;
    };
    static operationType: OperationType;
    protected execute({ database }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    protected getConfirmationMessage({ database }: ToolArgs<typeof this.argsShape>): string;
}
//# sourceMappingURL=dropDatabase.d.ts.map