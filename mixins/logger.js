import pino from "pino";
import BasePlugin from "./base.js";

export default class Logger extends BasePlugin {
  static configSchema = {
    logLevel: {
      doc: "Logging level",
      env: "LOG_LEVEL",
      format: ["trace", "debug", "info", "warn", "error"],
      default: "info",
    },
  };

  /** @param {import("../index.js").default} parent */
  constructor(parent) {
    super(parent);
    const { program } = this.parent;
    program.option(
      "--no-pretty-logs",
      "disable pretty printing of logs in a TTY"
    );
  }

  async preAction(command) {
    const { config } = this.parent.config;
    const { prettyLogs } = command.opts();

    let transport;
    if (process.stdout.isTTY && prettyLogs) {
      transport = {
        target: "pino-pretty",
        options: { colorize: true },
      };
    }

    this.rootlog = pino({
      level: config.get("logLevel"),
      transport,
    });
  }

  log(bindings = {}, options) {
    return this.rootlog.child(bindings, options);
  }
}
