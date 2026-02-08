import type { AtlasMetadata } from "../../telemetry/types.js";
import { ToolBase, type ToolArgs, type ToolCategory } from "../tool.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ApiClient } from "../../common/atlas/apiClient.js";
export declare abstract class AtlasToolBase extends ToolBase {
    static category: ToolCategory;
    protected verifyAllowed(): boolean;
    /**
     * Gets the API client, asserting that it exists.
     * This is safe because Atlas tools are only registered when credentials are provided.
     */
    protected get apiClient(): ApiClient;
    protected handleError(error: unknown, args: ToolArgs<typeof this.argsShape>): Promise<CallToolResult> | CallToolResult;
    /**
     *
     * Resolves the tool metadata from the arguments passed to the tool
     *
     * @param args - The arguments passed to the tool
     * @returns The tool metadata
     */
    protected resolveTelemetryMetadata(args: ToolArgs<typeof this.argsShape>, { result }: {
        result: CallToolResult;
    }): AtlasMetadata;
}
//# sourceMappingURL=atlasTool.d.ts.map