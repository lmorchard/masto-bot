import path from "path";
import fs from "fs/promises";
import mkdirp from "mkdirp";
import rmfr from "rmfr";
import config from "../lib/config.js";
import logger from "../lib/logger.js";

export async function init(context) {}

export async function setupDataPath({ clean = false }) {
  const { log } = logger;
  const dataPath = path.resolve(config.get("dataPath"));

  const initialConfig = {};

  if (clean) {
    log.debug("Deleting data path");
    await rmfr(dataPath);
  }

  log.debug("Creating data path");
  await mkdirp(dataPath);

  log.debug("Generating initial config");
  await fs.writeFile(
    path.join(dataPath, "config.json"),
    JSON.stringify(initialConfig, null, "  ")
  );

  log.info({ msg: "Initialized data", dataPath });
}
