export function setManagedTimeout(callback, timeoutMS) {
    let timeoutId = setTimeout(() => {
        void callback();
    }, timeoutMS);
    function cancel() {
        clearTimeout(timeoutId);
        timeoutId = undefined;
    }
    function restart() {
        cancel();
        timeoutId = setTimeout(() => {
            void callback();
        }, timeoutMS);
    }
    return {
        cancel,
        restart,
    };
}
//# sourceMappingURL=managedTimeout.js.map