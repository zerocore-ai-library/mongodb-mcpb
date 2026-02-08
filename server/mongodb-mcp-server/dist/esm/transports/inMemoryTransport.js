export class InMemoryTransport {
    constructor() {
        const [inputReady, inputResolve] = InMemoryTransport.getPromise();
        const [outputReady, outputResolve] = InMemoryTransport.getPromise();
        this.output = new ReadableStream({
            start: (controller) => {
                this.outputController = controller;
                outputResolve();
            },
        });
        this.input = new WritableStream({
            write: (message) => this.onmessage?.(message),
            start: () => {
                inputResolve();
            },
        });
        this.startPromise = Promise.all([inputReady, outputReady]);
    }
    async start() {
        await this.startPromise;
    }
    send(message) {
        this.outputController?.enqueue(message);
        return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async close() {
        this.outputController?.close();
        this.onclose?.();
    }
    static getPromise() {
        let resolve = () => { };
        const promise = new Promise((res) => {
            resolve = res;
        });
        return [promise, resolve];
    }
}
//# sourceMappingURL=inMemoryTransport.js.map