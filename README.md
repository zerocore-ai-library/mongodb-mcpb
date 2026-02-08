# MongoDB MCP Server

An MCP server for interacting with MongoDB databases and MongoDB Atlas, providing tools for querying, schema inspection, and data management.

## Tools

### `aggregate`

Run an aggregation pipeline against a MongoDB collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `pipeline` | array | Yes | Array of aggregation stages to execute |
| `responseBytesLimit` | number | No | Max bytes to return (default: 1048576) |

### `find`

Run a find query against a MongoDB collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `filter` | object | No | Query filter (MongoDB syntax) |
| `projection` | object | No | Fields to include/exclude |
| `limit` | number | No | Max documents to return (default: 10) |
| `sort` | object | No | Sort order (1 ascending, -1 descending) |
| `responseBytesLimit` | number | No | Max bytes to return (default: 1048576) |

### `count`

Get the number of documents in a collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `query` | object | No | Filter to count matching documents |

### `insert-many`

Insert an array of documents into a collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `documents` | array | Yes | Array of documents to insert |

### `update-many`

Update all documents matching a filter.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `filter` | object | Yes | Selection criteria for the update |
| `update` | object | Yes | Update operations to apply |
| `upsert` | boolean | No | Insert if no documents match |

### `delete-many`

Remove all documents matching a filter.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `filter` | object | No | Deletion criteria |

### `collection-schema`

Describe the inferred schema for a collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `sampleSize` | number | No | Documents to sample (default: 50) |
| `responseBytesLimit` | number | No | Max bytes to return (default: 1048576) |

### `collection-indexes`

List indexes for a collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |

### `create-index`

Create an index on a collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `name` | string | No | Index name |
| `definition` | array | Yes | Index definition with type and keys |

### `drop-index`

Drop an index from a collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `indexName` | string | Yes | Name of the index to drop |
| `type` | string | No | Index type (default: "classic") |

### `list-databases`

List all databases for the connection.

**Input:** None required.

**Output:**
| Field | Type | Description |
|-------|------|-------------|
| `databases` | array | List of databases with name and size |
| `totalCount` | number | Total number of databases |

### `list-collections`

List all collections in a database.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |

### `db-stats`

Get statistics for a database.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |

### `collection-storage-size`

Get the storage size of a collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |

### `create-collection`

Create a new collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |

### `drop-collection`

Remove a collection and its indexes.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |

### `rename-collection`

Rename a collection.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Current collection name |
| `newName` | string | Yes | New collection name |
| `dropTarget` | boolean | No | Drop target collection if exists (default: false) |

### `drop-database`

Remove a database and all its data.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |

### `connect`

Connect to a MongoDB instance.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `connectionString` | string | Yes | MongoDB connection string (mongodb:// or mongodb+srv://) |

### `explain`

Get execution statistics for a query plan.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `method` | array | Yes | Method to explain (aggregate, find, or count) |
| `verbosity` | string | No | Verbosity level (default: "queryPlanner") |

### `export`

Export query or aggregation results to EJSON.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | string | Yes | Database name |
| `collection` | string | Yes | Collection name |
| `exportTitle` | string | Yes | Short description to identify the export |
| `exportTarget` | array | Yes | Export target (find or aggregate with arguments) |
| `jsonExportFormat` | string | No | Format: "relaxed" or "canonical" (default: "relaxed") |

### `mongodb-logs`

Get recent mongod log events.

**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | No | Log type: "global" or "startupWarnings" (default: "global") |
| `limit` | integer | No | Max log entries (default: 50, max: 1024) |

## Setup

### Using tool CLI

Install the CLI from https://github.com/zerocore-ai/tool-cli

```bash
# Install from tool.store
tool install library/mongodb
```

```bash
# View available tools
tool info library/mongodb
```

```bash
# List databases
tool call library/mongodb -m list-databases
```

```bash
# Run a find query
tool call library/mongodb -m find -p database=test -p collection=users
```

### Configuration

Configure **one** of the following authentication methods:

| Field | Required | Description |
|-------|----------|-------------|
| `connection_string` | No* | MongoDB connection string (e.g., `mongodb+srv://...`) |
| `api_client_id` | No* | Atlas API service account client ID |
| `api_client_secret` | No* | Atlas API service account secret |

*One of connection_string OR api_client_id+api_client_secret is required.

### Prerequisites

- Node.js 20.19.0+, 22.12.0+, or 23+
- MongoDB connection string or Atlas API credentials

## License

Apache-2.0

## References

- https://github.com/mongodb-js/mongodb-mcp-server
