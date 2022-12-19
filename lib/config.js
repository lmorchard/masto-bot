import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import * as dotenv from "dotenv";
import Convict from "convict";
import logger from "../lib/logger.js";

// TODO: grab this from package.json
const VERSION = "1.0.0";

dotenv.config();

const config = Convict({
  apiBaseUrl: {
    doc: "Base URL for the Mastodon site",
    env: "API_BASE_URL",
    format: String,
    default: "https://mastodon.social",
  },
  logLevel: {
    doc: "Logging level",
    env: "LOG_LEVEL",
    format: ["trace", "debug", "info", "warn", "error"],
    default: "info",
  },
  dataPath: {
    doc: "Path where config and data can be found",
    env: "DATA_PATH",
    format: String,
    default: "./data",
  },
  botName: {
    doc: "Name used by the client to identify itself",
    env: "BOT_NAME",
    format: String,
    default: "MastoBot",
  },
  botWebsite: {
    doc: "Web site offering more details about the client",
    env: "BOT_WEBSITE",
    format: String,
    default: "http://github.com/lmorchard/masto-bot",
  },
  clientId: {
    doc: "OAuth client ID used by the client",
    env: "CLIENT_ID",
    format: String,
    default: null,
    nullable: true,
    sensitive: true,
  },
  clientSecret: {
    doc: "OAuth client secret used by the client",
    env: "CLIENT_SECRET",
    format: String,
    default: null,
    nullable: true,
    sensitive: true,
  },
  vapidKey: {
    doc: "VAPID key used by the client",
    env: "VAPID_KEY",
    format: String,
    default: null,
    nullable: true,
    sensitive: true,
  },
  accessToken: {
    doc: "OAuth access token used by the client",
    env: "ACCESS_TOKEN",
    format: String,
    default: null,
    nullable: true,
    sensitive: true,
  },
});
export default config;

export function init(context) {
  const { program } = context;
  // TODO: add command to set data config options?
  program
    .version(VERSION)
    .hook("preAction", setConfigFromCommandOptions)
    .option(
      "-d, --data-path",
      "path to configuration and data files",
      "./data"
    );
}

function setConfigFromCommandOptions(command) {
  const opts = command.opts();
  if (opts.dataPath) {
    config.set("dataPath", opts.dataPath);
  }

  try {
    fs.accessSync(dataConfigPath(), fs.constants.R_OK);
    config.loadFile(dataConfigPath());
  } catch (e) {
    // no-op
  }

  config.validate({ allowed: "strict" });
}

export function dataConfigPath() {
  const dataPath = config.get("dataPath");
  return path.join(path.resolve(dataPath), "config.json");
}

export async function loadDataConfig() {
  try {
    const json = await fsPromises.readFile(dataConfigPath(), "utf-8");
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
}

export async function saveDataConfig(data) {
  return fsPromises.writeFile(
    dataConfigPath(),
    JSON.stringify(data, null, "  ")
  );
}

export async function updateDataConfig(updates) {
  const { log } = logger;
  log.trace({ msg: "updateDataConfig", ...updates });
  const dataConfig = await loadDataConfig();
  Object.assign(dataConfig, updates);
  await saveDataConfig(dataConfig);
  return dataConfig;
}
