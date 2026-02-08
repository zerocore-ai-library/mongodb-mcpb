import { isAtlas } from "mongodb-build-info";
import { ConnectionString } from "mongodb-connection-string-url";
/**
 * Get metadata about the connection string including authentication type and host type.
 * @param connectionString - The connection string to analyze.
 * @param config - The user configuration used to determine auth type.
 * @param atlasInfo - Optional Atlas cluster connection info. If provided, host type is set to "atlas".
 * @returns The connection string metadata.
 */
export function getConnectionStringInfo(connectionString, config, atlasInfo) {
    return {
        authType: getAuthType(config, connectionString),
        hostType: atlasInfo !== undefined ? "atlas" : getHostType(connectionString),
    };
}
/**
 * Get the host type from the connection string.
 * @param connectionString - The connection string to get the host type from.
 * @returns The host type.
 */
export function getHostType(connectionString) {
    if (isAtlas(connectionString)) {
        return "atlas";
    }
    return "unknown";
}
/**
 * Infer the authentication type from the connection string and user configuration.
 * @param config - The user configuration.
 * @param connectionString - The connection string to infer the auth type from.
 * @returns The inferred authentication type.
 */
export function getAuthType(config, connectionString) {
    const connString = new ConnectionString(connectionString);
    const searchParams = connString.typedSearchParams();
    switch (searchParams.get("authMechanism")) {
        case "MONGODB-OIDC": {
            if (config.transport === "stdio" && config.browser) {
                return "oidc-auth-flow";
            }
            if (config.transport === "http" &&
                (config.httpHost === "127.0.0.1" || config.httpHost === "localhost") &&
                config.browser) {
                return "oidc-auth-flow";
            }
            return "oidc-device-flow";
        }
        case "MONGODB-X509":
            return "x.509";
        case "GSSAPI":
            return "kerberos";
        case "PLAIN":
            if (searchParams.get("authSource") === "$external") {
                return "ldap";
            }
            return "scram";
        // default should catch also null, but eslint complains
        // about it.
        case null:
        default:
            return "scram";
    }
}
//# sourceMappingURL=connectionInfo.js.map