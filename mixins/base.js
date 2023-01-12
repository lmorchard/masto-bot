export default class BasePlugin {
  static configSchema = {};

  /** @param {import("../index.js").default} parent */
  constructor(parent) {
    this.parent = parent;
    const { config, program } = parent;
    const { configSchema } = this.constructor;
    if (config) config.extendSchema(configSchema);
    program.hook("preAction", this.preAction.bind(this));
  }

  async preAction(command) {
  }
}