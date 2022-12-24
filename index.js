import fs from "fs/promises";

import { Command } from "commander";

import ConfigMixin from "./mixins/config.js";
import LoggerMixin from "./mixins/logger.js";
import DataMixin from "./mixins/data.js";
import ClientMixin from "./mixins/client.js";
import BotMixin from "./mixins/bot.js";

import CommandInitMixin from "./commands/init.js";
import CommandAuthMixin from "./commands/auth.js";
import CommandNotificationsMixin from "./commands/notifications.js";
import CommandStreamingMixin from "./commands/streaming.js";

class MastotronBase {
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

  async parseAsync(argv) {
    return this.program.parseAsync(argv);
  }

  async run() {
    await this.init();
    await this.parseAsync(process.argv);
  }
}

export const Mastotron = [
  ConfigMixin,
  LoggerMixin,
  DataMixin,
  ClientMixin,
  BotMixin,
  CommandInitMixin,
  CommandAuthMixin,
  CommandNotificationsMixin,
  CommandStreamingMixin,
].reduce((base, mixin) => mixin(base), MastotronBase);

export default Mastotron;
