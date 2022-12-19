import * as dotenv from "dotenv";

const config = {};

const CONFIG_OPTIONS = [
  [
    "-d, --data-path <path>",
    "path where data is kept",
    "dataPath",
    "DATA_PATH",
  ],
  [
    "-b, --base-url <url>",
    "base URL for Mastodon API",
    "baseUrl",
    "API_BASE_URL",
  ],
  [
    "--bot-name <name>",
    "name used to identify the bot",
    "botName",
    "BOT_NAME",
  ],
  [
    "--bot-website <URL>",
    "website with more information about the bot",
    "botWebsite",
    "BOT_WEBSITE",
  ],
];

export function init(context) {
  const { program } = context;
  dotenv.config();

  const {
    HOST = "0.0.0.0",
    PORT = 3001,
    API_BASE_URL = "https://mastodon.social",
    LOG_LEVEL = "debug",
    DATA_PATH = "./data",
    BOT_NAME = "Mastobot",
    BOT_WEBSITE = "https://example.com",
    CLIENT_ID,
    CLIENT_SECRET,
    VAPID_KEY,
    ACCESS_TOKEN,
  } = process.env;

  Object.assign(config, {
    VERSION: "1.0.0",
    HOST,
    PORT,
    API_BASE_URL,
    LOG_LEVEL,
    DATA_PATH,
    BOT_NAME,
    BOT_WEBSITE,
    CLIENT_ID,
    CLIENT_SECRET,
    VAPID_KEY,
    ACCESS_TOKEN,
  });

  program
    .version(config.VERSION)
    .hook("preAction", setConfigFromCommandOptions);

  for (const [
    optionSpec,
    optionDescription,
  ] of CONFIG_OPTIONS) {
    program.option(optionSpec, optionDescription);
  }

  context.config = config;
}

function setConfigFromCommandOptions(thisCommand, actionCommand) {
  const opts = thisCommand.opts();
  for (const [
    _optionSpec,
    _optionDescription,
    optionName,
    configName,
  ] of CONFIG_OPTIONS) {
    const value = opts[optionName];
    if (typeof value === "undefined") continue;
    config[configName] = value;
  }
}

export default config;
