/**
 * This class holds the secrets of a single server. Ideally, we might want to have a keychain
 * per session, but right now the loggers are set up by server and are not aware of the concept
 * of session and this would require a bigger refactor.
 *
 * Whenever we identify or create a secret (for example, Atlas login, CLI arguments...) we
 * should register them in the root Keychain (`Keychain.root.register`) or preferably
 * on the session keychain if available `this.session.keychain`.
 **/
export class Keychain {
    constructor() {
        this.secrets = [];
    }
    static get root() {
        return Keychain.rootKeychain;
    }
    register(value, kind) {
        this.secrets.push({ value, kind });
    }
    clearAllSecrets() {
        this.secrets = [];
    }
    get allSecrets() {
        return [...this.secrets];
    }
}
Keychain.rootKeychain = new Keychain();
export function registerGlobalSecretToRedact(value, kind) {
    Keychain.root.register(value, kind);
}
//# sourceMappingURL=keychain.js.map