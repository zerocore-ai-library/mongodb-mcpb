export async function operationWithFallback(performOperation, fallback) {
    try {
        return await performOperation();
    }
    catch {
        return fallback;
    }
}
//# sourceMappingURL=operationWithFallback.js.map