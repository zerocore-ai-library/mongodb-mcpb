import type { ApiError } from "./openapi.js";
export declare class ApiClientError extends Error {
    readonly response: Response;
    readonly apiError?: ApiError | undefined;
    private constructor();
    static fromResponse(response: Response, message?: string): Promise<ApiClientError>;
    static fromError(response: Response, error?: ApiError | string | Error, message?: string): ApiClientError;
    private static extractError;
    private static buildErrorMessage;
}
//# sourceMappingURL=apiClientError.d.ts.map