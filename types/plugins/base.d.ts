export default class BasePlugin {
    static configSchema: {};
    /** @param {import("../index.js").default} parent */
    constructor(parent: import("../index.js").default);
    parent: import("../index.js").default;
    preAction(command: any): Promise<void>;
}
