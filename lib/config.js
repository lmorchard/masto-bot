import * as dotenv from "dotenv";
import Convict from "convict";

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
    nullable: true,
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
  program.version(VERSION);
}
