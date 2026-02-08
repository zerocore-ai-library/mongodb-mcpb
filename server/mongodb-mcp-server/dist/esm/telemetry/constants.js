import { packageInfo } from "../common/packageInfo.js";
/**
 * Machine-specific metadata formatted for telemetry
 */
export const MACHINE_METADATA = {
    mcp_server_version: packageInfo.version,
    mcp_server_name: packageInfo.mcpServerName,
    platform: process.platform,
    arch: process.arch,
    os_type: process.platform,
    os_version: process.version,
};
//# sourceMappingURL=constants.js.map