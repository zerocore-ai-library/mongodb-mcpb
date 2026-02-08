import { AtlasLocalToolBase } from "../atlasLocalTool.js";
import { CommonArgs } from "../../args.js";
export class DeleteDeploymentTool extends AtlasLocalToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-local-delete-deployment";
        this.description = "Delete a MongoDB Atlas local deployment";
        this.argsShape = {
            deploymentName: CommonArgs.string().describe("Name of the deployment to delete"),
        };
    }
    async executeWithAtlasLocalClient({ deploymentName }, { client }) {
        // Lookup telemetry metadata
        // We need to lookup the telemetry metadata before deleting the deployment
        // to ensure that the deployment ID is set in the result metadata
        const telemetryMetadata = await this.lookupTelemetryMetadata(client, deploymentName);
        // Delete the deployment
        await client.deleteDeployment(deploymentName);
        return {
            content: [{ type: "text", text: `Deployment "${deploymentName}" deleted successfully.` }],
            _meta: {
                ...telemetryMetadata,
            },
        };
    }
}
DeleteDeploymentTool.operationType = "delete";
//# sourceMappingURL=deleteDeployment.js.map