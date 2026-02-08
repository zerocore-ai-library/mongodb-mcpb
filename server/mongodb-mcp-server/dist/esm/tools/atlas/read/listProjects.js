import { AtlasToolBase } from "../atlasTool.js";
import { formatUntrustedData } from "../../tool.js";
import { AtlasArgs } from "../../args.js";
export class ListProjectsTool extends AtlasToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-list-projects";
        this.description = "List MongoDB Atlas projects";
        this.argsShape = {
            orgId: AtlasArgs.organizationId()
                .describe("Atlas organization ID to filter projects. If not provided, projects for all orgs are returned.")
                .optional(),
        };
    }
    async execute({ orgId }) {
        const orgData = await this.apiClient.listOrgs();
        if (!orgData?.results?.length) {
            return {
                content: [{ type: "text", text: "No organizations found in your MongoDB Atlas account." }],
            };
        }
        const orgs = orgData.results
            .filter((org) => org.id)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .reduce((acc, org) => ({ ...acc, [org.id]: org.name }), {});
        const data = orgId
            ? await this.apiClient.getOrgGroups({
                params: {
                    path: {
                        orgId,
                    },
                },
            })
            : await this.apiClient.listGroups();
        if (!data?.results?.length) {
            return {
                content: [{ type: "text", text: `No projects found in organization ${orgId}.` }],
            };
        }
        const serializedProjects = JSON.stringify(data.results.map((project) => ({
            name: project.name,
            id: project.id,
            orgId: project.orgId,
            orgName: orgs[project.orgId] ?? "N/A",
            created: project.created ? new Date(project.created).toLocaleString() : "N/A",
        })), null, 2);
        return {
            content: formatUntrustedData(`Found ${data.results.length} projects`, serializedProjects),
        };
    }
}
ListProjectsTool.operationType = "read";
//# sourceMappingURL=listProjects.js.map