import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType } from "../../tool.js";
export declare class DropCollectionTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        database: import("zod").ZodString;
        collection: import("zod").ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    protected getConfirmationMessage({ database, collection }: ToolArgs<typeof this.argsShape>): string;
}
//# sourceMappingURL=dropCollection.d.ts.map