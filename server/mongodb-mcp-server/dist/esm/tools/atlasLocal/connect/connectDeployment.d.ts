import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasLocalToolBase } from "../atlasLocalTool.js";
import type { OperationType, ToolArgs } from "../../tool.js";
import type { Client } from "@mongodb-js/atlas-local";
import type { ConnectionMetadata } from "../../../telemetry/types.js";
export declare class ConnectDeploymentTool extends AtlasLocalToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        deploymentName: import("zod").ZodString;
    };
    protected executeWithAtlasLocalClient({ deploymentName }: ToolArgs<typeof this.argsShape>, { client }: {
        client: Client;
    }): Promise<CallToolResult>;
    protected resolveTelemetryMetadata(args: ToolArgs<typeof this.argsShape>, { result }: {
        result: CallToolResult;
    }): ConnectionMetadata;
}
//# sourceMappingURL=connectDeployment.d.ts.map