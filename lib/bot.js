import { URL } from "url";
import config from "../lib/config.js";
import path from "path";
import logger from "../lib/logger.js";
import { Client, AuthedClient, AuthedAPI } from "../lib/client.js";

export function init(context) {
  const { program } = context;
}

export default async function Bot() {
  const botPath = config.get("botPath");
  const botFullPath = path.join(path.resolve(botPath), "index.js");
  const BotClass = (await import(botFullPath)).default;
  const bot = new BotClass({});
  await bot.init();
  return bot;
}

export class BaseBot {
  constructor(options) {
    Object.assign(this, options);
  }

  async init() {
    this.log = logger({ module: "bot" });
    this.api = await AuthedAPI.create();
  }

  static NOTIFICATION_TYPES_TO_METHODS = {
    mention: "onMentioned",
    favourite: "onFavorited",
    reblog: "onBoosted",
    follow: "onFollowed",
  };

  async dispatchNotification(payload) {
    const { log } = this;
    const { NOTIFICATION_TYPES_TO_METHODS } = this.constructor;

    log.trace({ msg: "dispatchNotification", payload });
    const name = NOTIFICATION_TYPES_TO_METHODS[payload.type];
    if (name) {
      return this[name](payload);
    }
    return this.onOther(type, payload);
  }

  async onMentioned({ created_at, account, status }) {
    const { log } = this;
    const { acct } = account;
    const { content } = status;

    log.info({ msg: "mentioned", created_at, acct, content });
  }

  async onFavorited({ created_at, account, status }) {
    const { log } = this;
    const { acct } = account;
    const { content } = status;

    log.info({ msg: "favorited", created_at, acct, content });
  }

  async onBoosted({ created_at, account, status }) {
    const { log } = this;
    const { acct } = account;
    const { content } = status;

    log.info({ msg: "boosted", created_at, acct, content });
  }

  async onFollowed({ created_at, account }) {
    const { log } = this;
    const { acct } = account;

    log.info({ msg: "followed by", created_at, acct });
  }

  async onOther(type, payload) {
    log.debug({ msg: "unhandled type", type, payload });
  }
}
