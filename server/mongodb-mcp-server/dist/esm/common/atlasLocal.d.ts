import type { Client } from "@mongodb-js/atlas-local";
import { type LoggerBase } from "./logger.js";
export type AtlasLocalClientFactoryFn = ({ logger, loader, }: {
    logger: LoggerBase;
    loader?: LibraryLoader;
}) => Promise<Client | undefined>;
export interface LibraryLoader {
    loadAtlasLocalClient: (logger: LoggerBase) => Promise<typeof Client | undefined>;
}
export declare const defaultCreateAtlasLocalClient: AtlasLocalClientFactoryFn;
//# sourceMappingURL=atlasLocal.d.ts.map