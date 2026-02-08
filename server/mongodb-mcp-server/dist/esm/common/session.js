import { ObjectId } from "bson";
import { createAtlasApiClient } from "./atlas/apiClient.js";
import { LogId } from "./logger.js";
import EventEmitter from "events";
import { ErrorCodes, MongoDBError } from "./errors.js";
import { generateConnectionInfoFromCliArgs } from "@mongosh/arg-parser";
export class Session extends EventEmitter {
    constructor({ userConfig, logger, connectionManager, exportsManager, keychain, atlasLocalClient, vectorSearchEmbeddingsManager, apiClient, }) {
        super();
        this.sessionId = new ObjectId().toString();
        this.userConfig = userConfig;
        this.keychain = keychain;
        this.logger = logger;
        this.apiClient = apiClient;
        // Create default API client if not provided in the constructor and Atlas tools are enabled (credentials are provided)
        if (!this.apiClient && userConfig.apiClientId && userConfig.apiClientSecret) {
            this.apiClient = createAtlasApiClient({
                baseUrl: userConfig.apiBaseUrl,
                credentials: {
                    clientId: userConfig.apiClientId,
                    clientSecret: userConfig.apiClientSecret,
                },
            }, logger);
        }
        this.atlasLocalClient = atlasLocalClient;
        this.exportsManager = exportsManager;
        this.connectionManager = connectionManager;
        this.vectorSearchEmbeddingsManager = vectorSearchEmbeddingsManager;
        this.connectionManager.events.on("connection-success", () => this.emit("connect"));
        this.connectionManager.events.on("connection-time-out", (error) => this.emit("connection-error", error));
        this.connectionManager.events.on("connection-close", () => this.emit("disconnect"));
        this.connectionManager.events.on("connection-error", (error) => this.emit("connection-error", error));
    }
    setMcpClient(mcpClient) {
        if (!mcpClient) {
            this.connectionManager.setClientName("unknown");
            this.logger.debug({
                id: LogId.serverMcpClientSet,
                context: "session",
                message: "MCP client info not found",
            });
        }
        this.mcpClient = {
            name: mcpClient?.name || "unknown",
            version: mcpClient?.version || "unknown",
            title: mcpClient?.title || "unknown",
        };
        // Set the client name on the connection manager for appName generation
        this.connectionManager.setClientName(this.mcpClient.name || "unknown");
    }
    async disconnect() {
        const atlasCluster = this.connectedAtlasCluster;
        await this.connectionManager.close();
        if (atlasCluster?.username && atlasCluster?.projectId && this.apiClient) {
            void this.apiClient
                .deleteDatabaseUser({
                params: {
                    path: {
                        groupId: atlasCluster.projectId,
                        username: atlasCluster.username,
                        databaseName: "admin",
                    },
                },
            })
                .catch((err) => {
                const error = err instanceof Error ? err : new Error(String(err));
                this.logger.error({
                    id: LogId.atlasDeleteDatabaseUserFailure,
                    context: "session",
                    message: `Error deleting previous database user: ${error.message}`,
                });
            });
        }
    }
    async close() {
        await this.disconnect();
        await this.apiClient?.close();
        await this.exportsManager.close();
        this.emit("close");
    }
    async connectToConfiguredConnection() {
        const connectionInfo = generateConnectionInfoFromCliArgs({
            ...this.userConfig,
            connectionSpecifier: this.userConfig.connectionString,
        });
        await this.connectToMongoDB(connectionInfo);
    }
    async connectToMongoDB(settings) {
        await this.connectionManager.connect({ ...settings });
    }
    get isConnectedToMongoDB() {
        return this.connectionManager.currentConnectionState.tag === "connected";
    }
    async isSearchSupported() {
        const state = this.connectionManager.currentConnectionState;
        if (state.tag === "connected") {
            return await state.isSearchSupported();
        }
        return false;
    }
    async assertSearchSupported() {
        const isSearchSupported = await this.isSearchSupported();
        if (!isSearchSupported) {
            throw new MongoDBError(ErrorCodes.AtlasSearchNotSupported, "Atlas Search is not supported in the current cluster.");
        }
    }
    get serviceProvider() {
        if (this.isConnectedToMongoDB) {
            const state = this.connectionManager.currentConnectionState;
            return state.serviceProvider;
        }
        throw new MongoDBError(ErrorCodes.NotConnectedToMongoDB, "Not connected to MongoDB");
    }
    get connectedAtlasCluster() {
        return this.connectionManager.currentConnectionState.connectedAtlasCluster;
    }
    get connectionStringInfo() {
        return this.connectionManager.currentConnectionState.connectionStringInfo;
    }
}
//# sourceMappingURL=session.js.map