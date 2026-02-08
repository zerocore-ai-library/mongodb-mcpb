export interface AppNameComponents {
    appName: string;
    deviceId?: Promise<string>;
    clientName?: string;
}
/**
 * Sets the appName parameter with the extended format: appName--deviceId--clientName
 * Only sets the appName if it's not already present in the connection string
 * @param connectionString - The connection string to modify
 * @param components - The components to build the appName from
 * @returns The modified connection string
 */
export declare function setAppNameParamIfMissing({ connectionString, components, }: {
    connectionString: string;
    components: AppNameComponents;
}): Promise<string>;
/**
 * Validates the connection string
 * @param connectionString - The connection string to validate
 * @param looseValidation - Whether to allow loose validation
 * @returns void
 * @throws Error if the connection string is invalid
 */
export declare function validateConnectionString(connectionString: string, looseValidation: boolean): void;
//# sourceMappingURL=connectionOptions.d.ts.map