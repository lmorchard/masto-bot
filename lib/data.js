import path from "path";
import fs from "fs/promises";
import mkdirp from "mkdirp";
import rmfr from "rmfr";
import config from "../lib/config.js";
import logger from "../lib/logger.js";

export async function init(context) {}

export async function setupDataPath({ clean = false }) {
  const { log } = logger;
  const { DATA_PATH } = config;
  const dataPath = path.resolve(DATA_PATH);

  const initialConfig = {};

  if (clean) {
    await rmfr(dataPath);
  }
  await mkdirp(dataPath);
  await fs.writeFile(
    path.join(dataPath, "config.json"),
    JSON.stringify(initialConfig, null, "  ")
  );
}
