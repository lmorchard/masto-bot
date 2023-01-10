import fs from "fs/promises";

import { Command } from "commander";

import ConfigMixin from "./mixins/config.js";
import LoggerMixin from "./mixins/logger.js";
import DataMixin from "./mixins/data.js";
import ClientMixin from "./mixins/client.js";
import BotMixin from "./mixins/bot.js";

import CommandsMixin from "./commands/index.js";

export class MastotronBase {
  constructor(options) {
    this.options = options;
    this.program = new Command();
  }

  async init() {
    const packageJson = JSON.parse(
      await fs.readFile(new URL("./package.json", import.meta.url))
    );
    this.program
      .version(packageJson.version)
      .hook("preAction", (...args) => this.preAction(...args));
  }

  async preAction(thisCommand) {}

  async parseCommand(argv) {
    return this.program.parseAsync(argv);
  }

  async run() {
    await this.init();
    await this.parseCommand(process.argv);
  }
}

export const Mastotron = CommandsMixin(
  BotMixin(ClientMixin(DataMixin(LoggerMixin(ConfigMixin(MastotronBase)))))
);

export default Mastotron;
