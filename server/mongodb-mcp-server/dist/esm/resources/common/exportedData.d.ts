import type { Server } from "../../server.js";
import type { Session } from "../../common/session.js";
export declare class ExportedData {
    private readonly session;
    private readonly name;
    private readonly description;
    private readonly uri;
    private server?;
    constructor(session: Session);
    register(server: Server): void;
    private listResourcesCallback;
    private autoCompleteExportName;
    private readResourceCallback;
}
//# sourceMappingURL=exportedData.d.ts.map