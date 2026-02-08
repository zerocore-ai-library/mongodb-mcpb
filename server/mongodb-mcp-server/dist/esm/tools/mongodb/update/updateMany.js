import { z } from "zod";
import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
import { checkIndexUsage } from "../../../helpers/indexCheck.js";
import { zEJSON } from "../../args.js";
export class UpdateManyTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "update-many";
        this.description = "Updates all documents that match the specified filter for a collection. If the list of documents is above com.mongodb/maxRequestPayloadBytes, consider updating them in batches.";
        this.argsShape = {
            ...DbOperationArgs,
            filter: zEJSON()
                .optional()
                .describe("The selection criteria for the update, matching the syntax of the filter argument of db.collection.updateOne()"),
            update: zEJSON().describe("An update document describing the modifications to apply using update operator expressions"),
            upsert: z
                .boolean()
                .optional()
                .describe("Controls whether to insert a new document if no documents match the filter"),
        };
    }
    async execute({ database, collection, filter, update, upsert, }) {
        const provider = await this.ensureConnected();
        // Check if update operation uses an index if enabled
        if (this.config.indexCheck) {
            await checkIndexUsage({
                database,
                collection,
                operation: "updateMany",
                explainCallback: async () => {
                    return provider.runCommandWithCheck(database, {
                        explain: {
                            update: collection,
                            updates: [
                                {
                                    q: filter || {},
                                    u: update,
                                    upsert: upsert || false,
                                    multi: true,
                                },
                            ],
                        },
                        verbosity: "queryPlanner",
                    });
                },
                logger: this.session.logger,
            });
        }
        const result = await provider.updateMany(database, collection, filter, update, {
            upsert,
        });
        let message = "";
        if (result.matchedCount === 0 && result.modifiedCount === 0 && result.upsertedCount === 0) {
            message = "No documents matched the filter.";
        }
        else {
            message = `Matched ${result.matchedCount} document(s).`;
            if (result.modifiedCount > 0) {
                message += ` Modified ${result.modifiedCount} document(s).`;
            }
            if (result.upsertedCount > 0) {
                message += ` Upserted ${result.upsertedCount} document with id: ${result.upsertedId?.toString()}.`;
            }
        }
        return {
            content: [
                {
                    text: message,
                    type: "text",
                },
            ],
        };
    }
}
UpdateManyTool.operationType = "update";
//# sourceMappingURL=updateMany.js.map