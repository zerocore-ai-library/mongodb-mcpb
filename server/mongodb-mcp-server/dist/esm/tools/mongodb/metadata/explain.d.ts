import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { ToolArgs, OperationType, ToolExecutionContext } from "../../tool.js";
import { z } from "zod";
export declare class ExplainTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        method: z.ZodArray<z.ZodDiscriminatedUnion<"name", [z.ZodObject<{
            name: z.ZodLiteral<"aggregate">;
            arguments: z.ZodObject<{
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
            }, "strip", z.ZodTypeAny, {
                pipeline: ({
                    [x: string]: any;
                } | {
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
                })[];
            }, {
                pipeline: ({
                    [x: string]: any;
                } | {
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
                })[];
            }>;
        }, "strip", z.ZodTypeAny, {
            name: "aggregate";
            arguments: {
                pipeline: ({
                    [x: string]: any;
                } | {
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
                })[];
            };
        }, {
            name: "aggregate";
            arguments: {
                pipeline: ({
                    [x: string]: any;
                } | {
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
                })[];
            };
        }>, z.ZodObject<{
            name: z.ZodLiteral<"find">;
            arguments: z.ZodObject<{
                filter: z.ZodOptional<z.AnyZodObject>;
                projection: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
                limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
                sort: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodType<import("mongodb").SortDirection, z.ZodTypeDef, import("mongodb").SortDirection>, {}, {}>>;
            }, "strip", z.ZodTypeAny, {
                limit: number;
                sort?: {} | undefined;
                filter?: {
                    [x: string]: any;
                } | undefined;
                projection?: z.objectOutputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
            }, {
                sort?: {} | undefined;
                filter?: {
                    [x: string]: any;
                } | undefined;
                limit?: number | undefined;
                projection?: z.objectInputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            name: "find";
            arguments: {
                limit: number;
                sort?: {} | undefined;
                filter?: {
                    [x: string]: any;
                } | undefined;
                projection?: z.objectOutputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
            };
        }, {
            name: "find";
            arguments: {
                sort?: {} | undefined;
                filter?: {
                    [x: string]: any;
                } | undefined;
                limit?: number | undefined;
                projection?: z.objectInputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
            };
        }>, z.ZodObject<{
            name: z.ZodLiteral<"count">;
            arguments: z.ZodObject<{
                query: z.ZodOptional<z.AnyZodObject>;
            }, "strip", z.ZodTypeAny, {
                query?: {
                    [x: string]: any;
                } | undefined;
            }, {
                query?: {
                    [x: string]: any;
                } | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            name: "count";
            arguments: {
                query?: {
                    [x: string]: any;
                } | undefined;
            };
        }, {
            name: "count";
            arguments: {
                query?: {
                    [x: string]: any;
                } | undefined;
            };
        }>]>, "many">;
        verbosity: z.ZodDefault<z.ZodOptional<z.ZodEnum<["queryPlanner", "queryPlannerExtended", "executionStats", "allPlansExecution"]>>>;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, method: methods, verbosity }: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
}
//# sourceMappingURL=explain.d.ts.map