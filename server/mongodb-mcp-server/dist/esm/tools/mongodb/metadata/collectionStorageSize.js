import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
export class CollectionStorageSizeTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "collection-storage-size";
        this.description = "Gets the size of the collection";
        this.argsShape = DbOperationArgs;
    }
    async execute({ database, collection }, { signal }) {
        const provider = await this.ensureConnected();
        const [{ value }] = (await provider
            .aggregate(database, collection, [
            { $collStats: { storageStats: {} } },
            { $group: { _id: null, value: { $sum: "$storageStats.size" } } },
        ], {
            // @ts-expect-error signal is available in the driver but not NodeDriverServiceProvider MONGOSH-3142
            signal,
        })
            .toArray());
        const { units, value: scaledValue } = CollectionStorageSizeTool.getStats(value);
        return {
            content: [
                {
                    text: `The size of "${database}.${collection}" is \`${scaledValue.toFixed(2)} ${units}\``,
                    type: "text",
                },
            ],
        };
    }
    handleError(error, args) {
        if (error instanceof Error && "codeName" in error && error.codeName === "NamespaceNotFound") {
            return {
                content: [
                    {
                        text: `The size of "${args.database}.${args.collection}" cannot be determined because the collection does not exist.`,
                        type: "text",
                    },
                ],
                isError: true,
            };
        }
        return super.handleError(error, args);
    }
    static getStats(value) {
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;
        if (value > gb) {
            return { value: value / gb, units: "GB" };
        }
        if (value > mb) {
            return { value: value / mb, units: "MB" };
        }
        if (value > kb) {
            return { value: value / kb, units: "KB" };
        }
        return { value, units: "bytes" };
    }
}
CollectionStorageSizeTool.operationType = "metadata";
//# sourceMappingURL=collectionStorageSize.js.map