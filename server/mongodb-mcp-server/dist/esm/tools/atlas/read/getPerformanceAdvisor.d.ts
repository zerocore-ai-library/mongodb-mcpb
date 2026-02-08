import { z } from "zod";
import { AtlasToolBase } from "../atlasTool.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { OperationType, ToolArgs } from "../../tool.js";
import type { PerfAdvisorToolMetadata } from "../../../telemetry/types.js";
export declare class GetPerformanceAdvisorTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {
        projectId: z.ZodString;
        clusterName: z.ZodString;
        operations: z.ZodDefault<z.ZodArray<z.ZodEnum<["suggestedIndexes", "dropIndexSuggestions", "slowQueryLogs", "schemaSuggestions"]>, "many">>;
        since: z.ZodOptional<z.ZodString>;
        namespaces: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    };
    protected execute({ projectId, clusterName, operations, since, namespaces, }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    protected resolveTelemetryMetadata(args: ToolArgs<typeof this.argsShape>, { result }: {
        result: CallToolResult;
    }): PerfAdvisorToolMetadata;
}
//# sourceMappingURL=getPerformanceAdvisor.d.ts.map