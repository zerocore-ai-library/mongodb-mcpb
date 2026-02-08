import { z } from "zod";
import { MongoDBToolBase } from "../mongodbTool.js";
export class ConnectTool extends MongoDBToolBase {
    constructor(params) {
        super(params);
        this.name = "connect";
        this.description = "Connect to a MongoDB instance. The config resource captures if the server is already connected to a MongoDB cluster. If the user has configured a connection string or has previously called the connect tool, a connection is already established and there's no need to call this tool unless the user has explicitly requested to switch to a new MongoDB cluster.";
        // Here the default is empty just to trigger registration, but we're going to override it with the correct
        // schema in the register method.
        this.argsShape = {
            connectionString: z.string().describe("MongoDB connection string (in the mongodb:// or mongodb+srv:// format)"),
        };
        params.session.on("connect", () => {
            this.disable();
        });
        params.session.on("disconnect", () => {
            this.enable();
        });
    }
    register(server) {
        const registrationSuccessful = super.register(server);
        /**
         * When connected to mongodb we want to swap connect with
         * switch-connection tool.
         */
        if (registrationSuccessful && this.session.isConnectedToMongoDB) {
            this.disable();
        }
        return registrationSuccessful;
    }
    async execute({ connectionString }) {
        await this.session.connectToMongoDB({ connectionString });
        return {
            content: [{ type: "text", text: "Successfully connected to MongoDB." }],
        };
    }
}
ConnectTool.operationType = "connect";
//# sourceMappingURL=connect.js.map