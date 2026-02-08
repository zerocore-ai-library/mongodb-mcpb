import { z } from "zod";
import { ToolBase } from "../tool.js";
import { ErrorCodes, MongoDBError } from "../../common/errors.js";
import { LogId } from "../../common/logger.js";
export const DbOperationArgs = {
    database: z.string().describe("Database name"),
    collection: z.string().describe("Collection name"),
};
export class MongoDBToolBase extends ToolBase {
    async ensureConnected() {
        if (!this.session.isConnectedToMongoDB) {
            if (this.session.connectedAtlasCluster) {
                throw new MongoDBError(ErrorCodes.NotConnectedToMongoDB, `Attempting to connect to Atlas cluster "${this.session.connectedAtlasCluster.clusterName}", try again in a few seconds.`);
            }
            if (this.config.connectionString) {
                try {
                    await this.session.connectToConfiguredConnection();
                }
                catch (error) {
                    this.session.logger.error({
                        id: LogId.mongodbConnectFailure,
                        context: "mongodbTool",
                        message: `Failed to connect to MongoDB instance using the connection string from the config: ${error}`,
                    });
                    throw new MongoDBError(ErrorCodes.MisconfiguredConnectionString, "Not connected to MongoDB.");
                }
            }
        }
        if (!this.session.isConnectedToMongoDB) {
            throw new MongoDBError(ErrorCodes.NotConnectedToMongoDB, "Not connected to MongoDB");
        }
        return this.session.serviceProvider;
    }
    register(server) {
        this.server = server;
        return super.register(server);
    }
    handleError(error, args) {
        if (error instanceof MongoDBError) {
            switch (error.code) {
                case ErrorCodes.NotConnectedToMongoDB:
                case ErrorCodes.MisconfiguredConnectionString: {
                    const connectionError = error;
                    const outcome = this.server?.connectionErrorHandler(connectionError, {
                        availableTools: this.server?.tools ?? [],
                        connectionState: this.session.connectionManager.currentConnectionState,
                    });
                    if (outcome?.errorHandled) {
                        return outcome.result;
                    }
                    return super.handleError(error, args);
                }
                case ErrorCodes.ForbiddenCollscan:
                    return {
                        content: [
                            {
                                type: "text",
                                text: error.message,
                            },
                        ],
                        isError: true,
                    };
                case ErrorCodes.AtlasSearchNotSupported: {
                    const CTA = this.server?.isToolCategoryAvailable("atlas-local")
                        ? "`atlas-local` tools"
                        : "Atlas CLI";
                    return {
                        content: [
                            {
                                text: `The connected MongoDB deployment does not support vector search indexes. Either connect to a MongoDB Atlas cluster or use the ${CTA} to create and manage a local Atlas deployment.`,
                                type: "text",
                            },
                        ],
                        isError: true,
                    };
                }
            }
        }
        return super.handleError(error, args);
    }
    /**
     * Resolves the tool metadata from the arguments passed to the mongoDB tools.
     *
     * Since MongoDB tools are executed against a MongoDB instance, the tool calls will always have the connection information.
     *
     * @param result - The result of the tool call.
     * @param args - The arguments passed to the tool
     * @returns The tool metadata
     */
    resolveTelemetryMetadata(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { result }) {
        return this.getConnectionInfoMetadata();
    }
}
MongoDBToolBase.category = "mongodb";
//# sourceMappingURL=mongodbTool.js.map