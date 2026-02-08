import { Resources } from "./resources/resources.js";
import { LogId, McpLogger } from "./common/logger.js";
import { CallToolRequestSchema, SetLevelRequestSchema, SubscribeRequestSchema, UnsubscribeRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { validateConnectionString } from "./helpers/connectionOptions.js";
import { packageInfo } from "./common/packageInfo.js";
import { AllTools } from "./tools/index.js";
export class Server {
    get mcpLogLevel() {
        return this._mcpLogLevel;
    }
    constructor({ session, mcpServer, userConfig, telemetry, connectionErrorHandler, elicitation, tools, uiRegistry, }) {
        this.tools = [];
        this._mcpLogLevel = "debug";
        this.subscriptions = new Set();
        this.startTime = Date.now();
        this.session = session;
        this.telemetry = telemetry;
        this.mcpServer = mcpServer;
        this.userConfig = userConfig;
        this.elicitation = elicitation;
        this.connectionErrorHandler = connectionErrorHandler;
        this.toolConstructors = tools ?? AllTools;
        this.uiRegistry = uiRegistry;
    }
    async connect(transport) {
        await this.validateConfig();
        // Register resources after the server is initialized so they can listen to events like
        // connection events.
        this.registerResources();
        this.mcpServer.server.registerCapabilities({
            logging: {},
            resources: { listChanged: true, subscribe: true },
        });
        // TODO: Eventually we might want to make tools reactive too instead of relying on custom logic.
        this.registerTools();
        // This is a workaround for an issue we've seen with some models, where they'll see that everything in the `arguments`
        // object is optional, and then not pass it at all. However, the MCP server expects the `arguments` object to be if
        // the tool accepts any arguments, even if they're all optional.
        //
        // see: https://github.com/modelcontextprotocol/typescript-sdk/blob/131776764536b5fdca642df51230a3746fb4ade0/src/server/mcp.ts#L705
        // Since paramsSchema here is not undefined, the server will create a non-optional z.object from it.
        const existingHandler = this.mcpServer.server["_requestHandlers"].get(CallToolRequestSchema.shape.method.value);
        if (!existingHandler) {
            throw new Error("No existing handler found for CallToolRequestSchema");
        }
        this.mcpServer.server.setRequestHandler(CallToolRequestSchema, (request, extra) => {
            if (!request.params.arguments) {
                request.params.arguments = {};
            }
            return existingHandler(request, extra);
        });
        this.mcpServer.server.setRequestHandler(SubscribeRequestSchema, ({ params }) => {
            this.subscriptions.add(params.uri);
            this.session.logger.debug({
                id: LogId.serverInitialized,
                context: "resources",
                message: `Client subscribed to resource: ${params.uri}`,
            });
            return {};
        });
        this.mcpServer.server.setRequestHandler(UnsubscribeRequestSchema, ({ params }) => {
            this.subscriptions.delete(params.uri);
            this.session.logger.debug({
                id: LogId.serverInitialized,
                context: "resources",
                message: `Client unsubscribed from resource: ${params.uri}`,
            });
            return {};
        });
        this.mcpServer.server.setRequestHandler(SetLevelRequestSchema, ({ params }) => {
            if (!McpLogger.LOG_LEVELS.includes(params.level)) {
                throw new Error(`Invalid log level: ${params.level}`);
            }
            this._mcpLogLevel = params.level;
            return {};
        });
        this.mcpServer.server.oninitialized = () => {
            this.session.setMcpClient(this.mcpServer.server.getClientVersion());
            // Placed here to start the connection to the config connection string as soon as the server is initialized.
            void this.connectToConfigConnectionString();
            this.session.logger.info({
                id: LogId.serverInitialized,
                context: "server",
                message: `Server with version ${packageInfo.version} started with transport ${transport.constructor.name} and agent runner ${JSON.stringify(this.session.mcpClient)}`,
            });
            this.emitServerTelemetryEvent("start", Date.now() - this.startTime);
        };
        this.mcpServer.server.onclose = () => {
            const closeTime = Date.now();
            this.emitServerTelemetryEvent("stop", Date.now() - closeTime);
        };
        this.mcpServer.server.onerror = (error) => {
            const closeTime = Date.now();
            this.emitServerTelemetryEvent("stop", Date.now() - closeTime, error);
        };
        await this.mcpServer.connect(transport);
    }
    async close() {
        await this.telemetry.close();
        await this.session.close();
        await this.mcpServer.close();
    }
    sendResourceListChanged() {
        this.mcpServer.sendResourceListChanged();
    }
    isToolCategoryAvailable(name) {
        return !!this.tools.filter((t) => t.category === name).length;
    }
    sendResourceUpdated(uri) {
        this.session.logger.info({
            id: LogId.resourceUpdateFailure,
            context: "resources",
            message: `Resource updated: ${uri}`,
        });
        if (this.subscriptions.has(uri)) {
            void this.mcpServer.server.sendResourceUpdated({ uri });
        }
    }
    emitServerTelemetryEvent(command, commandDuration, error) {
        const event = {
            timestamp: new Date().toISOString(),
            source: "mdbmcp",
            properties: {
                result: "success",
                duration_ms: commandDuration,
                component: "server",
                category: "other",
                command: command,
            },
        };
        if (command === "start") {
            event.properties.startup_time_ms = commandDuration;
            event.properties.read_only_mode = this.userConfig.readOnly ? "true" : "false";
            event.properties.disabled_tools = this.userConfig.disabledTools || [];
            event.properties.confirmation_required_tools = this.userConfig.confirmationRequiredTools || [];
            event.properties.previewFeatures = this.userConfig.previewFeatures;
            event.properties.embeddingProviderConfigured = !!this.userConfig.voyageApiKey;
        }
        if (command === "stop") {
            event.properties.runtime_duration_ms = Date.now() - this.startTime;
            if (error) {
                event.properties.result = "failure";
                event.properties.reason = error.message;
            }
        }
        this.telemetry.emitEvents([event]);
    }
    registerTools() {
        for (const toolConstructor of this.toolConstructors) {
            const tool = new toolConstructor({
                category: toolConstructor.category,
                operationType: toolConstructor.operationType,
                session: this.session,
                config: this.userConfig,
                telemetry: this.telemetry,
                elicitation: this.elicitation,
                uiRegistry: this.uiRegistry,
            });
            if (tool.register(this)) {
                this.tools.push(tool);
            }
        }
    }
    registerResources() {
        for (const resourceConstructor of Resources) {
            const resource = new resourceConstructor(this.session, this.userConfig, this.telemetry);
            resource.register(this);
        }
    }
    async validateConfig() {
        // Validate connection string
        if (this.userConfig.connectionString) {
            try {
                validateConnectionString(this.userConfig.connectionString, false);
            }
            catch (error) {
                throw new Error("Connection string validation failed with error: " +
                    (error instanceof Error ? error.message : String(error)));
            }
        }
        // Validate API client credentials
        if (this.userConfig.apiClientId && this.userConfig.apiClientSecret) {
            try {
                if (!this.session.apiClient) {
                    throw new Error("API client is not available.");
                }
                try {
                    const apiBaseUrl = new URL(this.userConfig.apiBaseUrl);
                    if (apiBaseUrl.protocol !== "https:") {
                        // Log a warning, but don't error out. This is to allow for testing against local or non-HTTPS endpoints.
                        const message = `apiBaseUrl is configured to use ${apiBaseUrl.protocol}, which is not secure. It is strongly recommended to use HTTPS for secure communication.`;
                        this.session.logger.warning({
                            id: LogId.atlasApiBaseUrlInsecure,
                            context: "server",
                            message,
                        });
                    }
                }
                catch (error) {
                    throw new Error(`Invalid apiBaseUrl: ${error instanceof Error ? error.message : String(error)}`);
                }
                await this.session.apiClient.validateAuthConfig();
            }
            catch (error) {
                if (this.userConfig.connectionString === undefined) {
                    throw new Error(`Failed to connect to MongoDB Atlas instance using the credentials from the config: ${error instanceof Error ? error.message : String(error)}`);
                }
                this.session.logger.warning({
                    id: LogId.atlasCheckCredentials,
                    context: "server",
                    message: `Failed to validate MongoDB Atlas API client credentials from the config: ${error instanceof Error ? error.message : String(error)}. Continuing since a connection string is also provided.`,
                });
            }
        }
    }
    async connectToConfigConnectionString() {
        if (this.userConfig.connectionString) {
            try {
                this.session.logger.info({
                    id: LogId.mongodbConnectTry,
                    context: "server",
                    message: `Detected a MongoDB connection string in the configuration, trying to connect...`,
                });
                await this.session.connectToConfiguredConnection();
            }
            catch (error) {
                // We don't throw an error here because we want to allow the server to start even if the connection string is invalid.
                this.session.logger.error({
                    id: LogId.mongodbConnectFailure,
                    context: "server",
                    message: `Failed to connect to MongoDB instance using the connection string from the config: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        }
    }
}
//# sourceMappingURL=server.js.map