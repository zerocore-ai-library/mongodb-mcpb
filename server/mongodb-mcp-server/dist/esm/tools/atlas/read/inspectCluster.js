import { formatUntrustedData } from "../../tool.js";
import { AtlasToolBase } from "../atlasTool.js";
import { inspectCluster } from "../../../common/atlas/cluster.js";
import { AtlasArgs } from "../../args.js";
export const InspectClusterArgs = {
    projectId: AtlasArgs.projectId().describe("Atlas project ID"),
    clusterName: AtlasArgs.clusterName().describe("Atlas cluster name"),
};
export class InspectClusterTool extends AtlasToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-inspect-cluster";
        this.description = "Inspect metadata of a MongoDB Atlas cluster";
        this.argsShape = {
            ...InspectClusterArgs,
        };
    }
    async execute({ projectId, clusterName }) {
        const cluster = await inspectCluster(this.apiClient, projectId, clusterName);
        return this.formatOutput(cluster);
    }
    formatOutput(formattedCluster) {
        const clusterDetails = {
            name: formattedCluster.name || "Unknown",
            instanceType: formattedCluster.instanceType,
            instanceSize: formattedCluster.instanceSize || "N/A",
            state: formattedCluster.state || "UNKNOWN",
            mongoDBVersion: formattedCluster.mongoDBVersion || "N/A",
            connectionStrings: formattedCluster.connectionStrings || {},
        };
        return {
            content: formatUntrustedData("Cluster details:", JSON.stringify(clusterDetails)),
        };
    }
}
InspectClusterTool.operationType = "read";
//# sourceMappingURL=inspectCluster.js.map