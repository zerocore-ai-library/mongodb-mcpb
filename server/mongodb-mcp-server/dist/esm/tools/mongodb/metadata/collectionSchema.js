import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
import { formatUntrustedData } from "../../tool.js";
import { getSimplifiedSchema } from "mongodb-schema";
import z from "zod";
import { ONE_MB } from "../../../helpers/constants.js";
import { collectCursorUntilMaxBytesLimit } from "../../../helpers/collectCursorUntilMaxBytes.js";
import { isObjectEmpty } from "../../../helpers/isObjectEmpty.js";
const MAXIMUM_SAMPLE_SIZE_HARD_LIMIT = 50000;
export class CollectionSchemaTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "collection-schema";
        this.description = "Describe the schema for a collection";
        this.argsShape = {
            ...DbOperationArgs,
            sampleSize: z.number().optional().default(50).describe("Number of documents to sample for schema inference"),
            responseBytesLimit: z
                .number()
                .optional()
                .default(ONE_MB)
                .describe(`The maximum number of bytes to return in the response. This value is capped by the server's configured maxBytesPerQuery and cannot be exceeded.`),
        };
    }
    async execute({ database, collection, sampleSize, responseBytesLimit }, { signal }) {
        const provider = await this.ensureConnected();
        const cursor = provider.aggregate(database, collection, [{ $sample: { size: Math.min(sampleSize, MAXIMUM_SAMPLE_SIZE_HARD_LIMIT) } }], {
            // @ts-expect-error signal is available in the driver but not NodeDriverServiceProvider MONGOSH-3142
            signal,
        });
        const { cappedBy, documents } = await collectCursorUntilMaxBytesLimit({
            cursor,
            configuredMaxBytesPerQuery: this.config.maxBytesPerQuery,
            toolResponseBytesLimit: responseBytesLimit,
            abortSignal: signal,
        });
        const schema = await getSimplifiedSchema(documents);
        if (isObjectEmpty(schema)) {
            return {
                content: [
                    {
                        text: `Could not deduce the schema for "${database}.${collection}". This may be because it doesn't exist or is empty.`,
                        type: "text",
                    },
                ],
            };
        }
        const fieldsCount = Object.keys(schema).length;
        const header = `Found ${fieldsCount} fields in the schema for "${database}.${collection}"`;
        const cappedWarning = cappedBy !== undefined
            ? `\nThe schema was inferred from a subset of documents due to the response size limit. (${cappedBy})`
            : "";
        return {
            content: formatUntrustedData(`${header}${cappedWarning}`, JSON.stringify(schema)),
        };
    }
}
CollectionSchemaTool.operationType = "metadata";
//# sourceMappingURL=collectionSchema.js.map