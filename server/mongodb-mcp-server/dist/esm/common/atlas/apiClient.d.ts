import type { FetchOptions } from "openapi-fetch";
import type { operations } from "./openapi.js";
import type { CommonProperties, TelemetryEvent } from "../../telemetry/types.js";
import type { LoggerBase } from "../logger.js";
import type { Credentials, AuthProvider } from "./auth/authProvider.js";
export interface ApiClientOptions {
    baseUrl: string;
    userAgent?: string;
    credentials?: Credentials;
    requestContext?: RequestContext;
}
type RequestContext = {
    headers?: Record<string, string | string[] | undefined>;
};
export type ApiClientFactoryFn = (options: ApiClientOptions, logger: LoggerBase) => ApiClient;
export declare const createAtlasApiClient: ApiClientFactoryFn;
export declare class ApiClient {
    readonly logger: LoggerBase;
    readonly authProvider?: AuthProvider | undefined;
    private readonly options;
    private customFetch;
    private client;
    isAuthConfigured(): boolean;
    constructor(options: ApiClientOptions, logger: LoggerBase, authProvider?: AuthProvider | undefined);
    private createAuthMiddleware;
    validateAuthConfig(): Promise<void>;
    close(): Promise<void>;
    getIpInfo(): Promise<{
        currentIpv4Address: string;
    }>;
    sendEvents(events: TelemetryEvent<CommonProperties>[]): Promise<void>;
    private sendAuthEvents;
    private sendUnauthEvents;
    listClusterDetails(options?: FetchOptions<operations["listClusterDetails"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["OrgGroup"][];
        readonly totalCount?: number;
    }>;
    listGroups(options?: FetchOptions<operations["listGroups"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["Group"][];
        readonly totalCount?: number;
    }>;
    createGroup(options: FetchOptions<operations["createGroup"]>): Promise<{
        readonly clusterCount: number;
        readonly created: string;
        readonly id?: string;
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        name: string;
        orgId: string;
        regionUsageRestrictions: "COMMERCIAL_FEDRAMP_REGIONS_ONLY" | "GOV_REGIONS_ONLY";
        tags?: import("./openapi.js").components["schemas"]["ResourceTag"][];
        withDefaultAlertsSettings: boolean;
    }>;
    deleteGroup(options: FetchOptions<operations["deleteGroup"]>): Promise<void>;
    getGroup(options: FetchOptions<operations["getGroup"]>): Promise<{
        readonly clusterCount: number;
        readonly created: string;
        readonly id?: string;
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        name: string;
        orgId: string;
        regionUsageRestrictions: "COMMERCIAL_FEDRAMP_REGIONS_ONLY" | "GOV_REGIONS_ONLY";
        tags?: import("./openapi.js").components["schemas"]["ResourceTag"][];
        withDefaultAlertsSettings: boolean;
    }>;
    listAccessListEntries(options: FetchOptions<operations["listGroupAccessListEntries"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["NetworkPermissionEntry"][];
        readonly totalCount?: number;
    }>;
    createAccessListEntry(options: FetchOptions<operations["createGroupAccessListEntry"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["NetworkPermissionEntry"][];
        readonly totalCount?: number;
    }>;
    deleteAccessListEntry(options: FetchOptions<operations["deleteGroupAccessListEntry"]>): Promise<void>;
    listAlerts(options: FetchOptions<operations["listGroupAlerts"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["AlertViewForNdsGroup"][];
        readonly totalCount?: number;
    }>;
    listClusters(options: FetchOptions<operations["listGroupClusters"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["ClusterDescription20240805"][];
        readonly totalCount?: number;
    }>;
    createCluster(options: FetchOptions<operations["createGroupCluster"]>): Promise<{
        acceptDataRisksAndForceReplicaSetReconfig?: string;
        advancedConfiguration?: import("./openapi.js").components["schemas"]["ApiAtlasClusterAdvancedConfigurationView"];
        backupEnabled: boolean;
        biConnector?: import("./openapi.js").components["schemas"]["BiConnector"];
        clusterType?: "REPLICASET" | "SHARDED" | "GEOSHARDED";
        configServerManagementMode: "ATLAS_MANAGED" | "FIXED_TO_DEDICATED";
        readonly configServerType?: "DEDICATED" | "EMBEDDED";
        connectionStrings?: import("./openapi.js").components["schemas"]["ClusterConnectionStrings"];
        readonly createDate?: string;
        diskWarmingMode: "FULLY_WARMED" | "VISIBLE_EARLIER";
        encryptionAtRestProvider?: "NONE" | "AWS" | "AZURE" | "GCP";
        readonly featureCompatibilityVersion?: string;
        readonly featureCompatibilityVersionExpirationDate?: string;
        globalClusterSelfManagedSharding?: boolean;
        readonly groupId?: string;
        readonly id?: string;
        readonly internalClusterRole?: "NONE" | "SYSTEM_CLUSTER" | "INTERNAL_SHADOW_CLUSTER";
        labels?: import("./openapi.js").components["schemas"]["ComponentLabel"][];
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        mongoDBEmployeeAccessGrant?: import("./openapi.js").components["schemas"]["EmployeeAccessGrantView"];
        mongoDBMajorVersion?: string;
        readonly mongoDBVersion?: string;
        name?: string;
        paused?: boolean;
        pitEnabled?: boolean;
        redactClientLogData?: boolean;
        replicaSetScalingStrategy: "SEQUENTIAL" | "WORKLOAD_TYPE" | "NODE_TYPE";
        replicationSpecs?: import("./openapi.js").components["schemas"]["ReplicationSpec20240805"][];
        retainBackups: boolean;
        rootCertType: "ISRGROOTX1";
        readonly stateName?: "IDLE" | "CREATING" | "UPDATING" | "DELETING" | "REPAIRING";
        tags?: import("./openapi.js").components["schemas"]["ResourceTag"][];
        terminationProtectionEnabled: boolean;
        useAwsTimeBasedSnapshotCopyForFastInitialSync: boolean;
        versionReleaseSystem: "LTS" | "CONTINUOUS";
    }>;
    deleteCluster(options: FetchOptions<operations["deleteGroupCluster"]>): Promise<void>;
    getCluster(options: FetchOptions<operations["getGroupCluster"]>): Promise<{
        acceptDataRisksAndForceReplicaSetReconfig?: string;
        advancedConfiguration?: import("./openapi.js").components["schemas"]["ApiAtlasClusterAdvancedConfigurationView"];
        backupEnabled: boolean;
        biConnector?: import("./openapi.js").components["schemas"]["BiConnector"];
        clusterType?: "REPLICASET" | "SHARDED" | "GEOSHARDED";
        configServerManagementMode: "ATLAS_MANAGED" | "FIXED_TO_DEDICATED";
        readonly configServerType?: "DEDICATED" | "EMBEDDED";
        connectionStrings?: import("./openapi.js").components["schemas"]["ClusterConnectionStrings"];
        readonly createDate?: string;
        diskWarmingMode: "FULLY_WARMED" | "VISIBLE_EARLIER";
        encryptionAtRestProvider?: "NONE" | "AWS" | "AZURE" | "GCP";
        readonly featureCompatibilityVersion?: string;
        readonly featureCompatibilityVersionExpirationDate?: string;
        globalClusterSelfManagedSharding?: boolean;
        readonly groupId?: string;
        readonly id?: string;
        readonly internalClusterRole?: "NONE" | "SYSTEM_CLUSTER" | "INTERNAL_SHADOW_CLUSTER";
        labels?: import("./openapi.js").components["schemas"]["ComponentLabel"][];
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        mongoDBEmployeeAccessGrant?: import("./openapi.js").components["schemas"]["EmployeeAccessGrantView"];
        mongoDBMajorVersion?: string;
        readonly mongoDBVersion?: string;
        name?: string;
        paused?: boolean;
        pitEnabled?: boolean;
        redactClientLogData?: boolean;
        replicaSetScalingStrategy: "SEQUENTIAL" | "WORKLOAD_TYPE" | "NODE_TYPE";
        replicationSpecs?: import("./openapi.js").components["schemas"]["ReplicationSpec20240805"][];
        retainBackups: boolean;
        rootCertType: "ISRGROOTX1";
        readonly stateName?: "IDLE" | "CREATING" | "UPDATING" | "DELETING" | "REPAIRING";
        tags?: import("./openapi.js").components["schemas"]["ResourceTag"][];
        terminationProtectionEnabled: boolean;
        useAwsTimeBasedSnapshotCopyForFastInitialSync: boolean;
        versionReleaseSystem: "LTS" | "CONTINUOUS";
    }>;
    listDropIndexSuggestions(options: FetchOptions<operations["listGroupClusterPerformanceAdvisorDropIndexSuggestions"]>): Promise<{
        readonly hiddenIndexes?: import("./openapi.js").components["schemas"]["DropIndexSuggestionsIndex"][];
        readonly redundantIndexes?: import("./openapi.js").components["schemas"]["DropIndexSuggestionsIndex"][];
        readonly unusedIndexes?: import("./openapi.js").components["schemas"]["DropIndexSuggestionsIndex"][];
    }>;
    listSchemaAdvice(options: FetchOptions<operations["listGroupClusterPerformanceAdvisorSchemaAdvice"]>): Promise<{
        readonly recommendations?: import("./openapi.js").components["schemas"]["SchemaAdvisorItemRecommendation"][];
    }>;
    listClusterSuggestedIndexes(options: FetchOptions<operations["listGroupClusterPerformanceAdvisorSuggestedIndexes"]>): Promise<{
        readonly shapes?: import("./openapi.js").components["schemas"]["PerformanceAdvisorShape"][];
        readonly suggestedIndexes?: import("./openapi.js").components["schemas"]["PerformanceAdvisorIndex"][];
    }>;
    listDatabaseUsers(options: FetchOptions<operations["listGroupDatabaseUsers"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["CloudDatabaseUser"][];
        readonly totalCount?: number;
    }>;
    createDatabaseUser(options: FetchOptions<operations["createGroupDatabaseUser"]>): Promise<{
        awsIAMType: "NONE" | "USER" | "ROLE";
        databaseName: "admin" | "$external";
        deleteAfterDate?: string;
        description?: string;
        groupId: string;
        labels?: import("./openapi.js").components["schemas"]["ComponentLabel"][];
        ldapAuthType: "NONE" | "GROUP" | "USER";
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        oidcAuthType: "NONE" | "IDP_GROUP" | "USER";
        password?: string;
        roles?: import("./openapi.js").components["schemas"]["DatabaseUserRole"][];
        scopes?: import("./openapi.js").components["schemas"]["UserScope"][];
        username: string;
        x509Type: "NONE" | "CUSTOMER" | "MANAGED";
    }>;
    deleteDatabaseUser(options: FetchOptions<operations["deleteGroupDatabaseUser"]>): Promise<void>;
    listFlexClusters(options: FetchOptions<operations["listGroupFlexClusters"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["FlexClusterDescription20241113"][];
        readonly totalCount?: number;
    }>;
    createFlexCluster(options: FetchOptions<operations["createGroupFlexCluster"]>): Promise<{
        backupSettings?: import("./openapi.js").components["schemas"]["FlexBackupSettings20241113"];
        readonly clusterType: "REPLICASET";
        connectionStrings?: import("./openapi.js").components["schemas"]["FlexConnectionStrings20241113"];
        readonly createDate?: string;
        readonly groupId?: string;
        readonly id?: string;
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly mongoDBVersion?: string;
        readonly name?: string;
        providerSettings: import("./openapi.js").components["schemas"]["FlexProviderSettings20241113"];
        readonly stateName?: "IDLE" | "CREATING" | "UPDATING" | "DELETING" | "REPAIRING";
        tags?: import("./openapi.js").components["schemas"]["ResourceTag"][];
        terminationProtectionEnabled: boolean;
        readonly versionReleaseSystem: "LTS";
    }>;
    deleteFlexCluster(options: FetchOptions<operations["deleteGroupFlexCluster"]>): Promise<void>;
    getFlexCluster(options: FetchOptions<operations["getGroupFlexCluster"]>): Promise<{
        backupSettings?: import("./openapi.js").components["schemas"]["FlexBackupSettings20241113"];
        readonly clusterType: "REPLICASET";
        connectionStrings?: import("./openapi.js").components["schemas"]["FlexConnectionStrings20241113"];
        readonly createDate?: string;
        readonly groupId?: string;
        readonly id?: string;
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly mongoDBVersion?: string;
        readonly name?: string;
        providerSettings: import("./openapi.js").components["schemas"]["FlexProviderSettings20241113"];
        readonly stateName?: "IDLE" | "CREATING" | "UPDATING" | "DELETING" | "REPAIRING";
        tags?: import("./openapi.js").components["schemas"]["ResourceTag"][];
        terminationProtectionEnabled: boolean;
        readonly versionReleaseSystem: "LTS";
    }>;
    listSlowQueryLogs(options: FetchOptions<operations["listGroupProcessPerformanceAdvisorSlowQueryLogs"]>): Promise<{
        readonly slowQueries?: import("./openapi.js").components["schemas"]["PerformanceAdvisorSlowQuery"][];
    }>;
    listOrgs(options?: FetchOptions<operations["listOrgs"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["AtlasOrganization"][];
        readonly totalCount?: number;
    }>;
    getOrgGroups(options: FetchOptions<operations["getOrgGroups"]>): Promise<{
        readonly links?: import("./openapi.js").components["schemas"]["Link"][];
        readonly results?: import("./openapi.js").components["schemas"]["Group"][];
        readonly totalCount?: number;
    }>;
}
export {};
//# sourceMappingURL=apiClient.d.ts.map