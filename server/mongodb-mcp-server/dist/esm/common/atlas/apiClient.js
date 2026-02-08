import createClient from "openapi-fetch";
import { ApiClientError } from "./apiClientError.js";
import { packageInfo } from "../packageInfo.js";
import { createFetch } from "@mongodb-js/devtools-proxy-support";
import { Request as NodeFetchRequest } from "node-fetch";
import { AuthProviderFactory } from "./auth/authProvider.js";
const ATLAS_API_VERSION = "2025-03-12";
export const createAtlasApiClient = (options, logger) => {
    return new ApiClient(options, logger);
};
export class ApiClient {
    isAuthConfigured() {
        return !!this.authProvider;
    }
    constructor(options, logger, authProvider) {
        this.logger = logger;
        this.authProvider = authProvider;
        // createFetch assumes that the first parameter of fetch is always a string
        // with the URL. However, fetch can also receive a Request object. While
        // the typechecking complains, createFetch does passthrough the parameters
        // so it works fine. That said, node-fetch has incompatibilities with the web version
        // of fetch and can lead to genuine issues so we would like to move away of node-fetch dependency.
        this.customFetch = createFetch({
            useEnvironmentVariableProxies: true,
        });
        this.options = {
            ...options,
            userAgent: options.userAgent ??
                `AtlasMCP/${packageInfo.version} (${process.platform}; ${process.arch}; ${process.env.HOSTNAME || "unknown"})`,
        };
        this.authProvider =
            authProvider ??
                AuthProviderFactory.create({
                    apiBaseUrl: this.options.baseUrl,
                    userAgent: this.options.userAgent,
                    credentials: options.credentials ?? {},
                }, logger);
        this.client = createClient({
            baseUrl: this.options.baseUrl,
            headers: {
                "User-Agent": this.options.userAgent,
                Accept: `application/vnd.atlas.${ATLAS_API_VERSION}+json`,
            },
            fetch: this.customFetch,
            // NodeFetchRequest has more overloadings than the native Request
            // so it complains here. However, the interfaces are actually compatible
            // so it's not a real problem, just a type checking problem.
            Request: NodeFetchRequest,
        });
        if (this.authProvider) {
            this.client.use(this.createAuthMiddleware());
        }
    }
    createAuthMiddleware() {
        return {
            onRequest: async ({ request, schemaPath }) => {
                if (schemaPath.startsWith("/api/private/unauth") || schemaPath.startsWith("/api/oauth")) {
                    return undefined;
                }
                try {
                    const authHeaders = (await this.authProvider?.getAuthHeaders()) ?? {};
                    for (const [key, value] of Object.entries(authHeaders)) {
                        request.headers.set(key, value);
                    }
                    return request;
                }
                catch {
                    // ignore not available tokens, API will return 401
                    return undefined;
                }
            },
        };
    }
    async validateAuthConfig() {
        await this.authProvider?.validate();
    }
    async close() {
        await this.authProvider?.revoke();
    }
    async getIpInfo() {
        const authHeaders = (await this.authProvider?.getAuthHeaders()) ?? {};
        const endpoint = "api/private/ipinfo";
        const url = new URL(endpoint, this.options.baseUrl);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                ...authHeaders,
                Accept: "application/json",
                "User-Agent": this.options.userAgent,
            },
        });
        if (!response.ok) {
            throw await ApiClientError.fromResponse(response);
        }
        return (await response.json());
    }
    async sendEvents(events) {
        if (!this.authProvider) {
            await this.sendUnauthEvents(events);
            return;
        }
        try {
            await this.sendAuthEvents(events);
        }
        catch (error) {
            if (error instanceof ApiClientError) {
                if (error.response.status !== 401) {
                    throw error;
                }
            }
            // send unauth events if any of the following are true:
            // 1: the token is not valid (not ApiClientError)
            // 2: if the api responded with 401 (ApiClientError with status 401)
            await this.sendUnauthEvents(events);
        }
    }
    async sendAuthEvents(events) {
        const authHeaders = await this.authProvider?.getAuthHeaders();
        if (!authHeaders) {
            throw new Error("No access token available");
        }
        const authUrl = new URL("api/private/v1.0/telemetry/events", this.options.baseUrl);
        const response = await fetch(authUrl, {
            method: "POST",
            headers: {
                ...authHeaders,
                Accept: "application/json",
                "Content-Type": "application/json",
                "User-Agent": this.options.userAgent,
            },
            body: JSON.stringify(events),
        });
        if (!response.ok) {
            throw await ApiClientError.fromResponse(response);
        }
    }
    async sendUnauthEvents(events) {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": this.options.userAgent,
        };
        const unauthUrl = new URL("api/private/unauth/telemetry/events", this.options.baseUrl);
        const response = await fetch(unauthUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(events),
        });
        if (!response.ok) {
            throw await ApiClientError.fromResponse(response);
        }
    }
    // DO NOT EDIT. This is auto-generated code.
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listClusterDetails(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/clusters", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listGroups(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async createGroup(options) {
        const { data, error, response } = await this.client.POST("/api/atlas/v2/groups", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async deleteGroup(options) {
        const { error, response } = await this.client.DELETE("/api/atlas/v2/groups/{groupId}", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getGroup(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listAccessListEntries(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/accessList", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async createAccessListEntry(options) {
        const { data, error, response } = await this.client.POST("/api/atlas/v2/groups/{groupId}/accessList", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async deleteAccessListEntry(options) {
        const { error, response } = await this.client.DELETE("/api/atlas/v2/groups/{groupId}/accessList/{entryValue}", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listAlerts(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/alerts", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listClusters(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/clusters", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async createCluster(options) {
        const { data, error, response } = await this.client.POST("/api/atlas/v2/groups/{groupId}/clusters", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async deleteCluster(options) {
        const { error, response } = await this.client.DELETE("/api/atlas/v2/groups/{groupId}/clusters/{clusterName}", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getCluster(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/clusters/{clusterName}", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listDropIndexSuggestions(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/performanceAdvisor/dropIndexSuggestions", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listSchemaAdvice(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/performanceAdvisor/schemaAdvice", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listClusterSuggestedIndexes(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/performanceAdvisor/suggestedIndexes", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listDatabaseUsers(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/databaseUsers", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async createDatabaseUser(options) {
        const { data, error, response } = await this.client.POST("/api/atlas/v2/groups/{groupId}/databaseUsers", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async deleteDatabaseUser(options) {
        const { error, response } = await this.client.DELETE("/api/atlas/v2/groups/{groupId}/databaseUsers/{databaseName}/{username}", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listFlexClusters(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/flexClusters", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async createFlexCluster(options) {
        const { data, error, response } = await this.client.POST("/api/atlas/v2/groups/{groupId}/flexClusters", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async deleteFlexCluster(options) {
        const { error, response } = await this.client.DELETE("/api/atlas/v2/groups/{groupId}/flexClusters/{name}", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getFlexCluster(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/flexClusters/{name}", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listSlowQueryLogs(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/groups/{groupId}/processes/{processId}/performanceAdvisor/slowQueryLogs", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async listOrgs(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/orgs", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async getOrgGroups(options) {
        const { data, error, response } = await this.client.GET("/api/atlas/v2/orgs/{orgId}/groups", options);
        if (error) {
            throw ApiClientError.fromError(response, error);
        }
        return data;
    }
}
//# sourceMappingURL=apiClient.js.map