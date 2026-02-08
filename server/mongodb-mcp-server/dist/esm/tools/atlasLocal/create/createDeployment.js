import { AtlasLocalToolBase } from "../atlasLocalTool.js";
import { CommonArgs } from "../../args.js";
import z from "zod";
export class CreateDeploymentTool extends AtlasLocalToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-local-create-deployment";
        this.description = "Create a MongoDB Atlas local deployment";
        this.argsShape = {
            deploymentName: CommonArgs.string().describe("Name of the deployment to create").optional(),
            loadSampleData: z.boolean().describe("Load sample data into the deployment").optional().default(false),
        };
    }
    async executeWithAtlasLocalClient({ deploymentName, loadSampleData }, { client }) {
        const deploymentOptions = {
            name: deploymentName,
            creationSource: {
                type: "MCPServer",
                source: "MCPServer",
            },
            loadSampleData,
            doNotTrack: !this.telemetry.isTelemetryEnabled(),
        };
        // Create the deployment
        const deployment = await client.createDeployment(deploymentOptions);
        return {
            content: [
                {
                    type: "text",
                    text: `Deployment with container ID "${deployment.containerId}" and name "${deployment.name}" created.`,
                },
            ],
            _meta: {
                ...(await this.lookupTelemetryMetadata(client, deployment.containerId)),
            },
        };
    }
}
CreateDeploymentTool.operationType = "create";
//# sourceMappingURL=createDeployment.js.map