import z from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import { type ToolArgs, type OperationType } from "../../tool.js";
export declare class DropIndexTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        indexName: z.ZodString;
        type: z.ZodDefault<z.ZodLiteral<"classic">> | z.ZodEnum<["classic", "search"]>;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute(toolArgs: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    private dropClassicIndex;
    private dropSearchIndex;
    protected getConfirmationMessage({ database, collection, indexName, type, }: ToolArgs<typeof this.argsShape>): string;
}
//# sourceMappingURL=dropIndex.d.ts.map