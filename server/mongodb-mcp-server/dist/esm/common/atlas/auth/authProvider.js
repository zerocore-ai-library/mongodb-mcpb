import { ClientCredentialsAuthProvider } from "./clientCredentials.js";
export class AuthProviderFactory {
    static create(options, logger) {
        if (options.credentials.clientId && options.credentials.clientSecret) {
            return new ClientCredentialsAuthProvider({
                baseUrl: options.apiBaseUrl,
                userAgent: options.userAgent,
                clientId: options.credentials.clientId,
                clientSecret: options.credentials.clientSecret,
            }, logger);
        }
        return undefined;
    }
}
//# sourceMappingURL=authProvider.js.map