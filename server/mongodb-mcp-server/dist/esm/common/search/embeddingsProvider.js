import { createVoyage } from "voyage-ai-provider";
import { embedMany } from "ai";
import { createFetch } from "@mongodb-js/devtools-proxy-support";
import { zVoyageAPIParameters, } from "../../tools/mongodb/mongodbSchemas.js";
class VoyageEmbeddingsProvider {
    constructor({ voyageApiKey }, providedFetch) {
        if (!voyageApiKey) {
            throw new Error("The VoyageAI API Key does not exist. This is likely a bug.");
        }
        // We should always use, by default, any enterprise proxy that the user has configured.
        // Direct requests to VoyageAI might get blocked by the network if they don't go through
        // the provided proxy.
        const customFetch = (providedFetch ??
            createFetch({ useEnvironmentVariableProxies: true }));
        this.voyage = createVoyage({ apiKey: voyageApiKey, fetch: customFetch });
    }
    static isConfiguredIn({ voyageApiKey, previewFeatures }) {
        return previewFeatures.includes("search") && !!voyageApiKey;
    }
    async embed(modelId, content, parameters) {
        // This ensures that if we receive any random parameter from the outside (agent or us)
        // it's stripped before sending it to Voyage, as Voyage will reject the request on
        // a single unknown parameter.
        const voyage = zVoyageAPIParameters.parse(parameters);
        const model = this.voyage.textEmbeddingModel(modelId);
        const { embeddings } = await embedMany({
            model,
            values: content,
            providerOptions: { voyage },
        });
        return embeddings;
    }
}
export function getEmbeddingsProvider(userConfig) {
    if (VoyageEmbeddingsProvider.isConfiguredIn(userConfig)) {
        return new VoyageEmbeddingsProvider(userConfig);
    }
    return undefined;
}
//# sourceMappingURL=embeddingsProvider.js.map