import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType, ToolExecutionContext } from "../../tool.js";
export declare const CountArgs: {
    query: import("zod").ZodOptional<import("zod").AnyZodObject>;
};
export declare class CountTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        query: import("zod").ZodOptional<import("zod").AnyZodObject>;
        database: import("zod").ZodString;
        collection: import("zod").ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, query }: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
}
//# sourceMappingURL=count.d.ts.map