/** Return type for the useRenderData hook */
interface UseRenderDataResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}
/**
 * Hook for receiving render data from parent window via postMessage
 * This is used by iframe-based UI components that receive data from an MCP client
 *
 * @template T - The type of data expected in the renderData payload
 * @returns An object containing:
 *   - data: The received render data (or null if not yet received)
 *   - isLoading: Whether data is still being loaded
 *   - error: Error message if message validation failed
 *
 * @example
 * ```tsx
 * interface MyData {
 *   items: string[];
 * }
 *
 * function MyComponent() {
 *   const { data, isLoading, error } = useRenderData<MyData>();
 * }
 * ```
 */
export declare function useRenderData<T = unknown>(): UseRenderDataResult<T>;
export {};
//# sourceMappingURL=useRenderData.d.ts.map