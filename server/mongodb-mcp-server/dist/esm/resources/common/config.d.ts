import { ReactiveResource } from "../resource.js";
import type { UserConfig } from "../../common/config/userConfig.js";
import type { Telemetry } from "../../telemetry/telemetry.js";
import type { Session } from "../../lib.js";
export declare class ConfigResource extends ReactiveResource<UserConfig, readonly []> {
    constructor(session: Session, config: UserConfig, telemetry: Telemetry);
    reduce(eventName: undefined, event: undefined): UserConfig;
    toOutput(): string;
}
//# sourceMappingURL=config.d.ts.map