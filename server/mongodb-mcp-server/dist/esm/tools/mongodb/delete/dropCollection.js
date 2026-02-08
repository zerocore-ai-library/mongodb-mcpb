import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
export class DropCollectionTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "drop-collection";
        this.description = "Removes a collection or view from the database. The method also removes any indexes associated with the dropped collection.";
        this.argsShape = {
            ...DbOperationArgs,
        };
    }
    async execute({ database, collection }) {
        const provider = await this.ensureConnected();
        const result = await provider.dropCollection(database, collection);
        return {
            content: [
                {
                    text: `${result ? "Successfully dropped" : "Failed to drop"} collection "${collection}" from database "${database}"`,
                    type: "text",
                },
            ],
        };
    }
    getConfirmationMessage({ database, collection }) {
        return (`You are about to drop the \`${collection}\` collection from the \`${database}\` database:\n\n` +
            "This operation will permanently remove the collection and all its data, including indexes.\n\n" +
            "**Do you confirm the execution of the action?**");
    }
}
DropCollectionTool.operationType = "delete";
//# sourceMappingURL=dropCollection.js.map