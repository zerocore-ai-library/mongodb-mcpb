import { formatUntrustedData } from "../../tool.js";
import { AtlasToolBase } from "../atlasTool.js";
import { AtlasArgs } from "../../args.js";
export const ListAlertsArgs = {
    projectId: AtlasArgs.projectId().describe("Atlas project ID to list alerts for"),
};
export class ListAlertsTool extends AtlasToolBase {
    constructor() {
        super(...arguments);
        this.name = "atlas-list-alerts";
        this.description = "List MongoDB Atlas alerts";
        this.argsShape = {
            ...ListAlertsArgs,
        };
    }
    async execute({ projectId }) {
        const data = await this.apiClient.listAlerts({
            params: {
                path: {
                    groupId: projectId,
                },
            },
        });
        if (!data?.results?.length) {
            return { content: [{ type: "text", text: "No alerts found in your MongoDB Atlas project." }] };
        }
        const alerts = data.results.map((alert) => ({
            id: alert.id,
            status: alert.status,
            created: alert.created ? new Date(alert.created).toISOString() : "N/A",
            updated: alert.updated ? new Date(alert.updated).toISOString() : "N/A",
            eventTypeName: alert.eventTypeName,
            acknowledgementComment: alert.acknowledgementComment ?? "N/A",
        }));
        return {
            content: formatUntrustedData(`Found ${data.results.length} alerts in project ${projectId}`, JSON.stringify(alerts)),
        };
    }
}
ListAlertsTool.operationType = "read";
//# sourceMappingURL=listAlerts.js.map