import { LogId } from "../common/logger.js";
export class ReactiveResource {
    constructor({ resourceConfiguration, options, session, config, telemetry, current, }) {
        this.resourceCallback = async (uri) => ({
            contents: [
                {
                    text: await this.toOutput(),
                    mimeType: "application/json",
                    uri: uri.href,
                },
            ],
        });
        this.session = session;
        this.config = config;
        this.telemetry = telemetry;
        this.name = resourceConfiguration.name;
        this.uri = resourceConfiguration.uri;
        this.resourceConfig = resourceConfiguration.config;
        this.events = options.events;
        this.current = current ?? options.initial;
        this.setupEventListeners();
    }
    setupEventListeners() {
        for (const event of this.events) {
            this.session.on(event, (...args) => {
                this.reduceApply(event, args[0]);
                void this.triggerUpdate();
            });
        }
    }
    register(server) {
        this.server = server;
        this.server.mcpServer.registerResource(this.name, this.uri, this.resourceConfig, this.resourceCallback);
    }
    triggerUpdate() {
        try {
            this.server?.sendResourceListChanged();
            this.server?.sendResourceUpdated(this.uri);
        }
        catch (error) {
            this.session.logger.warning({
                id: LogId.resourceUpdateFailure,
                context: "resource",
                message: `Could not send the latest resources to the client: ${error}`,
            });
        }
    }
    reduceApply(eventName, ...event) {
        this.current = this.reduce(eventName, ...event);
    }
}
//# sourceMappingURL=resource.js.map