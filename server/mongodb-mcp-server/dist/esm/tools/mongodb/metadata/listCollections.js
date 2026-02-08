import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
import { formatUntrustedData } from "../../tool.js";
export class ListCollectionsTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "list-collections";
        this.description = "List all collections for a given database";
        this.argsShape = {
            database: DbOperationArgs.database,
        };
    }
    async execute({ database }, { signal }) {
        const provider = await this.ensureConnected();
        const collections = await provider.listCollections(database, {}, { signal });
        if (collections.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Found 0 collections for database "${database}". To create a collection, use the "create-collection" tool.`,
                    },
                ],
            };
        }
        return {
            content: formatUntrustedData(`Found ${collections.length} collections for database "${database}".`, collections.map((collection) => `"${collection.name}"`).join("\n")),
        };
    }
}
ListCollectionsTool.operationType = "metadata";
//# sourceMappingURL=listCollections.js.map