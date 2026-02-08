import { UserConfigSchema, configRegistry } from "./userConfig.js";
export const CONFIG_HEADER_PREFIX = "x-mongodb-mcp-";
export const CONFIG_QUERY_PREFIX = "mongodbMcp";
/**
 * Applies config overrides from request context (headers and query parameters).
 * Query parameters take precedence over headers. Can be used within the createSessionConfig
 * hook to manually apply the overrides. Requires `allowRequestOverrides` to be enabled.
 *
 * @param baseConfig - The base user configuration
 * @param request - The request context containing headers and query parameters
 * @returns The configuration with overrides applied
 */
export function applyConfigOverrides({ baseConfig, request, }) {
    if (!request) {
        return baseConfig;
    }
    const result = { ...baseConfig };
    const overridesFromHeaders = extractConfigOverrides("header", request.headers);
    const overridesFromQuery = extractConfigOverrides("query", request.query);
    // Only apply overrides if allowRequestOverrides is enabled
    if (!baseConfig.allowRequestOverrides &&
        (Object.keys(overridesFromHeaders).length > 0 || Object.keys(overridesFromQuery).length > 0)) {
        throw new Error("Request overrides are not enabled");
    }
    // Apply header overrides first
    for (const [key, overrideValue] of Object.entries(overridesFromHeaders)) {
        assertValidConfigKey(key);
        const meta = getConfigMeta(key);
        const behavior = meta?.overrideBehavior || "not-allowed";
        const baseValue = baseConfig[key];
        const newValue = applyOverride(key, baseValue, overrideValue, behavior);
        result[key] = newValue;
    }
    // Apply query overrides (with precedence), but block secret fields
    for (const [key, overrideValue] of Object.entries(overridesFromQuery)) {
        assertValidConfigKey(key);
        const meta = getConfigMeta(key);
        // Prevent overriding secret fields via query params
        if (meta?.isSecret) {
            throw new Error(`Config key ${key} can only be overriden with headers.`);
        }
        const behavior = meta?.overrideBehavior || "not-allowed";
        const baseValue = baseConfig[key];
        const newValue = applyOverride(key, baseValue, overrideValue, behavior);
        result[key] = newValue;
    }
    return result;
}
/**
 * Extracts config overrides from HTTP headers or query parameters.
 */
function extractConfigOverrides(mode, source) {
    if (!source) {
        return {};
    }
    const overrides = {};
    for (const [name, value] of Object.entries(source)) {
        const configKey = nameToConfigKey(mode, name);
        if (!configKey) {
            continue;
        }
        assertValidConfigKey(configKey);
        const parsedValue = parseConfigValue(configKey, value);
        if (parsedValue !== undefined) {
            overrides[configKey] = parsedValue;
        }
    }
    return overrides;
}
function assertValidConfigKey(key) {
    if (!(key in UserConfigSchema.shape)) {
        throw new Error(`Invalid config key: ${key}`);
    }
}
/**
 * Gets the schema metadata for a config key.
 */
export function getConfigMeta(key) {
    return configRegistry.get(UserConfigSchema.shape[key]);
}
/**
 * Parses a string value to the appropriate type using the Zod schema.
 */
function parseConfigValue(key, value) {
    const fieldSchema = UserConfigSchema.shape[key];
    if (!fieldSchema) {
        throw new Error(`Invalid config key: ${key}`);
    }
    const result = fieldSchema.safeParse(value);
    if (!result.success) {
        throw new Error(`Invalid configuration for the following fields:\n${result.error.issues.map((issue) => `${key} - ${issue.message}`).join("\n")}`);
    }
    return result.data;
}
/**
 * Converts a header/query name to its config key format.
 * Example: "x-mongodb-mcp-read-only" -> "readOnly"
 * Example: "mongodbMcpReadOnly" -> "readOnly"
 */
export function nameToConfigKey(mode, name) {
    const lowerCaseName = name.toLowerCase();
    if (mode === "header" && lowerCaseName.startsWith(CONFIG_HEADER_PREFIX)) {
        const normalized = lowerCaseName.substring(CONFIG_HEADER_PREFIX.length);
        // Convert kebab-case to camelCase
        return normalized.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    }
    if (mode === "query" && name.startsWith(CONFIG_QUERY_PREFIX)) {
        const withoutPrefix = name.substring(CONFIG_QUERY_PREFIX.length);
        // Convert first letter to lowercase to get config key
        return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1);
    }
    return undefined;
}
function applyOverride(key, baseValue, overrideValue, behavior) {
    if (typeof behavior === "function") {
        // Custom logic function returns the value to use (potentially transformed)
        // or throws an error if the override cannot be applied
        try {
            return behavior(baseValue, overrideValue);
        }
        catch (error) {
            throw new Error(`Cannot apply override for ${key}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    switch (behavior) {
        case "override":
            return overrideValue;
        case "merge":
            if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
                return [...baseValue, ...overrideValue];
            }
            throw new Error(`Cannot merge non-array values for ${key}`);
        case "not-allowed":
            throw new Error(`Config key ${key} is not allowed to be overridden`);
        default:
            return baseValue;
    }
}
//# sourceMappingURL=configOverrides.js.map