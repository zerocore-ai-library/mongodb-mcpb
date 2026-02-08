import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { MongoDBToolBase } from "../mongodbTool.js";
import type { OperationType } from "../../tool.js";
import { z } from "zod";
export declare const ListDatabasesOutputSchema: {
    databases: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        size: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        size: number;
    }, {
        name: string;
        size: number;
    }>, "many">;
    totalCount: z.ZodNumber;
};
/** @public - Used by UI components */
export type ListDatabasesOutput = z.infer<z.ZodObject<typeof ListDatabasesOutputSchema>>;
export declare class ListDatabasesTool extends MongoDBToolBase {
    name: string;
    description: string;
    argsShape: {};
    outputSchema: {
        databases: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            size: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            size: number;
        }, {
            name: string;
            size: number;
        }>, "many">;
        totalCount: z.ZodNumber;
    };
    static operationType: OperationType;
    protected execute(): Promise<CallToolResult>;
}
//# sourceMappingURL=listDatabases.d.ts.map