import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
export class CreateCollectionTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "create-collection";
        this.description = "Creates a new collection in a database. If the database doesn't exist, it will be created automatically.";
        this.argsShape = DbOperationArgs;
    }
    async execute({ collection, database }) {
        const provider = await this.ensureConnected();
        await provider.createCollection(database, collection);
        return {
            content: [
                {
                    type: "text",
                    text: `Collection "${collection}" created in database "${database}".`,
                },
            ],
        };
    }
}
CreateCollectionTool.operationType = "create";
//# sourceMappingURL=createCollection.js.map