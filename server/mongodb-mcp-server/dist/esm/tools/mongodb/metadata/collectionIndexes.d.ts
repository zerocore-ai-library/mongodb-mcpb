import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType } from "../../tool.js";
import type { Document } from "bson";
export declare class CollectionIndexesTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        database: import("zod").ZodString;
        collection: import("zod").ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection }: ToolArgs<typeof DbOperationArgs>): Promise<CallToolResult>;
    protected handleError(error: unknown, args: ToolArgs<typeof this.argsShape>): Promise<CallToolResult> | CallToolResult;
    /**
     * Atlas Search index status contains a lot of information that is not relevant for the agent at this stage.
     * Like for example, the status on each of the dedicated nodes. We only care about the main status, if it's
     * queryable and the index name. We are also picking the index definition as it can be used by the agent to
     * understand which fields are available for searching.
     **/
    protected extractSearchIndexDetails(indexes: Record<string, unknown>[]): Document[];
}
//# sourceMappingURL=collectionIndexes.d.ts.map