import pino from "pino";

export default (Base) =>
  class extends Base {
    constructor(options) {
      super(options);
      this.program.option(
        "--no-pretty-logs",
        "disable pretty printing of logs in a TTY"
      );
    }

    configSchema() {
      return {
        ...super.configSchema(),
        logLevel: {
          doc: "Logging level",
          env: "LOG_LEVEL",
          format: ["trace", "debug", "info", "warn", "error"],
          default: "info",
        },
      };
    }

    async preAction(command) {
      await super.preAction(command);

      const { config } = this;
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
  };
