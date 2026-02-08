import type { Server } from "../server.js";
import type { Session } from "../common/session.js";
import type { UserConfig } from "../common/config/userConfig.js";
import type { Telemetry } from "../telemetry/telemetry.js";
import type { SessionEvents } from "../common/session.js";
import type { ResourceMetadata } from "@modelcontextprotocol/sdk/server/mcp.js";
type PayloadOf<K extends keyof SessionEvents> = SessionEvents[K][0];
export type ResourceConfiguration = {
    name: string;
    uri: string;
    config: ResourceMetadata;
};
export type ReactiveResourceOptions<Value, RelevantEvents extends readonly (keyof SessionEvents)[]> = {
    initial: Value;
    events: RelevantEvents;
};
export declare abstract class ReactiveResource<Value, RelevantEvents extends readonly (keyof SessionEvents)[]> {
    protected server?: Server;
    protected session: Session;
    protected config: UserConfig;
    protected telemetry: Telemetry;
    protected current: Value;
    protected readonly name: string;
    protected readonly uri: string;
    protected readonly resourceConfig: ResourceMetadata;
    protected readonly events: RelevantEvents;
    constructor({ resourceConfiguration, options, session, config, telemetry, current, }: {
        resourceConfiguration: ResourceConfiguration;
        options: ReactiveResourceOptions<Value, RelevantEvents>;
        session: Session;
        config: UserConfig;
        telemetry: Telemetry;
        current?: Value;
    });
    private setupEventListeners;
    register(server: Server): void;
    private resourceCallback;
    private triggerUpdate;
    reduceApply(eventName: RelevantEvents[number], ...event: PayloadOf<RelevantEvents[number]>[]): void;
    protected abstract reduce(eventName: RelevantEvents[number], ...event: PayloadOf<RelevantEvents[number]>[]): Value;
    abstract toOutput(): string | Promise<string>;
}
export {};
//# sourceMappingURL=resource.d.ts.map