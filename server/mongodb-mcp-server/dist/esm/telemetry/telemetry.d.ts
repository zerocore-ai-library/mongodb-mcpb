import type { Session } from "../common/session.js";
import type { BaseEvent, CommonProperties } from "./types.js";
import type { UserConfig } from "../common/config/userConfig.js";
import { EventCache } from "./eventCache.js";
import type { DeviceId } from "../helpers/deviceId.js";
import { EventEmitter } from "events";
export interface TelemetryEvents {
    "events-emitted": [];
    "events-send-failed": [];
    "events-skipped": [];
}
export declare class Telemetry {
    private readonly session;
    private readonly userConfig;
    private readonly commonProperties;
    private isBufferingEvents;
    /** Resolves when the setup is complete or a timeout occurs */
    setupPromise: Promise<[string, boolean]> | undefined;
    readonly events: EventEmitter<TelemetryEvents>;
    private eventCache;
    private deviceId;
    private constructor();
    static create(session: Session, userConfig: UserConfig, deviceId: DeviceId, { commonProperties, eventCache, }?: {
        commonProperties?: Partial<CommonProperties>;
        eventCache?: EventCache;
    }): Telemetry;
    private setup;
    close(): Promise<void>;
    /**
     * Emits events through the telemetry pipeline
     * @param events - The events to emit
     */
    emitEvents(events: BaseEvent[]): void;
    /**
     * Gets the common properties for events
     * @returns Object containing common properties for all events
     */
    getCommonProperties(): CommonProperties;
    /**
     * Checks if telemetry is currently enabled
     * This is a method rather than a constant to capture runtime config changes
     *
     * Follows the Console Do Not Track standard (https://consoledonottrack.com/)
     * by respecting the DO_NOT_TRACK environment variable
     */
    isTelemetryEnabled(): boolean;
    /**
     * Attempts to emit events through authenticated and unauthenticated clients
     * Falls back to caching if both attempts fail
     */
    private emit;
    /**
     * Attempts to send events through the provided API client.
     * Events are redacted before being sent to ensure no sensitive data is transmitted
     */
    private sendEvents;
}
//# sourceMappingURL=telemetry.d.ts.map