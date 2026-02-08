import { AtlasToolBase } from "../atlasTool.js";
import { ensureCurrentIpInAccessList } from "../../../common/atlas/accessListUtils.js";
import { AtlasArgs } from "../../args.js";
export class CreateFreeClusterTool extends AtlasToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-create-free-cluster";
        this.description = "Create a free MongoDB Atlas cluster";
        this.argsShape = {
            projectId: AtlasArgs.projectId().describe("Atlas project ID to create the cluster in"),
            name: AtlasArgs.clusterName().describe("Name of the cluster"),
            region: AtlasArgs.region().describe("Region of the cluster").default("US_EAST_1"),
        };
    }
    async execute({ projectId, name, region }) {
        const input = {
            groupId: projectId,
            name,
            clusterType: "REPLICASET",
            replicationSpecs: [
                {
                    zoneName: "Zone 1",
                    regionConfigs: [
                        {
                            providerName: "TENANT",
                            backingProviderName: "AWS",
                            regionName: region,
                            electableSpecs: {
                                instanceSize: "M0",
                            },
                        },
                    ],
                },
            ],
            terminationProtectionEnabled: false,
        };
        await ensureCurrentIpInAccessList(this.apiClient, projectId);
        await this.apiClient.createCluster({
            params: {
                path: {
                    groupId: projectId,
                },
            },
            body: input,
        });
        return {
            content: [
                { type: "text", text: `Cluster "${name}" has been created in region "${region}".` },
                { type: "text", text: `Double check your access lists to enable your current IP.` },
            ],
        };
    }
}
CreateFreeClusterTool.operationType = "create";
//# sourceMappingURL=createFreeCluster.js.map