import type { UserConfig } from "../config/userConfig.js";
import type { DatabaseUserRole } from "./openapi.js";
/**
 * Get the default role name for the database user based on the Atlas Admin API
 * https://www.mongodb.com/docs/atlas/mongodb-users-roles-and-privileges/
 */
export declare function getDefaultRoleFromConfig(config: UserConfig): DatabaseUserRole;
//# sourceMappingURL=roles.d.ts.map