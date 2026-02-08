import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import { type ToolArgs, type OperationType } from "../../tool.js";
import type { IndexDirection } from "mongodb";
export declare class CreateIndexTool extends MongoDBToolBase {
    private filterFieldSchema;
    private vectorFieldSchema;
    private autoEmbedFieldSchema;
    private vectorSearchIndexDefinition;
    private atlasSearchIndexDefinition;
    name: string;
    description: string;
    argsShape: {
        name: z.ZodOptional<z.ZodString>;
        definition: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"classic">;
            keys: z.ZodObject<{}, "strip", z.ZodType<IndexDirection, z.ZodTypeDef, IndexDirection>, {}, {}>;
        }, "strip", z.ZodTypeAny, {
            type: "classic";
            keys: {};
        }, {
            type: "classic";
            keys: {};
        }>, ...(z.ZodObject<{
            type: z.ZodLiteral<"vectorSearch">;
            fields: z.ZodEffects<z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
                type: z.ZodLiteral<"filter">;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                type: "filter";
                path: string;
            }, {
                type: "filter";
                path: string;
            }>, z.ZodObject<{
                type: z.ZodLiteral<"vector">;
                path: z.ZodString;
                numDimensions: z.ZodDefault<z.ZodNumber>;
                similarity: z.ZodDefault<z.ZodEnum<["cosine", "euclidean", "dotProduct"]>>;
                quantization: z.ZodDefault<z.ZodEnum<["none", "scalar", "binary"]>>;
            }, "strict", z.ZodTypeAny, {
                type: "vector";
                path: string;
                numDimensions: number;
                similarity: "cosine" | "euclidean" | "dotProduct";
                quantization: "binary" | "none" | "scalar";
            }, {
                type: "vector";
                path: string;
                numDimensions?: number | undefined;
                similarity?: "cosine" | "euclidean" | "dotProduct" | undefined;
                quantization?: "binary" | "none" | "scalar" | undefined;
            }>, z.ZodObject<{
                type: z.ZodLiteral<"autoEmbed">;
                path: z.ZodString;
                model: z.ZodEnum<["voyage-4", "voyage-4-large", "voyage-4-lite", "voyage-code-3"]>;
                modality: z.ZodEnum<["text"]>;
            }, "strict", z.ZodTypeAny, {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            }, {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            }>]>, "atleastone">, [{
                type: "filter";
                path: string;
            } | {
                type: "vector";
                path: string;
                numDimensions: number;
                similarity: "cosine" | "euclidean" | "dotProduct";
                quantization: "binary" | "none" | "scalar";
            } | {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            }, ...({
                type: "filter";
                path: string;
            } | {
                type: "vector";
                path: string;
                numDimensions: number;
                similarity: "cosine" | "euclidean" | "dotProduct";
                quantization: "binary" | "none" | "scalar";
            } | {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            })[]], [{
                type: "filter";
                path: string;
            } | {
                type: "vector";
                path: string;
                numDimensions?: number | undefined;
                similarity?: "cosine" | "euclidean" | "dotProduct" | undefined;
                quantization?: "binary" | "none" | "scalar" | undefined;
            } | {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            }, ...({
                type: "filter";
                path: string;
            } | {
                type: "vector";
                path: string;
                numDimensions?: number | undefined;
                similarity?: "cosine" | "euclidean" | "dotProduct" | undefined;
                quantization?: "binary" | "none" | "scalar" | undefined;
            } | {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            })[]]>;
        }, "strip", z.ZodTypeAny, {
            type: "vectorSearch";
            fields: [{
                type: "filter";
                path: string;
            } | {
                type: "vector";
                path: string;
                numDimensions: number;
                similarity: "cosine" | "euclidean" | "dotProduct";
                quantization: "binary" | "none" | "scalar";
            } | {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            }, ...({
                type: "filter";
                path: string;
            } | {
                type: "vector";
                path: string;
                numDimensions: number;
                similarity: "cosine" | "euclidean" | "dotProduct";
                quantization: "binary" | "none" | "scalar";
            } | {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            })[]];
        }, {
            type: "vectorSearch";
            fields: [{
                type: "filter";
                path: string;
            } | {
                type: "vector";
                path: string;
                numDimensions?: number | undefined;
                similarity?: "cosine" | "euclidean" | "dotProduct" | undefined;
                quantization?: "binary" | "none" | "scalar" | undefined;
            } | {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            }, ...({
                type: "filter";
                path: string;
            } | {
                type: "vector";
                path: string;
                numDimensions?: number | undefined;
                similarity?: "cosine" | "euclidean" | "dotProduct" | undefined;
                quantization?: "binary" | "none" | "scalar" | undefined;
            } | {
                type: "autoEmbed";
                path: string;
                model: "voyage-code-3" | "voyage-4" | "voyage-4-large" | "voyage-4-lite";
                modality: "text";
            })[]];
        }> | z.ZodObject<{
            type: z.ZodLiteral<"search">;
            analyzer: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            mappings: z.ZodEffects<z.ZodObject<{
                dynamic: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                fields: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, z.ZodTypeAny, "passthrough">>>>;
            }, "strip", z.ZodTypeAny, {
                dynamic: boolean;
                fields?: Record<string, z.objectOutputType<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, z.ZodTypeAny, "passthrough">> | undefined;
            }, {
                fields?: Record<string, z.objectInputType<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, z.ZodTypeAny, "passthrough">> | undefined;
                dynamic?: boolean | undefined;
            }>, {
                dynamic: boolean;
                fields?: Record<string, z.objectOutputType<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, z.ZodTypeAny, "passthrough">> | undefined;
            }, {
                fields?: Record<string, z.objectInputType<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, z.ZodTypeAny, "passthrough">> | undefined;
                dynamic?: boolean | undefined;
            }>;
            numPartitions: z.ZodEffects<z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"1">, z.ZodLiteral<"2">, z.ZodLiteral<"4">]>>, number, "1" | "2" | "4" | undefined>;
        }, "strip", z.ZodTypeAny, {
            type: "search";
            analyzer: string;
            mappings: {
                dynamic: boolean;
                fields?: Record<string, z.objectOutputType<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, z.ZodTypeAny, "passthrough">> | undefined;
            };
            numPartitions: number;
        }, {
            type: "search";
            mappings: {
                fields?: Record<string, z.objectInputType<{
                    type: z.ZodEnum<["autocomplete", "boolean", "date", "document", "embeddedDocuments", "geo", "number", "objectId", "string", "token", "uuid"]>;
                }, z.ZodTypeAny, "passthrough">> | undefined;
                dynamic?: boolean | undefined;
            };
            analyzer?: string | undefined;
            numPartitions?: "1" | "2" | "4" | undefined;
        }>)[]]>, "many">;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, name, definition: definitions, }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
}
//# sourceMappingURL=createIndex.d.ts.map