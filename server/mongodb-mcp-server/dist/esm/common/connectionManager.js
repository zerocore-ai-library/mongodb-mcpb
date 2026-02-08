import { EventEmitter } from "events";
import { NodeDriverServiceProvider } from "@mongosh/service-provider-node-driver";
import { generateConnectionInfoFromCliArgs } from "@mongosh/arg-parser";
import { MongoDBError, ErrorCodes } from "./errors.js";
import { LogId } from "./logger.js";
import { packageInfo } from "./packageInfo.js";
import { setAppNameParamIfMissing } from "../helpers/connectionOptions.js";
import { getConnectionStringInfo, } from "./connectionInfo.js";
const MCP_TEST_DATABASE = "#mongodb-mcp";
export const defaultDriverOptions = {
    readConcern: {
        level: "local",
    },
    readPreference: "secondaryPreferred",
    writeConcern: {
        w: "majority",
    },
    timeoutMS: 30000,
    proxy: { useEnvironmentVariableProxies: true },
    applyProxyToOIDC: true,
};
export class ConnectionStateConnected {
    constructor(serviceProvider, connectionStringInfo, connectedAtlasCluster) {
        this.serviceProvider = serviceProvider;
        this.connectionStringInfo = connectionStringInfo;
        this.connectedAtlasCluster = connectedAtlasCluster;
        this.tag = "connected";
    }
    async isSearchSupported() {
        if (this._isSearchSupported === undefined) {
            try {
                // If a cluster supports search indexes, the call below will succeed
                // with a cursor otherwise will throw an Error.
                // the Search Index Management Service might not be ready yet, but
                // we assume that the agent can retry in that situation.
                await this.serviceProvider.getSearchIndexes(MCP_TEST_DATABASE, "test");
                this._isSearchSupported = true;
            }
            catch {
                this._isSearchSupported = false;
            }
        }
        return this._isSearchSupported;
    }
}
export class ConnectionManager {
    constructor() {
        this.clientName = "unknown";
        this.events = this._events = new EventEmitter();
        this.state = { tag: "disconnected" };
    }
    get currentConnectionState() {
        return this.state;
    }
    changeState(event, newState) {
        this.state = newState;
        // TypeScript doesn't seem to be happy with the spread operator and generics
        // eslint-disable-next-line
        this._events.emit(event, ...[newState]);
        return newState;
    }
    setClientName(clientName) {
        this.clientName = clientName;
    }
}
export class MCPConnectionManager extends ConnectionManager {
    constructor(userConfig, logger, deviceId, bus) {
        super();
        this.userConfig = userConfig;
        this.logger = logger;
        this.bus = bus ?? new EventEmitter();
        this.bus.on("mongodb-oidc-plugin:auth-failed", this.onOidcAuthFailed.bind(this));
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.bus.on("mongodb-oidc-plugin:auth-succeeded", this.onOidcAuthSucceeded.bind(this));
        this.deviceId = deviceId;
    }
    async connect(settings) {
        var _a, _b, _c, _d;
        this._events.emit("connection-request", this.currentConnectionState);
        if (this.currentConnectionState.tag === "connected" || this.currentConnectionState.tag === "connecting") {
            await this.disconnect();
        }
        let serviceProvider;
        let connectionStringInfo = { authType: "scram", hostType: "unknown" };
        try {
            settings = { ...settings };
            const appNameComponents = {
                appName: `${packageInfo.mcpServerName} ${packageInfo.version}`,
                deviceId: this.deviceId.get(),
                clientName: this.clientName,
            };
            settings.connectionString = await setAppNameParamIfMissing({
                connectionString: settings.connectionString,
                components: appNameComponents,
            });
            const connectionInfo = settings.driverOptions
                ? {
                    connectionString: settings.connectionString,
                    driverOptions: settings.driverOptions,
                }
                : generateConnectionInfoFromCliArgs({
                    ...defaultDriverOptions,
                    connectionSpecifier: settings.connectionString,
                });
            if (connectionInfo.driverOptions.oidc) {
                (_a = connectionInfo.driverOptions.oidc).allowedFlows ?? (_a.allowedFlows = ["auth-code"]);
                (_b = connectionInfo.driverOptions.oidc).notifyDeviceFlow ?? (_b.notifyDeviceFlow = this.onOidcNotifyDeviceFlow.bind(this));
            }
            (_c = connectionInfo.driverOptions).proxy ?? (_c.proxy = { useEnvironmentVariableProxies: true });
            (_d = connectionInfo.driverOptions).applyProxyToOIDC ?? (_d.applyProxyToOIDC = true);
            connectionStringInfo = getConnectionStringInfo(connectionInfo.connectionString, this.userConfig, settings.atlas);
            serviceProvider = NodeDriverServiceProvider.connect(connectionInfo.connectionString, {
                productDocsLink: "https://github.com/mongodb-js/mongodb-mcp-server/",
                productName: "MongoDB MCP",
                ...connectionInfo.driverOptions,
            }, undefined, this.bus);
        }
        catch (error) {
            const errorReason = error instanceof Error ? error.message : `${error}`;
            this.changeState("connection-error", {
                tag: "errored",
                errorReason,
                connectionStringInfo,
                connectedAtlasCluster: settings.atlas,
            });
            throw new MongoDBError(ErrorCodes.MisconfiguredConnectionString, errorReason);
        }
        try {
            if (connectionStringInfo.authType.startsWith("oidc")) {
                return this.changeState("connection-request", {
                    tag: "connecting",
                    serviceProvider,
                    connectedAtlasCluster: settings.atlas,
                    connectionStringInfo,
                    oidcConnectionType: connectionStringInfo.authType,
                });
            }
            return this.changeState("connection-success", new ConnectionStateConnected(await serviceProvider, connectionStringInfo, settings.atlas));
        }
        catch (error) {
            const errorReason = error instanceof Error ? error.message : `${error}`;
            this.changeState("connection-error", {
                tag: "errored",
                errorReason,
                connectionStringInfo,
                connectedAtlasCluster: settings.atlas,
            });
            throw new MongoDBError(ErrorCodes.NotConnectedToMongoDB, errorReason);
        }
    }
    async disconnect() {
        if (this.currentConnectionState.tag === "disconnected" || this.currentConnectionState.tag === "errored") {
            return this.currentConnectionState;
        }
        if (this.currentConnectionState.tag === "connected" || this.currentConnectionState.tag === "connecting") {
            try {
                if (this.currentConnectionState.tag === "connected") {
                    await this.currentConnectionState.serviceProvider?.close();
                }
                if (this.currentConnectionState.tag === "connecting") {
                    const serviceProvider = await this.currentConnectionState.serviceProvider;
                    await serviceProvider.close();
                }
            }
            finally {
                this.changeState("connection-close", {
                    tag: "disconnected",
                });
            }
        }
        return { tag: "disconnected" };
    }
    async close() {
        try {
            await this.disconnect();
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            this.logger.error({
                id: LogId.mongodbDisconnectFailure,
                context: "ConnectionManager",
                message: `Error when closing ConnectionManager: ${error.message}`,
            });
        }
        finally {
            this._events.emit("close", this.currentConnectionState);
        }
    }
    onOidcAuthFailed(error) {
        if (this.currentConnectionState.tag === "connecting" &&
            this.currentConnectionState.connectionStringInfo?.authType?.startsWith("oidc")) {
            void this.disconnectOnOidcError(error);
        }
    }
    async onOidcAuthSucceeded() {
        if (this.currentConnectionState.tag === "connecting" &&
            this.currentConnectionState.connectionStringInfo?.authType?.startsWith("oidc")) {
            this.changeState("connection-success", new ConnectionStateConnected(await this.currentConnectionState.serviceProvider, this.currentConnectionState.connectionStringInfo, this.currentConnectionState.connectedAtlasCluster));
        }
        this.logger.info({
            id: LogId.oidcFlow,
            context: "mongodb-oidc-plugin:auth-succeeded",
            message: "Authenticated successfully.",
        });
    }
    onOidcNotifyDeviceFlow(flowInfo) {
        if (this.currentConnectionState.tag === "connecting" &&
            this.currentConnectionState.connectionStringInfo?.authType?.startsWith("oidc")) {
            this.changeState("connection-request", {
                ...this.currentConnectionState,
                tag: "connecting",
                connectionStringInfo: {
                    ...this.currentConnectionState.connectionStringInfo,
                    authType: "oidc-device-flow",
                },
                oidcLoginUrl: flowInfo.verificationUrl,
                oidcUserCode: flowInfo.userCode,
            });
        }
        this.logger.info({
            id: LogId.oidcFlow,
            context: "mongodb-oidc-plugin:notify-device-flow",
            message: "OIDC Flow changed automatically to device flow.",
        });
    }
    async disconnectOnOidcError(error) {
        try {
            await this.disconnect();
        }
        catch (error) {
            this.logger.warning({
                id: LogId.oidcFlow,
                context: "disconnectOnOidcError",
                message: String(error),
            });
        }
        finally {
            this.changeState("connection-error", { tag: "errored", errorReason: String(error) });
        }
    }
}
export const createMCPConnectionManager = ({ logger, deviceId, userConfig }) => {
    return Promise.resolve(new MCPConnectionManager(userConfig, logger, deviceId));
};
//# sourceMappingURL=connectionManager.js.map