import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasLocalToolBase } from "../atlasLocalTool.js";
import type { OperationType, ToolArgs } from "../../tool.js";
import type { Client } from "@mongodb-js/atlas-local";
import z from "zod";
export declare class CreateDeploymentTool extends AtlasLocalToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        deploymentName: z.ZodOptional<z.ZodString>;
        loadSampleData: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    };
    protected executeWithAtlasLocalClient({ deploymentName, loadSampleData }: ToolArgs<typeof this.argsShape>, { client }: {
        client: Client;
    }): Promise<CallToolResult>;
}
//# sourceMappingURL=createDeployment.d.ts.map