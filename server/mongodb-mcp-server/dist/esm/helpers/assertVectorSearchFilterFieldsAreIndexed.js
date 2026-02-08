// Based on -
import { ErrorCodes, MongoDBError } from "../common/errors.js";
import { LogId } from "../common/logger.js";
// https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/#mongodb-vector-search-pre-filter
const ALLOWED_LOGICAL_OPERATORS = ["$not", "$nor", "$and", "$or"];
export function assertVectorSearchFilterFieldsAreIndexed({ searchIndexes, pipeline, logger, }) {
    const searchIndexesWithFilterFields = searchIndexes
        // Ensure we only process vector search indexes and not lexical search ones
        .filter((index) => index.type === "vectorSearch")
        .reduce((indexFieldMap, searchIndex) => {
        const filterFields = searchIndex.latestDefinition.fields
            .map((field) => {
            return field.type === "filter" ? field.path : undefined;
        })
            .filter((filterField) => filterField !== undefined);
        indexFieldMap[searchIndex.name] = filterFields;
        return indexFieldMap;
    }, {});
    for (const stage of pipeline) {
        if ("$vectorSearch" in stage) {
            const { $vectorSearch: vectorSearchStage } = stage;
            const allowedFilterFields = searchIndexesWithFilterFields[vectorSearchStage.index];
            if (!allowedFilterFields) {
                logger.warning({
                    id: LogId.toolValidationError,
                    context: "aggregate tool",
                    message: `Could not assert if filter fields are indexed - No filter fields found for index ${vectorSearchStage.index}`,
                });
                return;
            }
            const filterFieldsInStage = collectFieldsFromVectorSearchFilter(vectorSearchStage.filter);
            const filterFieldsNotIndexed = filterFieldsInStage.filter((field) => !allowedFilterFields.includes(field));
            if (filterFieldsNotIndexed.length) {
                throw new MongoDBError(ErrorCodes.AtlasVectorSearchInvalidQuery, `Vector search stage contains filter on fields that are not indexed by index ${vectorSearchStage.index} - ${filterFieldsNotIndexed.join(", ")}`);
            }
        }
    }
}
export function collectFieldsFromVectorSearchFilter(filter) {
    if (!filter || typeof filter !== "object" || !Object.keys(filter).length) {
        return [];
    }
    const collectedFields = Object.entries(filter).reduce((collectedFields, [maybeField, fieldMQL]) => {
        if (ALLOWED_LOGICAL_OPERATORS.includes(maybeField) && Array.isArray(fieldMQL)) {
            return fieldMQL.flatMap((mql) => collectFieldsFromVectorSearchFilter(mql));
        }
        if (!ALLOWED_LOGICAL_OPERATORS.includes(maybeField)) {
            collectedFields.push(maybeField);
        }
        return collectedFields;
    }, []);
    return Array.from(new Set(collectedFields));
}
//# sourceMappingURL=assertVectorSearchFilterFieldsAreIndexed.js.map