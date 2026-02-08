import { formatUntrustedData } from "../../tool.js";
import { AtlasToolBase } from "../atlasTool.js";
import { AtlasArgs } from "../../args.js";
export const InspectAccessListArgs = {
    projectId: AtlasArgs.projectId().describe("Atlas project ID"),
};
export class InspectAccessListTool extends AtlasToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-inspect-access-list";
        this.description = "Inspect Ip/CIDR ranges with access to your MongoDB Atlas clusters.";
        this.argsShape = {
            ...InspectAccessListArgs,
        };
    }
    async execute({ projectId }) {
        const accessList = await this.apiClient.listAccessListEntries({
            params: {
                path: {
                    groupId: projectId,
                },
            },
        });
        const results = accessList.results ?? [];
        if (!results.length) {
            return {
                content: [{ type: "text", text: "No access list entries found." }],
            };
        }
        const entries = results.map((entry) => ({
            ipAddress: entry.ipAddress,
            cidrBlock: entry.cidrBlock,
            comment: entry.comment,
        }));
        return {
            content: formatUntrustedData(`Found ${results.length} access list entries`, JSON.stringify(entries)),
        };
    }
}
InspectAccessListTool.operationType = "read";
//# sourceMappingURL=inspectAccessList.js.map