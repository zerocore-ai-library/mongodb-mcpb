import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType } from "../../tool.js";
export declare class DeleteManyTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        filter: import("zod").ZodOptional<import("zod").AnyZodObject>;
        database: import("zod").ZodString;
        collection: import("zod").ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, filter, }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    protected getConfirmationMessage({ database, collection, filter }: ToolArgs<typeof this.argsShape>): string;
}
//# sourceMappingURL=deleteMany.d.ts.map