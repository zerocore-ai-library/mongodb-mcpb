import { type ReactElement } from "react";
import type { ListDatabasesOutput } from "../../../tools/mongodb/metadata/listDatabases.js";
export type Database = ListDatabasesOutput["databases"][number];
interface ListDatabasesProps {
    databases?: Database[];
    darkMode?: boolean;
}
export declare const ListDatabases: ({ databases: propDatabases, darkMode: darkModeProp, }: ListDatabasesProps) => ReactElement | null;
export {};
//# sourceMappingURL=ListDatabases.d.ts.map