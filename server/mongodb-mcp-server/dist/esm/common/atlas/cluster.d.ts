import type { ClusterConnectionStrings, ClusterDescription20240805, FlexClusterDescription20241113 } from "./openapi.js";
import type { ApiClient } from "./apiClient.js";
export interface Cluster {
    name?: string;
    instanceType: "FREE" | "DEDICATED" | "FLEX";
    instanceSize?: string;
    state?: "IDLE" | "CREATING" | "UPDATING" | "DELETING" | "REPAIRING";
    mongoDBVersion?: string;
    connectionStrings?: ClusterConnectionStrings;
    processIds?: Array<string>;
}
export declare function formatFlexCluster(cluster: FlexClusterDescription20241113): Cluster;
export declare function formatCluster(cluster: ClusterDescription20240805): Cluster;
export declare function inspectCluster(apiClient: ApiClient, projectId: string, clusterName: string): Promise<Cluster>;
/**
 * Returns a connection string for the specified connectionType.
 * For "privateEndpoint", it returns the first private endpoint connection string available.
 */
export declare function getConnectionString(connectionStrings: ClusterConnectionStrings, connectionType: "standard" | "private" | "privateEndpoint"): string | undefined;
export declare function getProcessIdsFromCluster(apiClient: ApiClient, projectId: string, clusterName: string): Promise<Array<string>>;
//# sourceMappingURL=cluster.d.ts.map