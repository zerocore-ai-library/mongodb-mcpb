import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType, ToolExecutionContext } from "../../tool.js";
export declare class ListCollectionsTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        database: import("zod").ZodString;
    };
    static operationType: OperationType;
    protected execute({ database }: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
}
//# sourceMappingURL=listCollections.d.ts.map