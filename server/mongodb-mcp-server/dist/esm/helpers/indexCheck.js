import { ErrorCodes, MongoDBError } from "../common/errors.js";
import { LogId } from "../common/logger.js";
/**
 * Check if the query plan uses an index
 * @param explainResult The result of the explain query
 * @returns true if an index is used, false if it's a full collection scan
 */
export function usesIndex(explainResult) {
    const queryPlanner = explainResult?.queryPlanner;
    const winningPlan = queryPlanner?.winningPlan;
    const stage = winningPlan?.stage;
    const inputStage = winningPlan?.inputStage;
    // Check for index scan stages (including MongoDB 8.0+ stages)
    const indexScanStages = [
        "IXSCAN",
        "COUNT_SCAN",
        "EXPRESS_IXSCAN",
        "EXPRESS_CLUSTERED_IXSCAN",
        "EXPRESS_UPDATE",
        "EXPRESS_DELETE",
        "IDHACK",
    ];
    if (stage && indexScanStages.includes(stage)) {
        return true;
    }
    if (inputStage && inputStage.stage && indexScanStages.includes(inputStage.stage)) {
        return true;
    }
    // Recursively check deeper stages
    if (inputStage && inputStage.inputStage) {
        return usesIndex({ queryPlanner: { winningPlan: inputStage } });
    }
    if (stage === "COLLSCAN") {
        return false;
    }
    // Default to false (conservative approach)
    return false;
}
/**
 * Generate an error message for index check failure
 */
export function getIndexCheckErrorMessage(database, collection, operation) {
    return `Index check failed: The ${operation} operation on "${database}.${collection}" performs a collection scan (COLLSCAN) instead of using an index. Consider adding an index for better performance. Use 'explain' tool for query plan analysis or 'collection-indexes' to view existing indexes. To disable this check, set MDB_MCP_INDEX_CHECK to false.`;
}
/**
 * Generic function to perform index usage check
 */
export async function checkIndexUsage({ database, collection, operation, explainCallback, logger, }) {
    try {
        const explainResult = await explainCallback();
        if (!usesIndex(explainResult)) {
            throw new MongoDBError(ErrorCodes.ForbiddenCollscan, getIndexCheckErrorMessage(database, collection, operation));
        }
    }
    catch (error) {
        if (error instanceof MongoDBError && error.code === ErrorCodes.ForbiddenCollscan) {
            throw error;
        }
        // If explain itself fails, log but do not prevent query execution
        // This avoids blocking normal queries in special cases (e.g., permission issues)
        logger.warning({
            id: LogId.mongodbIndexCheckFailure,
            context: "Index Usage Check",
            message: `Index check failed to execute explain for ${operation} on ${database}.${collection}: ${error instanceof Error ? error.message : String(error)}`,
        });
    }
}
//# sourceMappingURL=indexCheck.js.map