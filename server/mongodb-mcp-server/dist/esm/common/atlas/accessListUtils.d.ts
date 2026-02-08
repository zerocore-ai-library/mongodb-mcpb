import type { ApiClient } from "./apiClient.js";
export declare const DEFAULT_ACCESS_LIST_COMMENT = "Added by MongoDB MCP Server to enable tool access";
export declare function makeCurrentIpAccessListEntry(apiClient: ApiClient, projectId: string, comment?: string): Promise<{
    groupId: string;
    ipAddress: string;
    comment: string;
}>;
/**
 * Ensures the current public IP is in the access list for the given Atlas project.
 * If the IP is already present, this is a no-op.
 * @param apiClient The Atlas API client instance
 * @param projectId The Atlas project ID
 * @returns Promise<boolean> - true if a new IP access list entry was created, false if it already existed
 */
export declare function ensureCurrentIpInAccessList(apiClient: ApiClient, projectId: string): Promise<boolean>;
//# sourceMappingURL=accessListUtils.d.ts.map