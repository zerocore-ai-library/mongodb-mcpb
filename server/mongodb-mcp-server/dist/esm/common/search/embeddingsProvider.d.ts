import type { UserConfig } from "../config/userConfig.js";
import { type EmbeddingParameters, type VoyageEmbeddingParameters, type VoyageModels } from "../../tools/mongodb/mongodbSchemas.js";
type EmbeddingsInput = string;
type Embeddings = number[] | unknown[];
export interface EmbeddingsProvider<SupportedModels extends string, SupportedEmbeddingParameters extends EmbeddingParameters> {
    embed(modelId: SupportedModels, content: EmbeddingsInput[], parameters: SupportedEmbeddingParameters): Promise<Embeddings[]>;
}
export declare function getEmbeddingsProvider(userConfig: UserConfig): EmbeddingsProvider<VoyageModels, VoyageEmbeddingParameters> | undefined;
export {};
//# sourceMappingURL=embeddingsProvider.d.ts.map