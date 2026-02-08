import { LogId } from "./logger.js";
class DefaultLibraryLoader {
    constructor() {
        this.isAtlasLocalSupported = true;
    }
    async loadAtlasLocalClient(logger) {
        // If we've tried and failed to load the Atlas Local client before, don't try again
        if (!this.isAtlasLocalSupported) {
            return undefined;
        }
        try {
            // Try to dynamically import the Atlas Local client library - this will fail
            // on unsupported platforms (e.g., Windows on ARM)
            const { Client: AtlasLocalClient } = await import("@mongodb-js/atlas-local");
            return AtlasLocalClient;
        }
        catch {
            this.isAtlasLocalSupported = false;
            logger.warning({
                id: LogId.atlasLocalUnsupportedPlatform,
                message: "Atlas Local is not supported on this platform. Atlas Local tools are disabled. All other tools continue to work normally.",
                context: "Atlas Local Initialization",
            });
            return undefined;
        }
    }
}
DefaultLibraryLoader.instance = new DefaultLibraryLoader();
export const defaultCreateAtlasLocalClient = async ({ logger, loader }) => {
    const libraryLoader = loader ?? DefaultLibraryLoader.instance;
    const client = await libraryLoader.loadAtlasLocalClient(logger);
    try {
        // Connect to Atlas Local client
        // This will fail if docker is not running
        return client?.connect();
    }
    catch {
        logger.warning({
            id: LogId.atlasLocalDockerNotRunning,
            message: "Cannot connect to Docker. Atlas Local tools are disabled. All other tools continue to work normally.",
            context: "Atlas Local Initialization",
        });
        return undefined;
    }
};
//# sourceMappingURL=atlasLocal.js.map