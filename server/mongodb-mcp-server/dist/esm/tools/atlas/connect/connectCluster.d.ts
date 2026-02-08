import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { type OperationType, type ToolArgs } from "../../tool.js";
import { AtlasToolBase } from "../atlasTool.js";
import type { ConnectionMetadata } from "../../../telemetry/types.js";
export declare const ConnectClusterArgs: {
    projectId: import("zod").ZodString;
    clusterName: import("zod").ZodString;
    connectionType: import("zod").ZodDefault<import("zod").ZodEnum<["standard", "private", "privateEndpoint"]>>;
};
export declare class ConnectClusterTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectId: import("zod").ZodString;
        clusterName: import("zod").ZodString;
        connectionType: import("zod").ZodDefault<import("zod").ZodEnum<["standard", "private", "privateEndpoint"]>>;
    };
    private queryConnection;
    private prepareClusterConnection;
    private connectToCluster;
    protected execute({ projectId, clusterName, connectionType, }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    protected resolveTelemetryMetadata(args: ToolArgs<typeof this.argsShape>, { result }: {
        result: CallToolResult;
    }): ConnectionMetadata;
}
//# sourceMappingURL=connectCluster.d.ts.map