import path from "path";
import mkdirp from "mkdirp";
import config from "../lib/config.js";
import logger from "../lib/logger.js";
import { setupDataPath } from "../lib/data.js";

export function init({ program }) {
  program
    .command("init")
    .description("initialize resources for the bot (run me first!)")
    .action(run);
}

async function run() {
  await setupDataPath();
}
