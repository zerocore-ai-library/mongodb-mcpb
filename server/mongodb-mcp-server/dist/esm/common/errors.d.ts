export declare enum ErrorCodes {
    NotConnectedToMongoDB = 1000000,
    MisconfiguredConnectionString = 1000001,
    ForbiddenCollscan = 1000002,
    ForbiddenWriteOperation = 1000003,
    AtlasSearchNotSupported = 1000004,
    NoEmbeddingsProviderConfigured = 1000005,
    AtlasVectorSearchIndexNotFound = 1000006,
    AtlasVectorSearchInvalidQuery = 1000007,
    Unexpected = 1000008
}
export declare class MongoDBError<ErrorCode extends ErrorCodes = ErrorCodes> extends Error {
    code: ErrorCode;
    constructor(code: ErrorCode, message: string);
}
//# sourceMappingURL=errors.d.ts.map