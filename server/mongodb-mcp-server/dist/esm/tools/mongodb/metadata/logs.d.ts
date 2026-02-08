import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolExecutionContext, ToolArgs, OperationType } from "../../tool.js";
import { z } from "zod";
export declare class LogsTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["global", "startupWarnings"]>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    };
    static operationType: OperationType;
    protected execute({ type, limit }: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
}
//# sourceMappingURL=logs.d.ts.map