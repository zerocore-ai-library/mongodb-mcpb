import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType, ToolExecutionContext } from "../../tool.js";
import type { SortDirection } from "mongodb";
export declare const FindArgs: {
    filter: z.ZodOptional<z.AnyZodObject>;
    projection: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodType<SortDirection, z.ZodTypeDef, SortDirection>, {}, {}>>;
};
export declare class FindTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        responseBytesLimit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        filter: z.ZodOptional<z.AnyZodObject>;
        projection: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        sort: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodType<SortDirection, z.ZodTypeDef, SortDirection>, {}, {}>>;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, filter, projection, limit, sort, responseBytesLimit }: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
    private safeCloseCursor;
    private generateMessage;
    private getLimitForFindCursor;
}
//# sourceMappingURL=find.d.ts.map