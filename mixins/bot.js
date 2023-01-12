import BasePlugin from "./base.js";

export default class BotPlugin extends BasePlugin {
  static configSchema = {
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
    ignoreBots: {
      doc: "Ignore messages from other bots, in part to prevent reply loops",
      env: "IGNORE_BOTS",
      format: Boolean,
      default: true,
    },
    timerInterval: {
      doc: "Period of time between onInterval events",
      env: "TIMER_INTERVAL",
      format: Number,
      default: 5000,
    },
  };

  async scheduleCallback(propName, dataName, scheduledInterval, callback) {
    const log = this.log();
    const now = Date.now();
    const { [propName]: lastCallTime = 0 } = await this.loadJSON(dataName);
    const durationSince = now - lastCallTime;
    const shouldCall = durationSince > scheduledInterval;
    log.trace({
      msg: "scheduleCallback",
      propName,
      dataName,
      lastCallTime,
      durationSince,
      scheduledInterval,
      shouldCall,
    });
    if (shouldCall) {
      await this.updateJSON(dataName, { [propName]: now });
      return callback();
    }
  }

  static NOTIFICATION_TYPES_TO_METHODS = {
    mention: "onMentioned",
    favourite: "onFavorited",
    reblog: "onBoosted",
    follow: "onFollowed",
  };

  async dispatchNotification(payload) {
    const { parent } = this;
    const { config, logger } = parent;
    const log = logger.log();

    const { NOTIFICATION_TYPES_TO_METHODS } = this.constructor;

    log.trace({ msg: "dispatchNotification", payload });

    const { account, type } = payload;
    const { acct, bot } = account;
    if (bot && config.get("ignoreBots")) {
      log.debug({ msg: "ignoring message from bot account", acct });
      return;
    }
    const name = NOTIFICATION_TYPES_TO_METHODS[type];
    if (name) {
      return parent[name](payload);
    }
    return parent.onOther(type, payload);
  }
}
