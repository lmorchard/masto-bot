export default (Base) =>
  class extends Base {
    configSchema() {
      return {
        ...super.configSchema(),
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
        }
      };
    }

    async onStart() {
      const log = this.log();
      log.trace({ msg: "onStart" });
      this.intervalTimer = setInterval(
        this.onInterval.bind(this),
        this.config.get("timerInterval"),
      );
    }

    async onInterval() {}

    async scheduleCallback(propName, dataName, scheduledInterval, callback) {
      const now = Date.now();
      const { [propName]: lastCallTime = 0 } = await this.loadJSON(dataName);
      if (now - lastCallTime > scheduledInterval) {
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
      const log = this.log();
      const { NOTIFICATION_TYPES_TO_METHODS } = this.constructor;

      log.trace({ msg: "dispatchNotification", payload });

      const { account, type } = payload;
      const { acct, bot } = account;
      if (bot) {
        log.debug({ msg: "ignoring message from bot account", acct });
        return;
      }
      const name = NOTIFICATION_TYPES_TO_METHODS[type];
      if (name) {
        return this[name](payload);
      }
      return this.onOther(type, payload);
    }

    async onMentioned({ created_at, account, status }) {
      const log = this.log();
      const { acct } = account;
      const { content } = status;

      log.info({ msg: "mentioned", created_at, acct, content });
    }

    async onFavorited({ created_at, account, status }) {
      const log = this.log();
      const { acct } = account;
      const { content } = status;

      log.info({ msg: "favorited", created_at, acct, content });
    }

    async onBoosted({ created_at, account, status }) {
      const log = this.log();
      const { acct } = account;
      const { content } = status;

      log.info({ msg: "boosted", created_at, acct, content });
    }

    async onFollowed({ created_at, account }) {
      const log = this.log();
      const { acct } = account;

      log.info({ msg: "followed by", created_at, acct });
    }

    async onOther(type, payload) {
      const log = this.log();
      log.debug({ msg: "unhandled type", type, payload });
    }
  };
