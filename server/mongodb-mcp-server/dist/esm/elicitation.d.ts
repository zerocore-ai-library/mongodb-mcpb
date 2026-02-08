import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export declare class Elicitation {
    private readonly server;
    constructor({ server }: {
        server: McpServer["server"];
    });
    /**
     * Checks if the client supports elicitation capabilities.
     * @returns True if the client supports elicitation, false otherwise.
     */
    supportsElicitation(): boolean;
    /**
     * Requests a boolean confirmation from the user.
     * @param message - The message to display to the user.
     * @returns True if the user confirms the action or the client does not support elicitation, false otherwise.
     */
    requestConfirmation(message: string): Promise<boolean>;
    /**
     * The schema for the confirmation question.
     * TODO: In the future would be good to use Zod 4's toJSONSchema() to generate the schema.
     */
    static CONFIRMATION_SCHEMA: {
        type: "object";
        properties: {
            confirmation: {
                type: "string";
                title: string;
                description: string;
                enum: string[];
                enumNames: string[];
            };
        };
        required: string[];
    };
}
//# sourceMappingURL=elicitation.d.ts.map