import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { AtlasToolBase } from "../atlasTool.js";
import type { OperationType } from "../../tool.js";
export declare class ListOrganizationsTool extends AtlasToolBase {
    name: string;
    description: string;
    static operationType: OperationType;
    argsShape: {};
    protected execute(): Promise<CallToolResult>;
}
//# sourceMappingURL=listOrgs.d.ts.map