import { z } from "zod";
import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
export class RenameCollectionTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "rename-collection";
        this.description = "Renames a collection in a MongoDB database";
        this.argsShape = {
            ...DbOperationArgs,
            newName: z.string().describe("The new name for the collection"),
            dropTarget: z.boolean().optional().default(false).describe("If true, drops the target collection if it exists"),
        };
    }
    async execute({ database, collection, newName, dropTarget, }) {
        const provider = await this.ensureConnected();
        const result = await provider.renameCollection(database, collection, newName, {
            dropTarget,
        });
        return {
            content: [
                {
                    text: `Collection "${collection}" renamed to "${result.collectionName}" in database "${database}".`,
                    type: "text",
                },
            ],
        };
    }
    handleError(error, args) {
        if (error instanceof Error && "codeName" in error) {
            switch (error.codeName) {
                case "NamespaceNotFound":
                    return {
                        content: [
                            {
                                text: `Cannot rename "${args.database}.${args.collection}" because it doesn't exist.`,
                                type: "text",
                            },
                        ],
                        isError: true,
                    };
                case "NamespaceExists":
                    return {
                        content: [
                            {
                                text: `Cannot rename "${args.database}.${args.collection}" to "${args.newName}" because the target collection already exists. If you want to overwrite it, set the "dropTarget" argument to true.`,
                                type: "text",
                            },
                        ],
                        isError: true,
                    };
            }
        }
        return super.handleError(error, args);
    }
}
RenameCollectionTool.operationType = "update";
//# sourceMappingURL=renameCollection.js.map