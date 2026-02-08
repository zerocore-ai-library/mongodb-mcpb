import type { LoggerBase } from "../../logger.js";
export interface AccessToken {
    access_token: string;
    expires_at?: number;
}
/**
 * AuthProvider is a pluggable strategy that injects auth data into outbound Atlas API requests
 * (for example "Authorization: Bearer <token>").
 * Implementations may cache auth state and support revocation or cleanup.
 */
export interface AuthProvider {
    validate(): Promise<boolean>;
    getAuthHeaders(): Promise<Record<string, string> | undefined>;
    revoke(): Promise<void>;
}
export interface Credentials {
    clientId?: string;
    clientSecret?: string;
}
export interface AuthProviderOptions {
    apiBaseUrl: string;
    userAgent: string;
    credentials: Credentials;
}
export declare class AuthProviderFactory {
    static create(options: AuthProviderOptions, logger: LoggerBase): AuthProvider | undefined;
}
//# sourceMappingURL=authProvider.d.ts.map