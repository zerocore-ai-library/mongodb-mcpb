import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ToolArgs, ToolCategory, ToolExecutionContext } from "../tool.js";
import { ToolBase } from "../tool.js";
import type { Client } from "@mongodb-js/atlas-local";
import type { ConnectionMetadata } from "../../telemetry/types.js";
export declare const AtlasLocalToolMetadataDeploymentIdKey = "deploymentId";
export declare abstract class AtlasLocalToolBase extends ToolBase {
    static category: ToolCategory;
    protected verifyAllowed(): boolean;
    protected execute(args: ToolArgs<typeof this.argsShape>, _context: ToolExecutionContext): Promise<CallToolResult>;
    private lookupDeploymentId;
    protected lookupTelemetryMetadata(client: Client, containerId: string): Promise<{
        [key: string]: unknown;
    }>;
    protected abstract executeWithAtlasLocalClient(args: ToolArgs<typeof this.argsShape>, context: {
        client: Client;
    }): Promise<CallToolResult>;
    protected handleError(error: unknown, args: ToolArgs<typeof this.argsShape>): Promise<CallToolResult> | CallToolResult;
    protected resolveTelemetryMetadata(_args: ToolArgs<typeof this.argsShape>, { result }: {
        result: CallToolResult;
    }): ConnectionMetadata;
}
//# sourceMappingURL=atlasLocalTool.d.ts.map