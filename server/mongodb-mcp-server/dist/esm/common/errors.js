export var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["NotConnectedToMongoDB"] = 1000000] = "NotConnectedToMongoDB";
    ErrorCodes[ErrorCodes["MisconfiguredConnectionString"] = 1000001] = "MisconfiguredConnectionString";
    ErrorCodes[ErrorCodes["ForbiddenCollscan"] = 1000002] = "ForbiddenCollscan";
    ErrorCodes[ErrorCodes["ForbiddenWriteOperation"] = 1000003] = "ForbiddenWriteOperation";
    ErrorCodes[ErrorCodes["AtlasSearchNotSupported"] = 1000004] = "AtlasSearchNotSupported";
    ErrorCodes[ErrorCodes["NoEmbeddingsProviderConfigured"] = 1000005] = "NoEmbeddingsProviderConfigured";
    ErrorCodes[ErrorCodes["AtlasVectorSearchIndexNotFound"] = 1000006] = "AtlasVectorSearchIndexNotFound";
    ErrorCodes[ErrorCodes["AtlasVectorSearchInvalidQuery"] = 1000007] = "AtlasVectorSearchInvalidQuery";
    ErrorCodes[ErrorCodes["Unexpected"] = 1000008] = "Unexpected";
})(ErrorCodes || (ErrorCodes = {}));
export class MongoDBError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
//# sourceMappingURL=errors.js.map