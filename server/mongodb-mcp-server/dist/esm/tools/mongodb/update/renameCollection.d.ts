import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType } from "../../tool.js";
export declare class RenameCollectionTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        newName: z.ZodString;
        dropTarget: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, newName, dropTarget, }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    protected handleError(error: unknown, args: ToolArgs<typeof this.argsShape>): Promise<CallToolResult> | CallToolResult;
}
//# sourceMappingURL=renameCollection.d.ts.map