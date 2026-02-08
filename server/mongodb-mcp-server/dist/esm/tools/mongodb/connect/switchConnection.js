import z from "zod";
import { MongoDBToolBase } from "../mongodbTool.js";
export class SwitchConnectionTool extends MongoDBToolBase {
    constructor(params) {
        super(params);
        this.name = "switch-connection";
        this.description = "Switch to a different MongoDB connection. If the user has configured a connection string or has previously called the connect tool, a connection is already established and there's no need to call this tool unless the user has explicitly requested to switch to a new instance.";
        this.argsShape = {
            connectionString: z
                .string()
                .optional()
                .describe("MongoDB connection string to switch to (in the mongodb:// or mongodb+srv:// format). If a connection string is not provided, the connection string from the config will be used."),
        };
        params.session.on("connect", () => {
            this.enable();
        });
        params.session.on("disconnect", () => {
            this.disable();
        });
    }
    register(server) {
        const registrationSuccessful = super.register(server);
        /**
         * When connected to mongodb we want to swap connect with
         * switch-connection tool.
         */
        if (registrationSuccessful && !this.session.isConnectedToMongoDB) {
            this.disable();
        }
        return registrationSuccessful;
    }
    async execute({ connectionString }) {
        if (typeof connectionString !== "string") {
            await this.session.connectToConfiguredConnection();
        }
        else {
            await this.session.connectToMongoDB({ connectionString });
        }
        return {
            content: [{ type: "text", text: "Successfully connected to MongoDB." }],
        };
    }
}
SwitchConnectionTool.operationType = "connect";
//# sourceMappingURL=switchConnection.js.map