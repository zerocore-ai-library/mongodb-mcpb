import type { BaseEvent } from "./types.js";
/**
 * Singleton class for in-memory telemetry event caching
 * Provides a central storage for telemetry events that couldn't be sent
 * Uses LRU cache to automatically drop oldest events when limit is exceeded
 */
export declare class EventCache {
    private static instance;
    private static readonly MAX_EVENTS;
    private cache;
    private nextId;
    constructor();
    /**
     * Gets the singleton instance of EventCache
     * @returns The EventCache instance
     */
    static getInstance(): EventCache;
    /**
     * Gets the number of currently cached events
     */
    get size(): number;
    /**
     * Gets a copy of the currently cached events along with their ids
     * @returns Array of cached BaseEvent objects
     */
    getEvents(): {
        id: number;
        event: BaseEvent;
    }[];
    /**
     * Appends new events to the cached events
     * LRU cache automatically handles dropping oldest events when limit is exceeded
     * @param events - The events to append
     */
    appendEvents(events: BaseEvent[]): void;
    /**
     * Removes cached events by their ids
     */
    removeEvents(ids: number[]): void;
}
//# sourceMappingURL=eventCache.d.ts.map