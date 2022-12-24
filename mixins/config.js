import * as dotenv from "dotenv";
import Convict from "convict";

export default (Base) =>
  class extends Base {
    constructor(options) {
      super(options);
      const { program } = this;

      program.option(
        "-F, --config <name=value...>",
        "set configuration values"
      );

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

    async preAction(command) {
      await super.preAction(command);
      const schema = this.configSchema();

      dotenv.config();
      this.config = Convict(schema);

      const opts = command.opts();
      if (opts.config) {
        for (const pair of opts.config) {
          const [name, value] = pair.split("=");
          if (name in schema && typeof value !== "undefined") {
            this.config.set(name, value);
          }
        }
      }
    }

    configSchema() {
      return {};
    }

    async runConfigShow(options) {
      const { config, client } = this;
      const log = this.log();

      const schema = this.configSchema();
      const props = config.getProperties();

      for (const [name, defn] of Object.entries(schema)) {
        const { doc, env, default: defaultValue } = defn;
        const currentValue = props[name];
        log.info({ configName: name, env, doc, defaultValue, currentValue });
      }
    }

    async runConfigSet(configName, configValue, options) {
      const { config, client } = this;
      const log = this.log();

      const schema = this.configSchema();
      if (!schema[configName]) {
        log.error({ msg: "Unknown config name", configName });
      }

      await this.updateConfig({ [configName]: configValue });
      log.info({ msg: "set config value", configName, configValue });
    }
  };
