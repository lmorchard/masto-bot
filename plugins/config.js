import * as dotenv from "dotenv";
import Convict from "convict";
import BasePlugin from "./base.js";

export default class Config extends BasePlugin {
  /** @param {import("../index.js").default} parent */
  constructor(parent) {
    super(parent);
    const { program } = this.parent;

    program.option("-F, --config <name=value...>", "set configuration values");

    const configProgram = program
      .command("config")
      .description("configuration operations");

    configProgram
      .command("show")
      .description("show current configuration")
      .action(this.runConfigShow.bind(this));

    configProgram
      .command("set [name] [value]")
      .description("set config value in data path")
      .action(this.runConfigSet.bind(this));
  }

  extendSchema(schema = {}) {
    this.configSchema = {
      ...this.configSchema,
      ...schema,
    };
  }

  get(name) {
    return this.config.get(name);
  }

  async preAction(command) {
    const { configSchema } = this;

    dotenv.config();
    this.config = Convict(configSchema);

    const opts = command.opts();
    if (opts.config) {
      for (const pair of opts.config) {
        const [name, value] = pair.split("=");
        if (name in configSchema && typeof value !== "undefined") {
          this.config.set(name, value);
        }
      }
    }
  }

  async runConfigShow(options) {
    const { parent, configSchema, config } = this;
    const { logger } = parent;
    const log = logger.log();

    const schema = configSchema;
    const props = config.getProperties();

    for (const [name, defn] of Object.entries(schema)) {
      const { doc, env, default: defaultValue } = defn;
      const currentValue = props[name];
      log.info({ configName: name, env, doc, defaultValue, currentValue });
    }
  }

  async runConfigSet(configName, configValue, options) {
    const { data, logger } = this.parent;
    const log = logger.log();

    const schema = this.configSchema;
    if (!schema[configName]) {
      log.error({ msg: "Unknown config name", configName });
    }

    await this.updateConfig({ [configName]: configValue });

    log.info({ msg: "set config value", configName, configValue });
  }

  async updateConfig(configData = {}) {
    const { data } = this.parent;
    return data.updateJSON("config", configData);
  }
}
