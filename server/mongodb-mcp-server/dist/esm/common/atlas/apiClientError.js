export class ApiClientError extends Error {
    constructor(message, response, apiError) {
        super(message);
        this.response = response;
        this.apiError = apiError;
        this.name = "ApiClientError";
    }
    static async fromResponse(response, message = `error calling Atlas API`) {
        const err = await this.extractError(response);
        return this.fromError(response, err, message);
    }
    static fromError(response, error, message = `error calling Atlas API`) {
        const errorMessage = this.buildErrorMessage(error);
        const apiError = typeof error === "object" && !(error instanceof Error) ? error : undefined;
        return new ApiClientError(`[${response.status} ${response.statusText}] ${message}: ${errorMessage}`, response, apiError);
    }
    static async extractError(response) {
        try {
            return (await response.json());
        }
        catch {
            try {
                return await response.text();
            }
            catch {
                return undefined;
            }
        }
    }
    static buildErrorMessage(error) {
        let errorMessage = "unknown error";
        if (error instanceof Error) {
            return error.message;
        }
        //eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (typeof error) {
            case "object":
                errorMessage = error.reason || "unknown error";
                if (error.detail && error.detail.length > 0) {
                    errorMessage = `${errorMessage}; ${error.detail}`;
                }
                break;
            case "string":
                errorMessage = error;
                break;
        }
        return errorMessage.trim();
    }
}
//# sourceMappingURL=apiClientError.js.map