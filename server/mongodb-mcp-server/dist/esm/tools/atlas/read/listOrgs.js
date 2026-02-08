import { AtlasToolBase } from "../atlasTool.js";
import { formatUntrustedData } from "../../tool.js";
export class ListOrganizationsTool extends AtlasToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-list-orgs";
        this.description = "List MongoDB Atlas organizations";
        this.argsShape = {};
    }
    async execute() {
        const data = await this.apiClient.listOrgs();
        if (!data?.results?.length) {
            return {
                content: [{ type: "text", text: "No organizations found in your MongoDB Atlas account." }],
            };
        }
        const orgs = data.results.map((org) => ({
            name: org.name,
            id: org.id,
        }));
        return {
            content: formatUntrustedData(`Found ${data.results.length} organizations in your MongoDB Atlas account.`, JSON.stringify(orgs)),
        };
    }
}
ListOrganizationsTool.operationType = "read";
//# sourceMappingURL=listOrgs.js.map