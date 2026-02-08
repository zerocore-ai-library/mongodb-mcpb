const readWriteRole = {
    roleName: "readWriteAnyDatabase",
    databaseName: "admin",
};
const readOnlyRole = {
    roleName: "readAnyDatabase",
    databaseName: "admin",
};
/**
 * Get the default role name for the database user based on the Atlas Admin API
 * https://www.mongodb.com/docs/atlas/mongodb-users-roles-and-privileges/
 */
export function getDefaultRoleFromConfig(config) {
    if (config.readOnly) {
        return readOnlyRole;
    }
    // If any of the write tools are enabled, use readWriteAnyDatabase
    if (!config.disabledTools.includes("create") ||
        !config.disabledTools.includes("update") ||
        !config.disabledTools.includes("delete")) {
        return readWriteRole;
    }
    return readOnlyRole;
}
//# sourceMappingURL=roles.js.map