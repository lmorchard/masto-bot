import { URL } from "url";
import config from "../lib/config.js";
import logger from "../lib/logger.js";
import { Client, AuthedClient } from "../lib/client.js";

export function init(context) {
  const { program } = context;
}

export default async function Bot() {
  // TODO: option to load a specified module as bot subclass
  const bot = new BaseBot({});
  return bot;
}

export class BaseBot {
  constructor(options) {
    Object.assign(this, options);
  }

  async init() {
    this.log = logger({ module: "bot" });
  }

  async onMentioned({ created_at, account, status }) {
    // status.visibility: "direct" is DM
    // status.visibility: "public" is public mention
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
}
