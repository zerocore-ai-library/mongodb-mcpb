import { z } from "zod";
import { type OperationType, type ToolArgs } from "../../tool.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasToolBase } from "../atlasTool.js";
export declare const CreateAccessListArgs: {
    projectId: z.ZodString;
    ipAddresses: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    cidrBlocks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    currentIpAddress: z.ZodDefault<z.ZodBoolean>;
    comment: z.ZodOptional<z.ZodDefault<z.ZodString>>;
};
export declare class CreateAccessListTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectId: z.ZodString;
        ipAddresses: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        cidrBlocks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        currentIpAddress: z.ZodDefault<z.ZodBoolean>;
        comment: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    };
    protected execute({ projectId, ipAddresses, cidrBlocks, comment, currentIpAddress, }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    protected getConfirmationMessage({ projectId, ipAddresses, cidrBlocks, comment, currentIpAddress, }: ToolArgs<typeof this.argsShape>): string;
}
//# sourceMappingURL=createAccessList.d.ts.map