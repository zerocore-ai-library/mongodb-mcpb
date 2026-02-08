import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
export declare class InMemoryTransport implements Transport {
    private outputController;
    private startPromise;
    output: ReadableStream<JSONRPCMessage>;
    input: WritableStream<JSONRPCMessage>;
    constructor();
    start(): Promise<void>;
    send(message: JSONRPCMessage): Promise<void>;
    close(): Promise<void>;
    onclose?: (() => void) | undefined;
    onerror?: ((error: Error) => void) | undefined;
    onmessage?: ((message: JSONRPCMessage) => void) | undefined;
    sessionId?: string | undefined;
    private static getPromise;
}
//# sourceMappingURL=inMemoryTransport.d.ts.map