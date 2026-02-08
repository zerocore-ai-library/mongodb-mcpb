import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType, ToolConstructorParams } from "../../tool.js";
import type { Server } from "../../../server.js";
export declare class ConnectTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        connectionString: z.ZodString;
    };
    static operationType: OperationType;
    constructor(params: ToolConstructorParams);
    register(server: Server): boolean;
    protected execute({ connectionString }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=connect.d.ts.map