import { DbOperationArgs, MongoDBToolBase } from "../mongodbTool.js";
import { formatUntrustedData } from "../../tool.js";
import { EJSON } from "bson";
export class DbStatsTool extends MongoDBToolBase {
    constructor() {
        super(...arguments);
        this.name = "db-stats";
        this.description = "Returns statistics that reflect the use state of a single database";
        this.argsShape = {
            database: DbOperationArgs.database,
        };
    }
    async execute({ database }, { signal }) {
        const provider = await this.ensureConnected();
        const result = await provider.runCommandWithCheck(database, {
            dbStats: 1,
            scale: 1,
        }, { signal });
        return {
            content: formatUntrustedData(`Statistics for database ${database}`, EJSON.stringify(result)),
        };
    }
}
DbStatsTool.operationType = "metadata";
//# sourceMappingURL=dbStats.js.map