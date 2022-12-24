import * as dotenv from "dotenv";
import Convict from "convict";

export default (Base) =>
  class extends Base {
    async preAction(command) {
      await super.preAction(command);

      dotenv.config();
      const schema = this.configSchema();
      this.config = Convict(schema);
    }

    configSchema() {
      return {
        botPath: {
          doc: "Path from which to load the bot module",
          env: "BOT_PATH",
          format: String,
          default: "./bot/complimentron",
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
      };
    }
  };
