import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import mkdirp from "mkdirp";
import rmfr from "rmfr";
import config from "../lib/config.js";
import logger from "../lib/logger.js";

export async function init(context) {
  const { program } = context;
  program
    .hook("preAction", loadConfigFromDataPath)
    .option("-d, --data-path [path]", "path to configuration and data files");
}

export async function setupDataPath({
  clean = false,
  name,
  website,
  botPath,
  baseUrl,
}) {
  const log = logger();
  const dataPath = path.resolve(config.get("dataPath"));

  const initialConfig = {
    apiBaseUrl: baseUrl,
    botName: name,
    botWebsite: website,
    botPath,
  };

  if (clean) {
    log.debug("Deleting data path");
    await rmfr(dataPath);
  }

  log.debug("Creating data path");
  await mkdirp(dataPath);

  log.debug("Generating initial config");
  await saveJSON("config", initialConfig);

  log.info({ msg: "Initialized data", dataPath });
}

function loadConfigFromDataPath(command) {
  const opts = command.opts();
  if (opts.dataPath) {
    config.set("dataPath", opts.dataPath);
  }

  const configPath = jsonPath("config");
  try {
    fs.accessSync(configPath, fs.constants.R_OK);
  } catch (e) {
    return;
  }

  config.loadFile(configPath);
  config.validate({ allowed: "strict" });
}

export function dataPath() {
  return path.resolve(config.get("dataPath"));
}

export function jsonPath(name) {
  return path.join(dataPath(), `${name}.json`);
}

export async function loadJSON(name, defVal = {}) {
  const log = logger();
  const filename = jsonPath(name);
  log.trace({ msg: "loadJSON", filename });
  try {
    const json = await fsPromises.readFile(filename, "utf-8");
    return JSON.parse(json);
  } catch (err) {
    if (defVal) {
      return defVal;
    } else {
      throw err;
    }
  }
}

export async function saveJSON(name, data) {
  const log = logger();
  const filename = jsonPath(name);
  log.trace({ msg: "saveJSON", filename, data });
  return fsPromises.writeFile(filename, JSON.stringify(data, null, "  "));
}

export async function updateJSON(name, updates) {
  const log = logger();
  log.trace({ msg: "updateJSON", name, updates });
  const data = await loadJSON(name);
  Object.assign(data, updates);
  await saveJSON(name, data);
  return data;
}

export async function updateConfig(updates) {
  return updateJSON("config", updates);
}
