import path from "path";
import mkdirp from "mkdirp";
import config from "../lib/config.js";
import logger from "../lib/logger.js";
import { setupDataPath } from "../lib/data.js";

export function init({ program }) {
  program
    .command("init")
    .description("initialize config and data")
    .option("-k, --clean", "delete any existing data")
    .option("-n, --name [name]", "client application name")
    .option("-w, --website [URL]", "client website URL")
    .option(
      "-b, --bot-path [path]",
      "path to the bot module file",
      "./bots/complimentron"
    )
    .option(
      "-u, --base-url [URL]",
      "server base URL",
      "https://mastodon.social"
    )
    // TODO: options for initial bot name & website?
    .action(run);
}

async function run(options) {
  await setupDataPath(options);
}
