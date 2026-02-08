/**
 * A cap for the maxTimeMS used for FindCursor.countDocuments.
 *
 * The number is relatively smaller because we expect the count documents query
 * to be finished sooner if not by the time the batch of documents is retrieved
 * so that count documents query don't hold the final response back.
 */
export declare const QUERY_COUNT_MAX_TIME_MS_CAP: number;
/**
 * A cap for the maxTimeMS used for counting resulting documents of an
 * aggregation.
 */
export declare const AGG_COUNT_MAX_TIME_MS_CAP: number;
export declare const ONE_MB: number;
/**
 * A map of applied limit on cursors to a text that is supposed to be sent as
 * response to LLM
 */
export declare const CURSOR_LIMITS_TO_LLM_TEXT: {
    readonly "config.maxDocumentsPerQuery": "server's configured - maxDocumentsPerQuery";
    readonly "config.maxBytesPerQuery": "server's configured - maxBytesPerQuery";
    readonly "tool.responseBytesLimit": "tool's parameter - responseBytesLimit";
};
//# sourceMappingURL=constants.d.ts.map