import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Session } from "./common/session.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { LogLevel } from "./common/logger.js";
import type { Telemetry } from "./telemetry/telemetry.js";
import type { UserConfig } from "./common/config/userConfig.js";
import type { ToolBase, ToolCategory, ToolClass } from "./tools/tool.js";
import { type ConnectionErrorHandler } from "./common/connectionErrorHandler.js";
import type { Elicitation } from "./elicitation.js";
import type { UIRegistry } from "./ui/registry/index.js";
export interface ServerOptions {
    session: Session;
    userConfig: UserConfig;
    mcpServer: McpServer;
    telemetry: Telemetry;
    elicitation: Elicitation;
    connectionErrorHandler: ConnectionErrorHandler;
    uiRegistry?: UIRegistry;
    /**
     * Custom tool constructors to register with the server.
     * This will override any default tools. You can use both existing and custom tools by using the `mongodb-mcp-server/tools` export.
     *
     * ```ts
     * import { AllTools, ToolBase, type ToolCategory, type OperationType } from "mongodb-mcp-server/tools";
     * class CustomTool extends ToolBase {
     *     override name = "custom_tool";
     *     static category: ToolCategory = "mongodb";
     *     static operationType: OperationType = "read";
     *     public description = "Custom tool description";
     *     public argsShape = {};
     *     protected async execute() {
     *         return { content: [{ type: "text", text: "Result" }] };
     *     }
     *     protected resolveTelemetryMetadata() {
     *         return {};
     *     }
     * }
     * const server = new Server({
     *     session: mySession,
     *     userConfig: myUserConfig,
     *     mcpServer: myMcpServer,
     *     telemetry: myTelemetry,
     *     elicitation: myElicitation,
     *     connectionErrorHandler: myConnectionErrorHandler,
     *     tools: [...AllTools, CustomTool],
     * });
     * ```
     */
    tools?: ToolClass[];
}
export declare class Server {
    readonly session: Session;
    readonly mcpServer: McpServer;
    private readonly telemetry;
    readonly userConfig: UserConfig;
    readonly elicitation: Elicitation;
    private readonly toolConstructors;
    readonly tools: ToolBase[];
    readonly connectionErrorHandler: ConnectionErrorHandler;
    readonly uiRegistry?: UIRegistry;
    private _mcpLogLevel;
    get mcpLogLevel(): LogLevel;
    private readonly startTime;
    private readonly subscriptions;
    constructor({ session, mcpServer, userConfig, telemetry, connectionErrorHandler, elicitation, tools, uiRegistry, }: ServerOptions);
    connect(transport: Transport): Promise<void>;
    close(): Promise<void>;
    sendResourceListChanged(): void;
    isToolCategoryAvailable(name: ToolCategory): boolean;
    sendResourceUpdated(uri: string): void;
    private emitServerTelemetryEvent;
    registerTools(): void;
    registerResources(): void;
    private validateConfig;
    private connectToConfigConnectionString;
}
//# sourceMappingURL=server.d.ts.map