export type UIRegistryOptions = {
    /**
     * Custom UIs for tools. Function that returns HTML strings for tool names.
     * Use this to add UIs to tools or replace the default bundled UIs.
     * The function is called lazily when a UI is requested, allowing you to
     * defer loading large HTML files until needed.
     *
     * ```ts
     * import { readFileSync } from 'fs';
     * const server = new Server({
     *     // ... other options
     *     customUIs: (toolName) => {
     *         if (toolName === 'list-databases') {
     *             return readFileSync('./my-custom-ui.html', 'utf-8');
     *         }
     *         return null;
     *     }
     * });
     * ```
     */
    customUIs?: (toolName: string) => string | null | Promise<string | null>;
};
/**
 * UI Registry that manages bundled UI HTML strings for tools.
 */
export declare class UIRegistry {
    private customUIs?;
    private cache;
    constructor(options?: {
        customUIs?: (toolName: string) => string | null | Promise<string | null>;
    });
    /**
     * Gets the UI HTML string for a tool, or null if none exists.
     */
    get(toolName: string): Promise<string | null>;
}
//# sourceMappingURL=registry.d.ts.map