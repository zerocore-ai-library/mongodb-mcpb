/**
 * MongoDB MCPB entry point.
 *
 * This bundle vendors the built MongoDB MCP server (ESM) under
 * `server/mongodb-mcp-server/dist/esm/`.
 *
 * The upstream server parses configuration from CLI args (process.argv) and
 * environment variables with the `MDB_MCP_` prefix.
 */

for (const key of ['MDB_MCP_CONNECTION_STRING', 'MDB_MCP_API_CLIENT_ID', 'MDB_MCP_API_CLIENT_SECRET']) {
  if (process.env[key] === '') delete process.env[key];
}

await import('./mongodb-mcp-server/dist/esm/index.js');

