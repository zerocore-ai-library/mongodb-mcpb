import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ErrorCodes, type MongoDBError } from "./errors.js";
import type { AnyConnectionState } from "./connectionManager.js";
import type { ToolBase } from "../tools/tool.js";
export type ConnectionErrorHandler = (error: MongoDBError<ErrorCodes.NotConnectedToMongoDB | ErrorCodes.MisconfiguredConnectionString>, additionalContext: ConnectionErrorHandlerContext) => ConnectionErrorUnhandled | ConnectionErrorHandled;
export type ConnectionErrorHandlerContext = {
    availableTools: ToolBase[];
    connectionState: AnyConnectionState;
};
export type ConnectionErrorUnhandled = {
    errorHandled: false;
};
export type ConnectionErrorHandled = {
    errorHandled: true;
    result: CallToolResult;
};
export declare const connectionErrorHandler: ConnectionErrorHandler;
//# sourceMappingURL=connectionErrorHandler.d.ts.map