import type { Secret } from "mongodb-redact";
export type { Secret } from "mongodb-redact";
/**
 * This class holds the secrets of a single server. Ideally, we might want to have a keychain
 * per session, but right now the loggers are set up by server and are not aware of the concept
 * of session and this would require a bigger refactor.
 *
 * Whenever we identify or create a secret (for example, Atlas login, CLI arguments...) we
 * should register them in the root Keychain (`Keychain.root.register`) or preferably
 * on the session keychain if available `this.session.keychain`.
 **/
export declare class Keychain {
    private secrets;
    private static rootKeychain;
    constructor();
    static get root(): Keychain;
    register(value: Secret["value"], kind: Secret["kind"]): void;
    clearAllSecrets(): void;
    get allSecrets(): Secret[];
}
export declare function registerGlobalSecretToRedact(value: Secret["value"], kind: Secret["kind"]): void;
//# sourceMappingURL=keychain.d.ts.map