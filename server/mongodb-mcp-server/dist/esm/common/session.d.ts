import type { ApiClient } from "./atlas/apiClient.js";
import type { Implementation } from "@modelcontextprotocol/sdk/types.js";
import type { CompositeLogger } from "./logger.js";
import EventEmitter from "events";
import type { AtlasClusterConnectionInfo, ConnectionManager, ConnectionSettings, ConnectionStateErrored } from "./connectionManager.js";
import type { ConnectionStringInfo } from "./connectionInfo.js";
import type { NodeDriverServiceProvider } from "@mongosh/service-provider-node-driver";
import type { ExportsManager } from "./exportsManager.js";
import type { Client } from "@mongodb-js/atlas-local";
import type { Keychain } from "./keychain.js";
import type { VectorSearchEmbeddingsManager } from "./search/vectorSearchEmbeddingsManager.js";
import { type UserConfig } from "../common/config/userConfig.js";
export interface SessionOptions {
    userConfig: UserConfig;
    logger: CompositeLogger;
    exportsManager: ExportsManager;
    connectionManager: ConnectionManager;
    keychain: Keychain;
    atlasLocalClient?: Client;
    vectorSearchEmbeddingsManager: VectorSearchEmbeddingsManager;
    apiClient?: ApiClient;
}
export type SessionEvents = {
    connect: [];
    close: [];
    disconnect: [];
    "connection-error": [ConnectionStateErrored];
};
export declare class Session extends EventEmitter<SessionEvents> {
    private readonly userConfig;
    readonly sessionId: string;
    readonly exportsManager: ExportsManager;
    readonly connectionManager: ConnectionManager;
    readonly apiClient?: ApiClient;
    readonly atlasLocalClient?: Client;
    readonly keychain: Keychain;
    readonly vectorSearchEmbeddingsManager: VectorSearchEmbeddingsManager;
    mcpClient?: {
        name?: string;
        version?: string;
        title?: string;
    };
    logger: CompositeLogger;
    constructor({ userConfig, logger, connectionManager, exportsManager, keychain, atlasLocalClient, vectorSearchEmbeddingsManager, apiClient, }: SessionOptions);
    setMcpClient(mcpClient: Implementation | undefined): void;
    disconnect(): Promise<void>;
    close(): Promise<void>;
    connectToConfiguredConnection(): Promise<void>;
    connectToMongoDB(settings: ConnectionSettings): Promise<void>;
    get isConnectedToMongoDB(): boolean;
    isSearchSupported(): Promise<boolean>;
    assertSearchSupported(): Promise<void>;
    get serviceProvider(): NodeDriverServiceProvider;
    get connectedAtlasCluster(): AtlasClusterConnectionInfo | undefined;
    get connectionStringInfo(): ConnectionStringInfo | undefined;
}
//# sourceMappingURL=session.d.ts.map