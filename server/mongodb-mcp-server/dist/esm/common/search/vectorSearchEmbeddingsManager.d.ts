import { type Document } from "bson";
import type { UserConfig } from "../config/userConfig.js";
import type { ConnectionManager } from "../connectionManager.js";
import z from "zod";
import { getEmbeddingsProvider } from "./embeddingsProvider.js";
import type { EmbeddingParameters } from "../../tools/mongodb/mongodbSchemas.js";
import type { Similarity } from "../schemas.js";
import type { SupportedEmbeddingParameters } from "../../tools/mongodb/mongodbSchemas.js";
export declare const quantizationEnum: z.ZodEnum<["none", "scalar", "binary"]>;
export type Quantization = z.infer<typeof quantizationEnum>;
export type VectorFieldIndexDefinition = {
    type: "vector";
    path: string;
    numDimensions: number;
    quantization: Quantization;
    similarity: Similarity;
};
export type VectorFieldValidationError = {
    path: string;
    expectedNumDimensions: number;
    actualNumDimensions: number | "unknown";
    error: "dimension-mismatch" | "not-a-vector" | "not-numeric";
};
export type EmbeddingNamespace = `${string}.${string}`;
export declare class VectorSearchEmbeddingsManager {
    private readonly config;
    private readonly connectionManager;
    private readonly embeddings;
    private readonly embeddingsProvider;
    constructor(config: UserConfig, connectionManager: ConnectionManager, embeddings?: Map<EmbeddingNamespace, VectorFieldIndexDefinition[]>, embeddingsProvider?: typeof getEmbeddingsProvider);
    cleanupEmbeddingsForNamespace({ database, collection }: {
        database: string;
        collection: string;
    }): void;
    indexExists({ database, collection, indexName, }: {
        database: string;
        collection: string;
        indexName: string;
    }): Promise<boolean>;
    embeddingsForNamespace({ database, collection, }: {
        database: string;
        collection: string;
    }): Promise<VectorFieldIndexDefinition[]>;
    assertFieldsHaveCorrectEmbeddings({ database, collection }: {
        database: string;
        collection: string;
    }, documents: Document[]): Promise<void>;
    findFieldsWithWrongEmbeddings({ database, collection, }: {
        database: string;
        collection: string;
    }, document: Document): Promise<VectorFieldValidationError[]>;
    private atlasSearchEnabledProvider;
    private isVectorFieldIndexDefinition;
    private getValidationErrorForDocument;
    assertVectorSearchIndexExists({ database, collection, path, }: {
        database: string;
        collection: string;
        path: string;
    }): Promise<void>;
    generateEmbeddings({ rawValues, embeddingParameters, inputType, }: {
        rawValues: string[];
        embeddingParameters: SupportedEmbeddingParameters;
        inputType: EmbeddingParameters["inputType"];
    }): Promise<unknown[][]>;
    private isANumber;
}
//# sourceMappingURL=vectorSearchEmbeddingsManager.d.ts.map