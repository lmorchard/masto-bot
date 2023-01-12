import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import BasePlugin from "./base.js";

export default class Data extends BasePlugin {
  static configSchema = {
    dataPath: {
      doc: "Path where config and data can be found",
      env: "DATA_PATH",
      format: String,
      default: "./data",
      nullable: true,
    },
  };

  /** @param {import("../index.js").default} parent */
  constructor(parent) {
    super(parent);
    const { program } = this.parent;
    program.option(
      "-d, --data-path [path]",
      "path to configuration and data files"
    );
  }

  async preAction(command) {
    const { config } = this.parent.config;
    const opts = command.opts();
    if (opts.dataPath) {
      config.set("dataPath", opts.dataPath);
    }

    const configPath = this.jsonPath("config");
    try {
      fs.accessSync(configPath, fs.constants.R_OK);
    } catch (e) {
      return;
    }

    config.loadFile(configPath);
    config.validate({ allowed: "warn" });
  }

  dataPath() {
    const { config } = this.parent.config;
    return path.resolve(config.get("dataPath"));
  }

  jsonPath(name) {
    return path.join(this.dataPath(), `${name}.json`);
  }

  async loadJSON(name, defVal = {}) {
    const log = this.parent.logger.log();
    const filename = this.jsonPath(name);
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

  async saveJSON(name, data) {
    const log = this.parent.logger.log();
    const filename = this.jsonPath(name);
    log.trace({ msg: "saveJSON", filename, data });
    const json = JSON.stringify(data, null, "  ");
    return fsPromises.writeFile(filename, json);
  }

  async updateJSON(name, updates) {
    const log = this.parent.logger.log();
    log.trace({ msg: "updateJSON", name, updates });
    const data = await this.loadJSON(name);
    Object.assign(data, updates);
    await this.saveJSON(name, data);
    return data;
  }
}
