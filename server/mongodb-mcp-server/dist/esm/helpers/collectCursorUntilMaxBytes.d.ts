import type { AggregationCursor, FindCursor } from "mongodb";
export declare function getResponseBytesLimit(toolResponseBytesLimit: number | undefined | null, configuredMaxBytesPerQuery: unknown): {
    cappedBy: "config.maxBytesPerQuery" | "tool.responseBytesLimit" | undefined;
    limit: number;
};
/**
 * This function attempts to put a guard rail against accidental memory overflow
 * on the MCP server.
 *
 * The cursor is iterated until we can predict that fetching next doc won't
 * exceed the derived limit on number of bytes for the tool call. The derived
 * limit takes into account the limit provided from the Tool's interface and the
 * configured maxBytesPerQuery for the server.
 */
export declare function collectCursorUntilMaxBytesLimit<T = unknown>({ cursor, toolResponseBytesLimit, configuredMaxBytesPerQuery, abortSignal, }: {
    cursor: FindCursor<T> | AggregationCursor<T>;
    toolResponseBytesLimit: number | undefined | null;
    configuredMaxBytesPerQuery: unknown;
    abortSignal?: AbortSignal;
}): Promise<{
    cappedBy: "config.maxBytesPerQuery" | "tool.responseBytesLimit" | undefined;
    documents: T[];
}>;
//# sourceMappingURL=collectCursorUntilMaxBytes.d.ts.map