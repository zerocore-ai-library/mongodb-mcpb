import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDarkMode, useRenderData } from "../../hooks/index.js";
import { Cell, HeaderCell, HeaderRow, Row, Table, TableBody, TableHead } from "@leafygreen-ui/table";
import { Body } from "@leafygreen-ui/typography";
import { AmountTextStyles, getContainerStyles } from "./ListDatabases.styles.js";
function formatBytes(bytes) {
    if (bytes === 0)
        return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
export const ListDatabases = ({ databases: propDatabases, darkMode: darkModeProp, }) => {
    const darkMode = useDarkMode(darkModeProp);
    const { data: hookData, isLoading, error } = useRenderData();
    const databases = propDatabases ?? hookData?.databases;
    if (!propDatabases) {
        if (isLoading) {
            return _jsx("div", { children: "Loading..." });
        }
        if (error) {
            return _jsxs("div", { children: ["Error: ", error] });
        }
    }
    if (!databases) {
        return null;
    }
    return (_jsxs("div", { className: getContainerStyles(darkMode), children: [_jsxs(Body, { className: AmountTextStyles, darkMode: darkMode, children: ["Your cluster has ", _jsxs("strong", { children: [databases.length, " databases"] }), ":"] }), _jsxs(Table, { darkMode: darkMode, children: [_jsx(TableHead, { children: _jsxs(HeaderRow, { children: [_jsx(HeaderCell, { children: "Database" }), _jsx(HeaderCell, { children: "Size" })] }) }), _jsx(TableBody, { children: databases.map((db) => (_jsxs(Row, { children: [_jsx(Cell, { children: db.name }), _jsx(Cell, { children: formatBytes(db.size) })] }, db.name))) })] })] }));
};
//# sourceMappingURL=ListDatabases.js.map