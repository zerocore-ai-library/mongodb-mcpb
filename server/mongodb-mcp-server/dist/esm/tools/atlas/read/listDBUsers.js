import { AtlasToolBase } from "../atlasTool.js";
import { formatUntrustedData } from "../../tool.js";
import { AtlasArgs } from "../../args.js";
export const ListDBUsersArgs = {
    projectId: AtlasArgs.projectId().describe("Atlas project ID to filter DB users"),
};
export class ListDBUsersTool extends AtlasToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-list-db-users";
        this.description = "List MongoDB Atlas database users";
        this.argsShape = {
            ...ListDBUsersArgs,
        };
    }
    async execute({ projectId }) {
        const data = await this.apiClient.listDatabaseUsers({
            params: {
                path: {
                    groupId: projectId,
                },
            },
        });
        if (!data?.results?.length) {
            return {
                content: [{ type: "text", text: " No database users found" }],
            };
        }
        const users = data.results.map((user) => ({
            username: user.username,
            roles: user.roles?.map((role) => ({
                roleName: role.roleName,
                databaseName: role.databaseName,
                collectionName: role.collectionName,
            })) ?? [],
            scopes: user.scopes?.map((scope) => ({
                type: scope.type,
                name: scope.name,
            })) ?? [],
        }));
        return {
            content: formatUntrustedData(`Found ${data.results.length} database users in project ${projectId}`, JSON.stringify(users)),
        };
    }
}
ListDBUsersTool.operationType = "read";
//# sourceMappingURL=listDBUsers.js.map