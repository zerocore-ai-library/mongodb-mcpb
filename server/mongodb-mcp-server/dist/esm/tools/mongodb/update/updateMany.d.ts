import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType } from "../../tool.js";
export declare class UpdateManyTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        filter: z.ZodOptional<z.AnyZodObject>;
        update: z.AnyZodObject;
        upsert: z.ZodOptional<z.ZodBoolean>;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, filter, update, upsert, }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=updateMany.d.ts.map