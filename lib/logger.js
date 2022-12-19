import pino from "pino";
import config from "./config.js";

const logger = {};

export function init(context) {
  const { program } = context;

  program.option(
    "--no-pretty-logs",
    "disable pretty printing of logs in a TTY"
  );

  program.hook("preAction", setupLogger);
}

function setupLogger(thisCommand) {
  const { prettyLogs } = thisCommand.opts();

  let transport;
  if (process.stdout.isTTY && prettyLogs) {
    transport = {
      target: "pino-pretty",
      options: { colorize: true },
    };
  }
  
  logger.log = pino({
    level: config.get("logLevel"),
    transport,
  });
}

export default logger;
