export interface ManagedTimeout {
    cancel: () => void;
    restart: () => void;
}
export declare function setManagedTimeout(callback: () => Promise<void> | void, timeoutMS: number): ManagedTimeout;
//# sourceMappingURL=managedTimeout.d.ts.map