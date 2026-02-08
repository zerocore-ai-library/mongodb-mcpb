import { MongoDBToolBase } from "../mongodbTool.js";
import { formatUntrustedData } from "../../tool.js";
import { z } from "zod";
export const ListDatabasesOutputSchema = {
    databases: z.array(z.object({
        name: z.string(),
        size: z.number(),
    })),
    totalCount: z.number(),
};
export class ListDatabasesTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "list-databases";
        this.description = "List all databases for a MongoDB connection";
        this.argsShape = {};
        this.outputSchema = ListDatabasesOutputSchema;
    }
    async execute() {
        const provider = await this.ensureConnected();
        const dbs = (await provider.listDatabases("")).databases;
        const databases = dbs.map((db) => ({
            name: db.name,
            size: Number(db.sizeOnDisk),
        }));
        return {
            content: formatUntrustedData(`Found ${dbs.length} databases`, ...dbs.map((db) => `Name: ${db.name}, Size: ${db.sizeOnDisk.toString()} bytes`)),
            structuredContent: {
                databases,
                totalCount: databases.length,
            },
        };
    }
}
ListDatabasesTool.operationType = "metadata";
//# sourceMappingURL=listDatabases.js.map