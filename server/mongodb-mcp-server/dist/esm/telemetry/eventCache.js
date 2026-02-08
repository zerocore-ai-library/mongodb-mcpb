import { LRUCache } from "lru-cache";
/**
 * Singleton class for in-memory telemetry event caching
 * Provides a central storage for telemetry events that couldn't be sent
 * Uses LRU cache to automatically drop oldest events when limit is exceeded
 */
export class EventCache {
    constructor() {
        this.nextId = 0;
        this.cache = new LRUCache({
            max: EventCache.MAX_EVENTS,
            // Using FIFO eviction strategy for events
            allowStale: false,
            updateAgeOnGet: false,
        });
    }
    /**
     * Gets the singleton instance of EventCache
     * @returns The EventCache instance
     */
    static getInstance() {
        if (!EventCache.instance) {
            EventCache.instance = new EventCache();
        }
        return EventCache.instance;
    }
    /**
     * Gets the number of currently cached events
     */
    get size() {
        return this.cache.size;
    }
    /**
     * Gets a copy of the currently cached events along with their ids
     * @returns Array of cached BaseEvent objects
     */
    getEvents() {
        return Array.from(this.cache.entries()).map(([id, event]) => ({ id, event }));
    }
    /**
     * Appends new events to the cached events
     * LRU cache automatically handles dropping oldest events when limit is exceeded
     * @param events - The events to append
     */
    appendEvents(events) {
        for (const event of events) {
            this.cache.set(this.nextId++, event);
        }
    }
    /**
     * Removes cached events by their ids
     */
    removeEvents(ids) {
        for (const id of ids) {
            this.cache.delete(id);
        }
    }
}
EventCache.MAX_EVENTS = 1000;
//# sourceMappingURL=eventCache.js.map