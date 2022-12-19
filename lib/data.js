import path from "path";
import mkdirp from "mkdirp";
import rmfr from "rmfr";
import config from "../lib/config.js";
import logger from "../lib/logger.js";

export async function init(context) {

}

export async function setupDataPath() {
  const { log } = logger;
  const { DATA_PATH } = config;

  const dataPath = path.resolve(DATA_PATH);  
  await mkdirp(dataPath);
}
