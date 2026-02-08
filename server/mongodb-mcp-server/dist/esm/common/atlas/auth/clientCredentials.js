import * as oauth from "oauth4webapi";
import { LogId } from "../../logger.js";
import { createFetch } from "@mongodb-js/devtools-proxy-support";
export class ClientCredentialsAuthProvider {
    constructor(options, logger) {
        this.options = options;
        this.logger = logger;
        this.oauth2Issuer = {
            issuer: options.baseUrl,
            token_endpoint: new URL("/api/oauth/token", options.baseUrl).toString(),
            revocation_endpoint: new URL("/api/oauth/revoke", options.baseUrl).toString(),
            token_endpoint_auth_methods_supported: ["client_secret_basic"],
            grant_types_supported: ["client_credentials"],
        };
        this.customFetch = createFetch({
            useEnvironmentVariableProxies: true,
        });
    }
    async getAuthHeaders() {
        const accessToken = await this.getAccessToken();
        return accessToken
            ? {
                Authorization: `Bearer ${accessToken}`,
            }
            : undefined;
    }
    isAccessTokenValid() {
        return !!(this.accessToken &&
            this.accessToken.expires_at !== undefined &&
            this.accessToken.expires_at > Date.now());
    }
    getOauthClientAuth() {
        const clientSecret = this.options.clientSecret;
        const clientId = this.options.clientId;
        // We are using our own ClientAuth because ClientSecretBasic URL encodes wrongly
        // the username and password (for example, encodes `_` to %5F, which is wrong).
        return {
            client: { client_id: clientId },
            clientAuth: (_as, client, _body, headers) => {
                const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
                headers.set("Authorization", `Basic ${credentials}`);
            },
        };
    }
    async getNewAccessToken() {
        if (!this.oauth2Issuer) {
            return undefined;
        }
        const { client, clientAuth } = this.getOauthClientAuth();
        if (client && clientAuth) {
            try {
                const response = await oauth.clientCredentialsGrantRequest(this.oauth2Issuer, client, clientAuth, new URLSearchParams(), {
                    [oauth.customFetch]: this.customFetch,
                    headers: {
                        "User-Agent": this.options.userAgent,
                    },
                });
                const result = await oauth.processClientCredentialsResponse(this.oauth2Issuer, client, response);
                this.accessToken = {
                    access_token: result.access_token,
                    expires_at: Date.now() + (result.expires_in ?? 0) * 1000,
                };
            }
            catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                this.logger.error({
                    id: LogId.atlasConnectFailure,
                    context: "clientCredentialsAuth",
                    message: `Failed to request access token: ${err.message}`,
                });
            }
            return this.accessToken;
        }
        return undefined;
    }
    async getAccessToken() {
        if (!this.isAccessTokenValid()) {
            this.accessToken = await this.getNewAccessToken();
        }
        return this.accessToken?.access_token;
    }
    async validate() {
        const token = await this.getAccessToken();
        return !!token;
    }
    async revoke() {
        const { client, clientAuth } = this.getOauthClientAuth();
        try {
            if (this.oauth2Issuer && this.accessToken && client && clientAuth) {
                await oauth.revocationRequest(this.oauth2Issuer, client, clientAuth, this.accessToken.access_token);
            }
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            this.logger.error({
                id: LogId.atlasApiRevokeFailure,
                context: "clientCredentialsAuth",
                message: `Failed to revoke access token: ${err.message}`,
            });
        }
        this.accessToken = undefined;
    }
}
//# sourceMappingURL=clientCredentials.js.map