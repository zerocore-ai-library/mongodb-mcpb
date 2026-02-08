import type { LoggerBase } from "../../logger.js";
import type { AuthProvider } from "./authProvider.js";
export interface ClientCredentialsAuthOptions {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    userAgent: string;
}
export declare class ClientCredentialsAuthProvider implements AuthProvider {
    private oauth2Issuer?;
    private accessToken?;
    private readonly options;
    private readonly logger;
    private customFetch;
    constructor(options: ClientCredentialsAuthOptions, logger: LoggerBase);
    getAuthHeaders(): Promise<Record<string, string> | undefined>;
    private isAccessTokenValid;
    private getOauthClientAuth;
    private getNewAccessToken;
    private getAccessToken;
    validate(): Promise<boolean>;
    revoke(): Promise<void>;
}
//# sourceMappingURL=clientCredentials.d.ts.map