import { AtlasLocalToolBase } from "../atlasLocalTool.js";
import { formatUntrustedData } from "../../tool.js";
export class ListDeploymentsTool extends AtlasLocalToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-local-list-deployments";
        this.description = "List MongoDB Atlas local deployments";
        this.argsShape = {};
    }
    async executeWithAtlasLocalClient(_args, { client }) {
        // List the deployments
        const deployments = await client.listDeployments();
        // Format the deployments
        return this.formatDeploymentsTable(deployments);
    }
    formatDeploymentsTable(deployments) {
        // Check if deployments are absent
        if (!deployments?.length) {
            return {
                content: [{ type: "text", text: "No deployments found." }],
            };
        }
        // Filter out the fields we want to return to the user
        // We don't want to return the entire deployment object because it contains too much data
        const deploymentsJson = deployments.map((deployment) => {
            return {
                name: deployment.name,
                state: deployment.state,
                mongodbVersion: deployment.mongodbVersion,
            };
        });
        return {
            content: formatUntrustedData(`Found ${deployments.length} deployments`, JSON.stringify(deploymentsJson)),
        };
    }
}
ListDeploymentsTool.operationType = "read";
//# sourceMappingURL=listDeployments.js.map