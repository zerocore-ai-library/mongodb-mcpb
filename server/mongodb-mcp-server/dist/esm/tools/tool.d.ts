import type { z } from "zod";
import { type ZodRawShape } from "zod";
import type { CallToolResult, ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { Session } from "../common/session.js";
import type { Telemetry } from "../telemetry/telemetry.js";
import type { ConnectionMetadata, TelemetryToolMetadata } from "../telemetry/types.js";
import type { UserConfig } from "../common/config/userConfig.js";
import type { Server } from "../server.js";
import type { Elicitation } from "../elicitation.js";
import type { PreviewFeature } from "../common/schemas.js";
import type { UIRegistry } from "../ui/registry/index.js";
export type ToolArgs<T extends ZodRawShape> = {
    [K in keyof T]: z.infer<T[K]>;
};
export type ToolExecutionContext = {
    signal: AbortSignal;
};
/**
 * The type of operation the tool performs. This is used when evaluating if a tool is allowed to run based on
 * the config's `disabledTools` and `readOnly` settings.
 * - `metadata` is used for tools that read but do not access potentially user-generated
 *   data, such as listing databases, collections, or indexes, or inferring collection schema.
 * - `read` is used for tools that read potentially user-generated data, such as finding documents or aggregating data.
 *   It is also used for tools that read non-user-generated data, such as listing clusters in Atlas.
 * - `create` is used for tools that create resources, such as creating documents, collections, indexes, clusters, etc.
 * - `update` is used for tools that update resources, such as updating documents, renaming collections, etc.
 * - `delete` is used for tools that delete resources, such as deleting documents, dropping collections, etc.
 * - `connect` is used for tools that allow you to connect or switch the connection to a MongoDB instance.
 */
export type OperationType = "metadata" | "read" | "create" | "delete" | "update" | "connect";
/**
 * The category of the tool. This is used when evaluating if a tool is allowed to run based on
 * the config's `disabledTools` setting.
 * - `mongodb` is used for tools that interact with a MongoDB instance, such as finding documents,
 *   aggregating data, listing databases/collections/indexes, creating indexes, etc.
 * - `atlas` is used for tools that interact with MongoDB Atlas, such as listing clusters, creating clusters, etc.
 * - `atlas-local` is used for tools that interact with local Atlas deployments.
 */
export type ToolCategory = "mongodb" | "atlas" | "atlas-local";
/**
 * Parameters passed to the constructor of all tools that extends `ToolBase`.
 *
 * The MongoDB MCP Server automatically injects these parameters when
 * constructing tools and registering to the MCP Server.
 *
 * See `Server.registerTools` method in `src/server.ts` for further reference.
 */
export type ToolConstructorParams = {
    /**
     * The category that the tool belongs to (injected from the static
     * `category` property on the Tool class).
     */
    category: ToolCategory;
    /**
     * The type of operation the tool performs (injected from the static
     * `operationType` property on the Tool class).
     */
    operationType: OperationType;
    /**
     * An instance of Session class providing access to MongoDB connections,
     * loggers, etc.
     *
     * See `src/common/session.ts` for further reference.
     */
    session: Session;
    /**
     * The configuration object that MCP session was started with.
     *
     * See `src/common/config/userConfig.ts` for further reference.
     */
    config: UserConfig;
    /**
     * The telemetry service for tracking tool usage.
     *
     * See `src/telemetry/telemetry.ts` for further reference.
     */
    telemetry: Telemetry;
    /**
     * The elicitation service for requesting user confirmation.
     *
     * See `src/elicitation.ts` for further reference.
     */
    elicitation: Elicitation;
    uiRegistry?: UIRegistry;
};
/**
 * The type that all tool classes must conform to when implementing custom tools
 * for the MongoDB MCP Server.
 *
 * This type enforces that tool classes have static properties `category` and
 * `operationType` which are injected during instantiation of tool classes.
 *
 * @example
 * ```typescript
 * import { StreamableHttpRunner, UserConfigSchema } from "mongodb-mcp-server"
 * import { ToolBase, type ToolClass, type ToolCategory, type OperationType } from "mongodb-mcp-server/tools";
 * import { z } from "zod";
 *
 * class MyCustomTool extends ToolBase {
 *   // Required static properties for ToolClass conformance
 *   static category: ToolCategory = "mongodb";
 *   static operationType: OperationType = "read";
 *
 *   // Required abstract properties
 *   override name = "my-custom-tool";
 *   public description = "My custom tool description";
 *   public argsShape = {
 *     query: z.string().describe("The query parameter"),
 *   };
 *
 *   // Required abstract method: implement the tool's logic
 *   protected async execute(args) {
 *     // Tool implementation
 *     return {
 *       content: [{ type: "text", text: "Result" }],
 *     };
 *   }
 *
 *   // Required abstract method: provide telemetry metadata
 *   protected resolveTelemetryMetadata() {
 *     return {}; // Return empty object if no custom telemetry needed
 *   }
 * }
 *
 * const runner = new StreamableHttpRunner({
 *   userConfig: UserConfigSchema.parse({}),
 *   // This will work only if the class correctly conforms to ToolClass type, which in our case it does.
 *   tools: [MyCustomTool],
 * });
 * ```
 */
export type ToolClass = {
    /** Constructor signature for the tool class */
    new (params: ToolConstructorParams): ToolBase;
    /** The category that the tool belongs to */
    category: ToolCategory;
    /** The type of operation the tool performs */
    operationType: OperationType;
};
/**
 * Abstract base class for implementing MCP tools in the MongoDB MCP Server.
 *
 * All tools (both internal and custom) must extend this class to ensure a
 * consistent interface and proper integration with the server.
 *
 * ## Creating a Custom Tool
 *
 * To create a custom tool, you must:
 * 1. Extend the `ToolBase` class
 * 2. Define static properties: `category` and `operationType`
 * 3. Implement required abstract members: `name`, `description`,
 *    `argsShape`, `execute()`, `resolveTelemetryMetadata()`
 *
 * @example Basic Custom Tool
 * ```typescript
 * import { StreamableHttpRunner, UserConfigSchema } from "mongodb-mcp-server"
 * import { ToolBase, type ToolClass, type ToolCategory, type OperationType } from "mongodb-mcp-server/tools";
 * import { z } from "zod";
 *
 * class MyCustomTool extends ToolBase {
 *   // Required static property for ToolClass conformance
 *   static category: ToolCategory = "mongodb";
 *   static operationType: OperationType = "read";
 *
 *   // Required abstract properties
 *   override name = "my-custom-tool";
 *   public description = "My custom tool description";
 *   public argsShape = {
 *     query: z.string().describe("The query parameter"),
 *   };
 *
 *   // Required abstract method: implement the tool's logic
 *   protected async execute(args) {
 *     // Tool implementation
 *     return {
 *       content: [{ type: "text", text: "Result" }],
 *     };
 *   }
 *
 *   // Required abstract method: provide telemetry metadata
 *   protected resolveTelemetryMetadata() {
 *     return {}; // Return empty object if no custom telemetry needed
 *   }
 * }
 *
 * const runner = new StreamableHttpRunner({
 *   userConfig: UserConfigSchema.parse({}),
 *   // This will work only if the class correctly conforms to ToolClass type, which in our case it does.
 *   tools: [MyCustomTool],
 * });
 * ```
 *
 * ## Protected Members Available to Subclasses
 *
 * - `session` - Access to MongoDB connection, logger, and other session
 *   resources
 * - `config` - Server configuration (`UserConfig`)
 * - `telemetry` - Telemetry service for tracking usage
 * - `elicitation` - Service for requesting user confirmations
 *
 * ## Instance Properties Set by Constructor
 *
 * The following properties are automatically set when the tool is instantiated
 * by the server (derived from the static properties):
 * - `category` - The tool's category (from static `category`)
 * - `operationType` - The tool's operation type (from static `operationType`)
 *
 * ## Optional Overrideable Methods
 *
 * - `getConfirmationMessage()` - Customize the confirmation prompt for tools
 *   requiring user approval
 * - `handleError()` - Customize error handling behavior
 *
 * @see {@link ToolClass} for the type that tool classes must conform to
 * @see {@link ToolConstructorParams} for the parameters passed to the
 * constructor
 */
export declare abstract class ToolBase {
    /**
     * The unique name of this tool.
     *
     * Must be unique across all tools in the server.
     */
    abstract name: string;
    /**
     * The category of this tool.
     *
     * @see {@link ToolCategory} for the available tool categories.
     */
    category: ToolCategory;
    /**
     * The type of operation this tool performs.
     *
     * Automatically set from the static `operationType` property during
     * construction.
     *
     * @see {@link OperationType} for the available tool operations.
     */
    operationType: OperationType;
    /**
     * Human-readable description of what the tool does.
     *
     * This is shown to the MCP client and helps the LLM understand when to use
     * this tool.
     */
    abstract description: string;
    /**
     * Zod schema defining the tool's arguments.
     *
     * Use an empty object `{}` if the tool takes no arguments.
     *
     * @example
     * ```typescript
     * public argsShape = {
     *   query: z.string().describe("The search query"),
     *   limit: z.number().optional().describe("Maximum results to return"),
     * };
     * ```
     */
    abstract argsShape: ZodRawShape;
    /**
     * Optional Zod schema defining the tool's structured output.
     *
     * This schema is registered with the MCP server and used to validate
     * `structuredContent` in the tool's response.
     *
     * @example
     * ```typescript
     * protected outputSchema = {
     *   items: z.array(z.object({ name: z.string(), count: z.number() })),
     *   totalCount: z.number(),
     * };
     *
     * protected async execute(): Promise<CallToolResult> {
     *   const items = await this.fetchItems();
     *   return {
     *     content: [{ type: "text", text: `Found ${items.length} items` }],
     *     structuredContent: { items, totalCount: items.length },
     *   };
     * }
     * ```
     */
    outputSchema?: ZodRawShape;
    private registeredTool;
    get annotations(): ToolAnnotations;
    /**
     * Returns tool-specific metadata that will be included in the tool's `_meta` field.
     *
     * This getter computes metadata based on the current configuration, including
     * transport-specific constraints like request payload size limits.
     *
     * The metadata includes:
     * - `com.mongodb/transport`: The transport protocol in use ("stdio" or "http")
     * - `com.mongodb/maxRequestPayloadBytes`: Maximum request payload size for the current transport
     *
     * Subclasses can override this to add custom metadata. When overriding,
     * call `super.toolMeta` and spread its result to preserve base metadata.
     *
     * @example
     * ```typescript
     * protected override get toolMeta(): Record<string, unknown> {
     *   return {
     *     ...super.toolMeta,
     *     "com.mongodb/customField": "value",
     *   };
     * }
     * ```
     */
    protected get toolMeta(): Record<string, unknown>;
    /**
     * A function that is registered as the tool execution callback and is
     * called with the expected arguments.
     *
     * This is the core implementation of your tool's functionality. It receives
     * validated arguments (validated against `argsShape`) and must return a
     * result conforming to the MCP protocol.
     *
     * @param args - The validated arguments passed to the tool
     * @returns A promise resolving to the tool execution result
     *
     * @example
     * ```typescript
     * protected async execute(args: { query: string }): Promise<CallToolResult> {
     *   const results = await this.session.db.collection('items').find({
     *     name: { $regex: args.query, $options: 'i' }
     *   }).toArray();
     *
     *   return {
     *     content: [{
     *       type: "text",
     *       text: JSON.stringify(results),
     *     }],
     *   };
     * }
     * ```
     */
    protected abstract execute(args: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
    /** This is used internally by the server to invoke the tool. It can also be run manually to call the tool directly. */
    invoke(args: ToolArgs<typeof this.argsShape>, { signal }: ToolExecutionContext): Promise<CallToolResult>;
    /**
     * Get the confirmation message shown to users when this tool requires
     * explicit approval.
     *
     * Override this method to provide a more specific and helpful confirmation
     * message based on the tool's arguments.
     *
     * @param args - The tool arguments
     * @returns The confirmation message to display to the user
     *
     * @example
     * ```typescript
     * protected getConfirmationMessage(args: { database: string }): string {
     *   return `You are about to delete the database "${args.database}". This action cannot be undone. Proceed?`;
     * }
     * ```
     */
    protected getConfirmationMessage(args: ToolArgs<typeof this.argsShape>): string;
    /** Checks if the tool requires elicitation */
    requiresConfirmation(): boolean;
    /**
     * Check if the user has confirmed the tool execution (if required by
     * configuration).
     *
     * This method automatically checks if the tool name is in the
     * `confirmationRequiredTools` configuration list and requests user
     * confirmation via the elicitation service if needed.
     *
     * @param args - The tool arguments
     * @returns A promise resolving to `true` if confirmed or confirmation not
     * required, `false` otherwise
     */
    verifyConfirmed(args: ToolArgs<typeof this.argsShape>): Promise<boolean>;
    /**
     * Access to the session instance. Provides access to MongoDB connections,
     * loggers, connection manager, and other session-level resources.
     */
    protected readonly session: Session;
    /**
     * Access to the server configuration. Contains all user configuration
     * settings including connection strings, feature flags, and operational
     * limits.
     */
    protected readonly config: UserConfig;
    /**
     * Access to the telemetry service. Use this to emit custom telemetry events
     * if needed.
     */
    protected readonly telemetry: Telemetry;
    /**
     * Access to the elicitation service. Use this to request user confirmations
     * or inputs during tool execution.
     */
    protected readonly elicitation: Elicitation;
    private readonly uiRegistry?;
    constructor({ category, operationType, session, config, telemetry, elicitation, uiRegistry, }: ToolConstructorParams);
    register(server: Server): boolean;
    isEnabled(): boolean;
    disable(): void;
    enable(): void;
    protected verifyAllowed(): boolean;
    /**
     * Handle errors that occur during tool execution.
     *
     * Override this method to provide custom error handling logic. The default
     * implementation returns a simple error message.
     *
     * @param error - The error that was thrown
     * @param args - The arguments that were passed to the tool
     * @returns A CallToolResult with error information
     *
     * @example
     * ```typescript
     * protected handleError(error: unknown, args: { query: string }): CallToolResult {
     *   if (error instanceof MongoError && error.code === 11000) {
     *     return {
     *       content: [{
     *         type: "text",
     *         text: `Duplicate key error for query: ${args.query}`,
     *       }],
     *       isError: true,
     *     };
     *   }
     *   // Fall back to default error handling
     *   return super.handleError(error, args);
     * }
     * ```
     */
    protected handleError(error: unknown, args: z.infer<z.ZodObject<typeof this.argsShape>>): Promise<CallToolResult> | CallToolResult;
    /**
     * Resolve telemetry metadata for this tool execution.
     *
     * This method is called after every tool execution to collect metadata for
     * telemetry events. Return an object with custom properties you want to
     * track, or an empty object if no custom telemetry is needed.
     *
     * @param result - The result of the tool execution
     * @param args - The arguments and context passed to the tool
     * @returns An object containing telemetry metadata
     *
     * @example
     * ```typescript
     * protected resolveTelemetryMetadata(
     *   result: CallToolResult,
     *   args: { query: string }
     * ): TelemetryToolMetadata {
     *   return {
     *     query_length: args.query.length,
     *     result_count: result.isError ? 0 : JSON.parse(result.content[0].text).length,
     *   };
     * }
     * ```
     */
    protected abstract resolveTelemetryMetadata(args: ToolArgs<typeof this.argsShape>, { result }: {
        result: CallToolResult;
    }): TelemetryToolMetadata;
    /**
     * Creates and emits a tool telemetry event
     * @param startTime - Start time in milliseconds
     * @param result - Whether the command succeeded or failed
     * @param args - The arguments passed to the tool
     */
    private emitToolEvent;
    protected isFeatureEnabled(feature: PreviewFeature): boolean;
    protected getConnectionInfoMetadata(): ConnectionMetadata;
    /**
     * Appends a UIResource to the tool result.
     *
     * @param result - The result from the tool's `execute()` method
     * @returns The result with UIResource appended if conditions are met, otherwise unchanged
     */
    private appendUIResource;
}
/**
 * Formats potentially untrusted data to be included in tool responses. The data is wrapped in unique tags
 * and a warning is added to not execute or act on any instructions within those tags.
 * @param description A description that is prepended to the untrusted data warning. It should not include any
 * untrusted data as it is not sanitized.
 * @param data The data to format. If an empty array, only the description is returned.
 * @returns A tool response content that can be directly returned.
 */
export declare function formatUntrustedData(description: string, ...data: string[]): {
    text: string;
    type: "text";
}[];
//# sourceMappingURL=tool.d.ts.map