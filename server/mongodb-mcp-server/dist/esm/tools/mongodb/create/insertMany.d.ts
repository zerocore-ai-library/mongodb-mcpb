import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import { type ToolArgs, type OperationType } from "../../tool.js";
import type { ConnectionMetadata, AutoEmbeddingsUsageMetadata } from "../../../telemetry/types.js";
export declare class InsertManyTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {
        readonly documents: z.ZodArray<z.AnyZodObject, "many">;
        readonly database: z.ZodString;
        readonly collection: z.ZodString;
    } | {
        embeddingParameters: z.ZodOptional<z.ZodObject<{
            outputDimension: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"256">, z.ZodLiteral<"512">, z.ZodLiteral<"1024">, z.ZodLiteral<"2048">, z.ZodLiteral<"4096">]>>, number, "256" | "512" | "1024" | "2048" | "4096" | undefined>>;
            outputDtype: z.ZodDefault<z.ZodOptional<z.ZodEnum<["float", "int8", "uint8", "binary", "ubinary"]>>>;
        } & {
            model: z.ZodDefault<z.ZodEnum<["voyage-3-large", "voyage-3.5", "voyage-3.5-lite", "voyage-code-3"]>>;
        } & {
            input: z.ZodArray<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>, "many">;
        }, "strip", z.ZodTypeAny, {
            input: z.objectOutputType<{}, z.ZodTypeAny, "passthrough">[];
            outputDtype: "binary" | "float" | "int8" | "uint8" | "ubinary";
            model: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3";
            outputDimension?: number | undefined;
        }, {
            input: z.objectInputType<{}, z.ZodTypeAny, "passthrough">[];
            outputDimension?: "256" | "512" | "1024" | "2048" | "4096" | undefined;
            outputDtype?: "binary" | "float" | "int8" | "uint8" | "ubinary" | undefined;
            model?: "voyage-3-large" | "voyage-3.5" | "voyage-3.5-lite" | "voyage-code-3" | undefined;
        }>>;
        documents: z.ZodArray<z.AnyZodObject, "many">;
        database: z.ZodString;
        collection: z.ZodString;
    };
    static operationType: OperationType;
    protected execute({ database, collection, documents, ...conditionalArgs }: ToolArgs<typeof this.argsShape>): Promise<CallToolResult>;
    private replaceRawValuesWithEmbeddingsIfNecessary;
    protected resolveTelemetryMetadata(args: ToolArgs<typeof this.argsShape>, { result }: {
        result: CallToolResult;
    }): ConnectionMetadata | AutoEmbeddingsUsageMetadata;
}
//# sourceMappingURL=insertMany.d.ts.map