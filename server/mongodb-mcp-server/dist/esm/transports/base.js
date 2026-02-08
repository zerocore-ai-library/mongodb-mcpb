import { packageInfo } from "../common/packageInfo.js";
import { Server } from "../server.js";
import { Session } from "../common/session.js";
import { Telemetry } from "../telemetry/telemetry.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CompositeLogger, ConsoleLogger, DiskLogger, McpLogger } from "../common/logger.js";
import { ExportsManager } from "../common/exportsManager.js";
import { DeviceId } from "../helpers/deviceId.js";
import { Keychain } from "../common/keychain.js";
import { createMCPConnectionManager } from "../common/connectionManager.js";
import { connectionErrorHandler as defaultConnectionErrorHandler, } from "../common/connectionErrorHandler.js";
import { Elicitation } from "../elicitation.js";
import { defaultCreateAtlasLocalClient } from "../common/atlasLocal.js";
import { VectorSearchEmbeddingsManager } from "../common/search/vectorSearchEmbeddingsManager.js";
import { applyConfigOverrides } from "../common/config/configOverrides.js";
import { createAtlasApiClient } from "../common/atlas/apiClient.js";
export class TransportRunnerBase {
    constructor({ userConfig, createConnectionManager = createMCPConnectionManager, connectionErrorHandler = defaultConnectionErrorHandler, createAtlasLocalClient = defaultCreateAtlasLocalClient, additionalLoggers = [], telemetryProperties = {}, tools, createSessionConfig, createApiClient = createAtlasApiClient, }) {
        this.userConfig = userConfig;
        this.createConnectionManager = createConnectionManager;
        this.connectionErrorHandler = connectionErrorHandler;
        this.createAtlasLocalClient = createAtlasLocalClient;
        this.telemetryProperties = telemetryProperties;
        this.tools = tools;
        this.createSessionConfig = createSessionConfig;
        this.createApiClient = createApiClient;
        const loggers = [...additionalLoggers];
        if (this.userConfig.loggers.includes("stderr")) {
            loggers.push(new ConsoleLogger(Keychain.root));
        }
        if (this.userConfig.loggers.includes("disk")) {
            loggers.push(new DiskLogger(this.userConfig.logPath, (err) => {
                // If the disk logger fails to initialize, we log the error to stderr and exit
                // eslint-disable-next-line no-console
                console.error("Error initializing disk logger:", err);
                process.exit(1);
            }, Keychain.root));
        }
        this.logger = new CompositeLogger(...loggers);
        this.deviceId = DeviceId.create(this.logger);
    }
    async setupServer(request, { serverOptions, } = {}) {
        let userConfig = this.userConfig;
        if (this.createSessionConfig) {
            userConfig = await this.createSessionConfig({ userConfig, request });
        }
        else {
            userConfig = applyConfigOverrides({ baseConfig: this.userConfig, request });
        }
        const mcpServer = new McpServer({
            name: packageInfo.mcpServerName,
            version: packageInfo.version,
        }, {
            instructions: TransportRunnerBase.getInstructions(userConfig),
        });
        const logger = new CompositeLogger(this.logger);
        const exportsManager = ExportsManager.init(userConfig, logger);
        const connectionManager = await this.createConnectionManager({
            logger,
            userConfig,
            deviceId: this.deviceId,
        });
        let apiClient;
        if (userConfig.apiClientId && userConfig.apiClientSecret) {
            apiClient = this.createApiClient({
                baseUrl: userConfig.apiBaseUrl,
                credentials: {
                    clientId: userConfig.apiClientId,
                    clientSecret: userConfig.apiClientSecret,
                },
                requestContext: request,
            }, logger);
        }
        const session = new Session({
            userConfig,
            atlasLocalClient: await this.createAtlasLocalClient({ logger }),
            logger,
            exportsManager,
            connectionManager,
            keychain: Keychain.root,
            vectorSearchEmbeddingsManager: new VectorSearchEmbeddingsManager(userConfig, connectionManager),
            apiClient,
        });
        const telemetry = Telemetry.create(session, userConfig, this.deviceId, {
            commonProperties: this.telemetryProperties,
        });
        const elicitation = new Elicitation({ server: mcpServer.server });
        let uiRegistry = serverOptions?.uiRegistry;
        if (!uiRegistry && userConfig.previewFeatures.includes("mcpUI")) {
            const uiRegistryModule = await import("../ui/registry/registry.js");
            uiRegistry = new uiRegistryModule.UIRegistry();
        }
        const result = new Server({
            mcpServer,
            session,
            telemetry,
            userConfig,
            connectionErrorHandler: this.connectionErrorHandler,
            elicitation,
            tools: this.tools,
            uiRegistry,
        });
        // We need to create the MCP logger after the server is constructed
        // because it needs the server instance
        if (userConfig.loggers.includes("mcp")) {
            logger.addLogger(new McpLogger(result, Keychain.root));
        }
        return result;
    }
    async close() {
        try {
            await this.closeTransport();
        }
        finally {
            this.deviceId.close();
        }
    }
    static getInstructions(config) {
        let instructions = `
            This is the MongoDB MCP server.
        `;
        if (config.connectionString) {
            instructions += `
            This MCP server was configured with a MongoDB connection string, and you can assume that you are connected to a MongoDB cluster.
            `;
        }
        if (config.apiClientId && config.apiClientSecret) {
            instructions += `
            This MCP server was configured with MongoDB Atlas API credentials.`;
        }
        return instructions;
    }
}
//# sourceMappingURL=base.js.map