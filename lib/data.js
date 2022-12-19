import path from "path";
import fs from "fs/promises";
import mkdirp from "mkdirp";
import rmfr from "rmfr";
import config, { saveDataConfig } from "../lib/config.js";
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
  await saveDataConfig(initialConfig);

  log.info({ msg: "Initialized data", dataPath });
}
