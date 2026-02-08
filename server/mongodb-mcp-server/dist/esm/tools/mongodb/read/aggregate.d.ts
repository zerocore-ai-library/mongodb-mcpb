import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType, ToolExecutionContext } from "../../tool.js";
import type { AutoEmbeddingsUsageMetadata, ConnectionMetadata } from "../../../telemetry/types.js";
export declare const pipelineDescriptionWithVectorSearch = "An array of aggregation stages to execute.\nIf the user has asked for a vector search, `$vectorSearch` **MUST** be the first stage of the pipeline, or the first stage of a `$unionWith` subpipeline.\nIf the user has asked for lexical/Atlas search, use `$search` instead of `$text`.\n### Usage Rules for `$vectorSearch`\n- **Index Type Detection:**\n  Use the collection-indexes tool to determine if the target field has a classic vector index (type: 'vector') or an auto-embed index (type: 'autoEmbed').\n- **Classic Vector Search (type: 'vector'):**\n  Use 'queryVector' with embeddings as an array of numbers, or as a string with 'embeddingParameters' to generate embeddings.\n- **Auto-Embed Vector Search (type: 'autoEmbed'):**\n  Use 'query' - MongoDB automatically generates embeddings at query time. Do NOT use 'queryVector' or 'embeddingParameters' for auto-embed indexes.\n- **Unset embeddings:**\n  Unless the user explicitly requests the embeddings, add an `$unset` stage **at the end of the pipeline** to remove the embedding field and avoid context limits. **The $unset stage in this situation is mandatory**.\n- **Pre-filtering:**\n  If the user requests additional filtering, include filters in `$vectorSearch.filter` only for pre-filter fields in the vector index.\n  NEVER include fields in $vectorSearch.filter that are not part of the vector index.\n- **Post-filtering:**\n  For all remaining filters, add a $match stage after $vectorSearch.\n- If unsure which fields are filterable, use the collection-indexes tool to determine valid prefilter fields.\n- If no requested filters are valid prefilters, omit the filter key from $vectorSearch.\n\n### Usage Rules for `$search`\n- Include the index name, unless you know for a fact there's a default index. If unsure, use the collection-indexes tool to determine the index name.\n- The `$search` stage supports multiple operators, such as 'autocomplete', 'text', 'geoWithin', and others. Choose the approprate operator based on the user's query. If unsure of the exact syntax, consult the MongoDB Atlas Search documentation, which can be found here: https://www.mongodb.com/docs/atlas/atlas-search/operators-and-collectors/\n";
export declare const getAggregateArgs: (vectorSearchEnabled: boolean) => {
    readonly pipeline: z.ZodArray<z.AnyZodObject | z.ZodUnion<[z.ZodObject<{
        $vectorSearch: z.ZodUnion<[z.ZodObject<{
            exact: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            index: z.ZodString;
            path: z.ZodString;
            numCandidates: z.ZodOptional<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            filter: z.ZodOptional<z.AnyZodObject>;
        } & {
            queryVector: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodNumber, "many">]>;
            embeddingParameters: z.ZodOptional<z.ZodObject<{
                outputDimension: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"256">, z.ZodLiteral<"512">, z.ZodLiteral<"1024">, z.ZodLiteral<"2048">, z.ZodLiteral<"4096">]>>, number, "256" | "512" | "1024" | "2048" | "4096" | undefined>>;
                outputDtype: z.ZodDefault<z.ZodOptional<z.ZodEnum<["float", "int8", "uint8", "binary", "ubinary"]>>>;
            } & {
                model: z.ZodDefault<z.ZodEnum<["voyage-3-large", "voyage-3.5", "voyage-3.5-lite", "voyage-code-3"]>>;
            }, "strip", z.ZodTypeAny, {
                outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
                model: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3";
                outputDimension?: number | undefined;
            }, {
                outputDimension?: "256" | "512" | "1024" | "2048" | "4096" | undefined;
                outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
                model?: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            exact: boolean;
            index: string;
            limit: number;
            queryVector: string | number[];
            filter?: {
                [x: string]: any;
            } | undefined;
            numCandidates?: number | undefined;
            embeddingParameters?: {
                outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
                model: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3";
                outputDimension?: number | undefined;
            } | undefined;
        }, {
            path: string;
            index: string;
            queryVector: string | number[];
            filter?: {
                [x: string]: any;
            } | undefined;
            exact?: boolean | undefined;
            numCandidates?: number | undefined;
            limit?: number | undefined;
            embeddingParameters?: {
                outputDimension?: "256" | "512" | "1024" | "2048" | "4096" | undefined;
                outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
                model?: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3" | undefined;
            } | undefined;
        }>, z.ZodObject<{
            exact: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            index: z.ZodString;
            path: z.ZodString;
            numCandidates: z.ZodOptional<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            filter: z.ZodOptional<z.AnyZodObject>;
        } & {
            query: z.ZodObject<{
                text: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                text: string;
            }, {
                text: string;
            }>;
            model: z.ZodOptional<z.ZodEnum<["voyage-4", "voyage-4-large", "voyage-4-lite", "voyage-code-3"]>>;
        }, "strip", z.ZodTypeAny, {
            query: {
                text: string;
            };
            path: string;
            exact: boolean;
            index: string;
            limit: number;
            filter?: {
                [x: string]: any;
            } | undefined;
            model?: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite" | undefined;
            numCandidates?: number | undefined;
        }, {
            query: {
                text: string;
            };
            path: string;
            index: string;
            filter?: {
                [x: string]: any;
            } | undefined;
            exact?: boolean | undefined;
            model?: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite" | undefined;
            numCandidates?: number | undefined;
            limit?: number | undefined;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        $vectorSearch: {
            path: string;
            exact: boolean;
            index: string;
            limit: number;
            queryVector: string | number[];
            filter?: {
                [x: string]: any;
            } | undefined;
            numCandidates?: number | undefined;
            embeddingParameters?: {
                outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
                model: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3";
                outputDimension?: number | undefined;
            } | undefined;
        } | {
            query: {
                text: string;
            };
            path: string;
            exact: boolean;
            index: string;
            limit: number;
            filter?: {
                [x: string]: any;
            } | undefined;
            model?: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite" | undefined;
            numCandidates?: number | undefined;
        };
    }, {
        $vectorSearch: {
            path: string;
            index: string;
            queryVector: string | number[];
            filter?: {
                [x: string]: any;
            } | undefined;
            exact?: boolean | undefined;
            numCandidates?: number | undefined;
            limit?: number | undefined;
            embeddingParameters?: {
                outputDimension?: "256" | "512" | "1024" | "2048" | "4096" | undefined;
                outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
                model?: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3" | undefined;
            } | undefined;
        } | {
            query: {
                text: string;
            };
            path: string;
            index: string;
            filter?: {
                [x: string]: any;
            } | undefined;
            exact?: boolean | undefined;
            model?: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite" | undefined;
            numCandidates?: number | undefined;
            limit?: number | undefined;
        };
    }>, z.AnyZodObject]>, "many">;
};
export declare class AggregateTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        responseBytesLimit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pipeline: z.ZodArray<z.AnyZodObject | z.ZodUnion<[z.ZodObject<{
            $vectorSearch: z.ZodUnion<[z.ZodObject<{
                exact: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                index: z.ZodString;
                path: z.ZodString;
                numCandidates: z.ZodOptional<z.ZodNumber>;
                limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
                filter: z.ZodOptional<z.AnyZodObject>;
            } & {
                queryVector: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodNumber, "many">]>;
                embeddingParameters: z.ZodOptional<z.ZodObject<{
                    outputDimension: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"256">, z.ZodLiteral<"512">, z.ZodLiteral<"1024">, z.ZodLiteral<"2048">, z.ZodLiteral<"4096">]>>, number, "256" | "512" | "1024" | "2048" | "4096" | undefined>>;
                    outputDtype: z.ZodDefault<z.ZodOptional<z.ZodEnum<["float", "int8", "uint8", "binary", "ubinary"]>>>;
                } & {
                    model: z.ZodDefault<z.ZodEnum<["voyage-3-large", "voyage-3.5", "voyage-3.5-lite", "voyage-code-3"]>>;
                }, "strip", z.ZodTypeAny, {
                    outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
                    model: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3";
                    outputDimension?: number | undefined;
                }, {
                    outputDimension?: "256" | "512" | "1024" | "2048" | "4096" | undefined;
                    outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
                    model?: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3" | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                exact: boolean;
                index: string;
                limit: number;
                queryVector: string | number[];
                filter?: {
                    [x: string]: any;
                } | undefined;
                numCandidates?: number | undefined;
                embeddingParameters?: {
                    outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
                    model: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3";
                    outputDimension?: number | undefined;
                } | undefined;
            }, {
                path: string;
                index: string;
                queryVector: string | number[];
                filter?: {
                    [x: string]: any;
                } | undefined;
                exact?: boolean | undefined;
                numCandidates?: number | undefined;
                limit?: number | undefined;
                embeddingParameters?: {
                    outputDimension?: "256" | "512" | "1024" | "2048" | "4096" | undefined;
                    outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
                    model?: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3" | undefined;
                } | undefined;
            }>, z.ZodObject<{
                exact: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                index: z.ZodString;
                path: z.ZodString;
                numCandidates: z.ZodOptional<z.ZodNumber>;
                limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
                filter: z.ZodOptional<z.AnyZodObject>;
            } & {
                query: z.ZodObject<{
                    text: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    text: string;
                }, {
                    text: string;
                }>;
                model: z.ZodOptional<z.ZodEnum<["voyage-4", "voyage-4-large", "voyage-4-lite", "voyage-code-3"]>>;
            }, "strip", z.ZodTypeAny, {
                query: {
                    text: string;
                };
                path: string;
                exact: boolean;
                index: string;
                limit: number;
                filter?: {
                    [x: string]: any;
                } | undefined;
                model?: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite" | undefined;
                numCandidates?: number | undefined;
            }, {
                query: {
                    text: string;
                };
                path: string;
                index: string;
                filter?: {
                    [x: string]: any;
                } | undefined;
                exact?: boolean | undefined;
                model?: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite" | undefined;
                numCandidates?: number | undefined;
                limit?: number | undefined;
            }>]>;
        }, "strip", z.ZodTypeAny, {
            $vectorSearch: {
                path: string;
                exact: boolean;
                index: string;
                limit: number;
                queryVector: string | number[];
                filter?: {
                    [x: string]: any;
                } | undefined;
                numCandidates?: number | undefined;
                embeddingParameters?: {
                    outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
                    model: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3";
                    outputDimension?: number | undefined;
                } | undefined;
            } | {
                query: {
                    text: string;
                };
                path: string;
                exact: boolean;
                index: string;
                limit: number;
                filter?: {
                    [x: string]: any;
                } | undefined;
                model?: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite" | undefined;
                numCandidates?: number | undefined;
            };
        }, {
            $vectorSearch: {
                path: string;
                index: string;
                queryVector: string | number[];
                filter?: {
                    [x: string]: any;
                } | undefined;
                exact?: boolean | undefined;
                numCandidates?: number | undefined;
                limit?: number | undefined;
                embeddingParameters?: {
                    outputDimension?: "256" | "512" | "1024" | "2048" | "4096" | undefined;
                    outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
                    model?: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3" | undefined;
                } | undefined;
            } | {
                query: {
                    text: string;
                };
                path: string;
                index: string;
                filter?: {
                    [x: string]: any;
                } | undefined;
                exact?: boolean | undefined;
                model?: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite" | undefined;
                numCandidates?: number | undefined;
                limit?: number | undefined;
            };
        }>, z.AnyZodObject]>, "many">;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, pipeline, responseBytesLimit }: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
    private safeCloseCursor;
    private assertOnlyUsesPermittedStages;
    private countAggregationResultDocuments;
    private replaceRawValuesWithEmbeddingsIfNecessary;
    private isVectorSearchIndexUsed;
    private generateMessage;
    protected resolveTelemetryMetadata(args: ToolArgs<typeof this.argsShape>, { result }: {
        result: CallToolResult;
    }): ConnectionMetadata | AutoEmbeddingsUsageMetadata;
    private isSearchStage;
    private isWriteStage;
}
//# sourceMappingURL=aggregate.d.ts.map