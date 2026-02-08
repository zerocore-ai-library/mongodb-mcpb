import z from "zod";
export declare const zVoyageModels: z.ZodDefault<z.ZodEnum<["voyage-3-large", "voyage-3.5", "voyage-3.5-lite", "voyage-code-3"]>>;
export declare const zVoyageEmbeddingParameters: z.ZodObject<{
    outputDimension: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"256">, z.ZodLiteral<"512">, z.ZodLiteral<"1024">, z.ZodLiteral<"2048">, z.ZodLiteral<"4096">]>>, number, "256" | "512" | "1024" | "2048" | "4096" | undefined>>;
    outputDtype: z.ZodDefault<z.ZodOptional<z.ZodEnum<["float", "int8", "uint8", "binary", "ubinary"]>>>;
}, "strip", z.ZodTypeAny, {
    outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
    outputDimension?: number | undefined;
}, {
    outputDimension?: "256" | "512" | "1024" | "2048" | "4096" | undefined;
    outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
}>;
export declare const zVoyageAPIParameters: z.ZodObject<{
    outputDtype: z.ZodDefault<z.ZodOptional<z.ZodEnum<["float", "int8", "uint8", "binary", "ubinary"]>>>;
} & {
    outputDimension: z.ZodOptional<z.ZodDefault<z.ZodUnion<[z.ZodLiteral<256>, z.ZodLiteral<512>, z.ZodLiteral<1024>, z.ZodLiteral<2048>, z.ZodLiteral<4096>]>>>;
    inputType: z.ZodEnum<["query", "document"]>;
}, "strip", z.ZodTypeAny, {
    outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
    inputType: "query" | "document";
    outputDimension?: 1024 | 256 | 512 | 2048 | 4096 | undefined;
}, {
    inputType: "query" | "document";
    outputDimension?: 1024 | 256 | 512 | 2048 | 4096 | undefined;
    outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
}>;
export type VoyageModels = z.infer<typeof zVoyageModels>;
export type VoyageEmbeddingParameters = z.infer<typeof zVoyageEmbeddingParameters> & EmbeddingParameters;
export type EmbeddingParameters = {
    inputType: "query" | "document";
};
export declare const zSupportedEmbeddingParameters: z.ZodObject<{
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
}>;
export type SupportedEmbeddingParameters = z.infer<typeof zSupportedEmbeddingParameters>;
export declare const AnyAggregateStage: z.AnyZodObject;
export declare const modelsSupportingAutoEmbedIndexes: readonly ["voyage-4", "voyage-4-large", "voyage-4-lite", "voyage-code-3"];
export declare const VectorSearchStage: z.ZodObject<{
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
}>;
//# sourceMappingURL=mongodbSchemas.d.ts.map