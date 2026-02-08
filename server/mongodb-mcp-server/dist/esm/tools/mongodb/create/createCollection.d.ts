import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { OperationType, ToolArgs } from "../../tool.js";
export declare class CreateCollectionTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        database: import("zod").ZodString;
        collection: import("zod").ZodString;
    };
    static operationType: OperationType;
    protected execute({ collection, database }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=createCollection.d.ts.map