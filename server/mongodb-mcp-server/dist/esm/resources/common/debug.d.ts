import { ReactiveResource } from "../resource.js";
import type { Telemetry } from "../../telemetry/telemetry.js";
import type { Session, UserConfig } from "../../lib.js";
import type { AtlasClusterConnectionInfo, ConnectionStateErrored } from "../../common/connectionManager.js";
import type { ConnectionStringInfo } from "../../common/connectionInfo.js";
type ConnectionStateDebuggingInformation = {
    readonly tag: "connected" | "connecting" | "disconnected" | "errored";
    readonly connectionStringInfo?: ConnectionStringInfo;
    readonly errorReason?: string;
    readonly connectedAtlasCluster?: AtlasClusterConnectionInfo;
};
export declare class DebugResource extends ReactiveResource<ConnectionStateDebuggingInformation, readonly ["connect", "disconnect", "close", "connection-error"]> {
    constructor(session: Session, config: UserConfig, telemetry: Telemetry);
    reduce(eventName: "connect" | "disconnect" | "close" | "connection-error", event: ConnectionStateErrored | undefined): ConnectionStateDebuggingInformation;
    toOutput(): Promise<string>;
}
export {};
//# sourceMappingURL=debug.d.ts.map