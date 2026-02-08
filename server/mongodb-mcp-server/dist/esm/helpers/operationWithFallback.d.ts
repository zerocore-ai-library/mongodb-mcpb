type OperationCallback<OperationResult> = () => Promise<OperationResult>;
export declare function operationWithFallback<OperationResult, FallbackValue>(performOperation: OperationCallback<OperationResult>, fallback: FallbackValue): Promise<OperationResult | FallbackValue>;
export {};
//# sourceMappingURL=operationWithFallback.d.ts.map