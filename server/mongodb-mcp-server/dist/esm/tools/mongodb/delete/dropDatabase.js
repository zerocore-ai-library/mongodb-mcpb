import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
export class DropDatabaseTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "drop-database";
        this.description = "Removes the specified database, deleting the associated data files";
        this.argsShape = {
            database: DbOperationArgs.database,
        };
    }
    async execute({ database }) {
        const provider = await this.ensureConnected();
        const result = await provider.dropDatabase(database);
        return {
            content: [
                {
                    text: `${result.ok ? "Successfully dropped" : "Failed to drop"} database "${database}"`,
                    type: "text",
                },
            ],
        };
    }
    getConfirmationMessage({ database }) {
        return (`You are about to drop the \`${database}\` database:\n\n` +
            "This operation will permanently remove the database and ALL its collections, documents, and indexes.\n\n" +
            "**Do you confirm the execution of the action?**");
    }
}
DropDatabaseTool.operationType = "delete";
//# sourceMappingURL=dropDatabase.js.map