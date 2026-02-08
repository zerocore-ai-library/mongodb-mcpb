import { useCallback } from "react";
import { postUIActionResult, uiActionResultIntent, uiActionResultNotification, uiActionResultPrompt, uiActionResultToolCall, uiActionResultLink, } from "@mcp-ui/server";
/**
 * Hook for sending UI actions to the parent window via postMessage
 * This is used by iframe-based UI components to communicate back to an MCP client
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { intent, tool, link } = useHostCommunication();
 *
 *   return <button onClick={() => intent("create-task", { title: "Buy groceries" })}>Create Task</button>;
 * }
 * ```
 */
export function useHostCommunication() {
    const intent = useCallback((...args) => {
        const result = uiActionResultIntent(...args);
        postUIActionResult(result);
        return result;
    }, []);
    const notify = useCallback((...args) => {
        const result = uiActionResultNotification(...args);
        postUIActionResult(result);
        return result;
    }, []);
    const prompt = useCallback((...args) => {
        const result = uiActionResultPrompt(...args);
        postUIActionResult(result);
        return result;
    }, []);
    const tool = useCallback((...args) => {
        const result = uiActionResultToolCall(...args);
        postUIActionResult(result);
        return result;
    }, []);
    const link = useCallback((...args) => {
        const result = uiActionResultLink(...args);
        postUIActionResult(result);
        return result;
    }, []);
    return {
        intent,
        notify,
        prompt,
        tool,
        link,
    };
}
//# sourceMappingURL=useHostCommunication.js.map