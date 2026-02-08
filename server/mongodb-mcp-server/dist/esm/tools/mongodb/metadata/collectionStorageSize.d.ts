import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType, ToolExecutionContext } from "../../tool.js";
export declare class CollectionStorageSizeTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        database: import("zod").ZodString;
        collection: import("zod").ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection }: ToolArgs<typeof DbOperationArgs>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
    protected handleError(error: unknown, args: ToolArgs<typeof this.argsShape>): Promise<CallToolResult> | CallToolResult;
    private static getStats;
}
//# sourceMappingURL=collectionStorageSize.d.ts.map