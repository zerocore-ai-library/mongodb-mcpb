import { EventEmitter } from "events";
import { NodeDriverServiceProvider } from "@mongosh/service-provider-node-driver";
import { type ConnectionInfo } from "@mongosh/arg-parser";
import type { DeviceId } from "../helpers/deviceId.js";
import { type UserConfig } from "./config/userConfig.js";
import { type LoggerBase } from "./logger.js";
import { type ConnectionStringInfo, type AtlasClusterConnectionInfo } from "./connectionInfo.js";
export type { ConnectionStringInfo, ConnectionStringAuthType, AtlasClusterConnectionInfo } from "./connectionInfo.js";
export interface ConnectionSettings extends Omit<ConnectionInfo, "driverOptions"> {
    driverOptions?: ConnectionInfo["driverOptions"];
    atlas?: AtlasClusterConnectionInfo;
}
type ConnectionTag = "connected" | "connecting" | "disconnected" | "errored";
type OIDCConnectionAuthType = "oidc-auth-flow" | "oidc-device-flow";
export interface ConnectionState {
    tag: ConnectionTag;
    connectionStringInfo?: ConnectionStringInfo;
    connectedAtlasCluster?: AtlasClusterConnectionInfo;
}
export declare const defaultDriverOptions: ConnectionInfo["driverOptions"];
export declare class ConnectionStateConnected implements ConnectionState {
    serviceProvider: NodeDriverServiceProvider;
    connectionStringInfo?: ConnectionStringInfo | undefined;
    connectedAtlasCluster?: AtlasClusterConnectionInfo | undefined;
    tag: "connected";
    constructor(serviceProvider: NodeDriverServiceProvider, connectionStringInfo?: ConnectionStringInfo | undefined, connectedAtlasCluster?: AtlasClusterConnectionInfo | undefined);
    private _isSearchSupported?;
    isSearchSupported(): Promise<boolean>;
}
export interface ConnectionStateConnecting extends ConnectionState {
    tag: "connecting";
    serviceProvider: Promise<NodeDriverServiceProvider>;
    oidcConnectionType: OIDCConnectionAuthType;
    oidcLoginUrl?: string;
    oidcUserCode?: string;
}
export interface ConnectionStateDisconnected extends ConnectionState {
    tag: "disconnected";
}
export interface ConnectionStateErrored extends ConnectionState {
    tag: "errored";
    errorReason: string;
}
export type AnyConnectionState = ConnectionStateConnected | ConnectionStateConnecting | ConnectionStateDisconnected | ConnectionStateErrored;
export interface ConnectionManagerEvents {
    "connection-request": [AnyConnectionState];
    "connection-success": [ConnectionStateConnected];
    "connection-time-out": [ConnectionStateErrored];
    "connection-close": [ConnectionStateDisconnected];
    "connection-error": [ConnectionStateErrored];
    close: [AnyConnectionState];
}
export declare abstract class ConnectionManager {
    clientName: string;
    protected readonly _events: EventEmitter<ConnectionManagerEvents>;
    readonly events: Pick<EventEmitter<ConnectionManagerEvents>, "on" | "off" | "once">;
    private state;
    constructor();
    get currentConnectionState(): AnyConnectionState;
    protected changeState<Event extends keyof ConnectionManagerEvents, State extends ConnectionManagerEvents[Event][0]>(event: Event, newState: State): State;
    setClientName(clientName: string): void;
    abstract connect(settings: ConnectionSettings): Promise<AnyConnectionState>;
    abstract disconnect(): Promise<ConnectionStateDisconnected | ConnectionStateErrored>;
    abstract close(): Promise<void>;
}
export declare class MCPConnectionManager extends ConnectionManager {
    private userConfig;
    private logger;
    private deviceId;
    private bus;
    constructor(userConfig: UserConfig, logger: LoggerBase, deviceId: DeviceId, bus?: EventEmitter);
    connect(settings: ConnectionSettings): Promise<AnyConnectionState>;
    disconnect(): Promise<ConnectionStateDisconnected | ConnectionStateErrored>;
    close(): Promise<void>;
    private onOidcAuthFailed;
    private onOidcAuthSucceeded;
    private onOidcNotifyDeviceFlow;
    private disconnectOnOidcError;
}
/**
 * Consumers of MCP server library have option to bring their own connection
 * management if they need to. To support that, we enable injecting connection
 * manager implementation through a factory function.
 */
export type ConnectionManagerFactoryFn = (createParams: {
    logger: LoggerBase;
    deviceId: DeviceId;
    userConfig: UserConfig;
}) => Promise<ConnectionManager>;
export declare const createMCPConnectionManager: ConnectionManagerFactoryFn;
//# sourceMappingURL=connectionManager.d.ts.map