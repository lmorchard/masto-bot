import pino from "pino";

const logger = {};

export function init(context) {  
  const { LOG_LEVEL } = context.config;
  logger.log = pino({
    level: LOG_LEVEL,
    // TODO: make pino-pretty transport optional
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  });
  context.log = logger.log;
}

export default logger;