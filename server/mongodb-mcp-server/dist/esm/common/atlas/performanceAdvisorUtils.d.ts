import type { ApiClient } from "./apiClient.js";
import type { components } from "./openapi.js";
export type SuggestedIndex = components["schemas"]["PerformanceAdvisorIndex"];
export type DropIndexSuggestion = components["schemas"]["DropIndexSuggestionsIndex"];
export type SlowQueryLog = components["schemas"]["PerformanceAdvisorSlowQuery"];
export declare const DEFAULT_SLOW_QUERY_LOGS_LIMIT = 50;
export declare const SUGGESTED_INDEXES_COPY = "Note: The \"Weight\" field is measured in bytes, and represents the estimated number of bytes saved in disk reads per executed read query that would be saved by implementing an index suggestion. Please convert this to MB or GB for easier readability.";
export declare const SLOW_QUERY_LOGS_COPY = "Please notify the user that the MCP server tool limits slow query logs to the most recent 50 slow query logs. This is a limitation of the MCP server tool only. More slow query logs and performance suggestions can be seen in the Atlas UI. Please give to the user the following docs about the performance advisor: https://www.mongodb.com/docs/atlas/performance-advisor/.";
export type SchemaRecommendation = components["schemas"]["SchemaAdvisorItemRecommendation"];
export declare function getSuggestedIndexes(apiClient: ApiClient, projectId: string, clusterName: string): Promise<{
    suggestedIndexes: Array<SuggestedIndex>;
}>;
export declare function getDropIndexSuggestions(apiClient: ApiClient, projectId: string, clusterName: string): Promise<{
    hiddenIndexes: Array<DropIndexSuggestion>;
    redundantIndexes: Array<DropIndexSuggestion>;
    unusedIndexes: Array<DropIndexSuggestion>;
}>;
export declare function getSchemaAdvice(apiClient: ApiClient, projectId: string, clusterName: string): Promise<{
    recommendations: Array<SchemaRecommendation>;
}>;
export declare function getSlowQueries(apiClient: ApiClient, projectId: string, clusterName: string, since?: Date, namespaces?: Array<string>): Promise<{
    slowQueryLogs: Array<SlowQueryLog>;
}>;
//# sourceMappingURL=performanceAdvisorUtils.d.ts.map