import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType, ToolExecutionContext } from "../../tool.js";
import z from "zod";
export declare class CollectionSchemaTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        sampleSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        responseBytesLimit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, sampleSize, responseBytesLimit }: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
}
//# sourceMappingURL=collectionSchema.d.ts.map