import { type CompositeLogger } from "../common/logger.js";
export type SearchIndex = VectorSearchIndex | AtlasSearchIndex;
type VectorSearchIndex = {
    name: string;
    latestDefinition: {
        fields: Array<{
            type: "vector";
        } | {
            type: "filter";
            path: string;
        }>;
    };
    type: "vectorSearch";
};
type AtlasSearchIndex = {
    name: string;
    latestDefinition: unknown;
    type: "search";
};
export declare function assertVectorSearchFilterFieldsAreIndexed({ searchIndexes, pipeline, logger, }: {
    searchIndexes: SearchIndex[];
    pipeline: Record<string, unknown>[];
    logger: CompositeLogger;
}): void;
export declare function collectFieldsFromVectorSearchFilter(filter: unknown): string[];
export {};
//# sourceMappingURL=assertVectorSearchFilterFieldsAreIndexed.d.ts.map