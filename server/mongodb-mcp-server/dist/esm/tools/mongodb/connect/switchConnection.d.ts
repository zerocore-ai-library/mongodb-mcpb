import z from "zod";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import { type ToolArgs, type OperationType, type ToolConstructorParams } from "../../tool.js";
import type { Server } from "../../../server.js";
export declare class SwitchConnectionTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        connectionString: z.ZodOptional<z.ZodString>;
    };
    static operationType: OperationType;
    constructor(params: ToolConstructorParams);
    register(server: Server): boolean;
    protected execute({ connectionString }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=switchConnection.d.ts.map