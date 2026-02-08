export type CustomOverrideLogic = (oldValue: unknown, newValue: unknown) => unknown;
/**
 * Defines how a config field can be overridden via HTTP headers or query parameters.
 */
export type OverrideBehavior = "not-allowed" | "override" | "merge" | CustomOverrideLogic;
/**
 * Metadata for config schema fields.
 */
export type ConfigFieldMeta = {
    /**
     * Custom description for the default value, used when generating documentation.
     */
    defaultValueDescription?: string;
    /**
     * Marks the field as containing sensitive/secret information, used for MCP Registry.
     * Secret fields will be marked as secret in environment variable definitions.
     */
    isSecret?: boolean;
    /**
     * Defines how this config field can be overridden via HTTP headers or query parameters.
     * Defaults to "not-allowed" for security.
     */
    overrideBehavior?: OverrideBehavior;
    [key: string]: unknown;
};
export declare function matchingConfigKey(key: string): string | undefined;
export declare function getLocalDataPath(): string;
export declare function getLogPath(): string;
export declare function getExportsPath(): string;
export declare function commaSeparatedToArray<T extends string[]>(str: string | string[] | undefined): T | undefined;
/**
 * Preprocessor for boolean values that handles string "false"/"0" correctly.
 * Zod's coerce.boolean() treats any non-empty string as true, which is not what we want.
 */
export declare function parseBoolean(val: unknown): unknown;
/** Allow overriding only to the allowed value */
export declare function oneWayOverride<T>(allowedValue: T): CustomOverrideLogic;
/** Allow overriding only to a value lower than the specified value */
export declare function onlyLowerThanBaseValueOverride(): CustomOverrideLogic;
/** Allow overriding only to a subset of an array but not a superset */
export declare function onlySubsetOfBaseValueOverride(): CustomOverrideLogic;
//# sourceMappingURL=configUtils.d.ts.map