import { useSyncExternalStore } from "react";
function subscribeToPrefersColorScheme(callback) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
}
function getPrefersDarkMode() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
export function useDarkMode(override) {
    const prefersDarkMode = useSyncExternalStore(subscribeToPrefersColorScheme, getPrefersDarkMode);
    return override ?? prefersDarkMode;
}
//# sourceMappingURL=useDarkMode.js.map