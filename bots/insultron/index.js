#!/usr/bin/env node

import fs from "fs/promises";
import Mastotron from "../../index.js";

async function main() {
  return new Insultron().run();
}

export const readTextFile = async (name) =>
  fs.readFile(name, { encoding: "utf8" });

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const loadTextLines = async (name) =>
  (await readTextFile(name))
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => !!line)
    .filter((line) => line.substr(0, 1) !== "#");

class Insultron extends Mastotron {
  async preAction(command) {
    await super.preAction(command);

    const log = this.logInsultron();

    const contentFile = new URL("./shakespeare.txt", import.meta.url);

    this.content = (await loadTextLines(contentFile))
      .map((line) => line.split(/\s+/))
      .reduce(
        ([col1, col2, col3], [i1, i2, i3]) => [
          i1 ? [...col1, i1] : col1,
          i2 ? [...col2, i2] : col2,
          i3 ? [...col3, i3] : col3,
        ],
        [[], [], []]
      );

    log.trace({ msg: "loaded content" });
  }

  logInsultron() {
    return this.log({ module: "insultron" });
  }

  generate() {
    return [
      "Thou",
      pick(this.content[0]),
      pick(this.content[1]),
      pick(this.content[2]),
    ].join(" ");
  }

  async onMentioned({ created_at, account, status }) {
    const log = this.logInsultron();
    const { acct } = account;
    const { id, visibility } = status;

    log.info({ msg: "mentioned", created_at, acct });

    const resp = this.postStatus({
      status: `@${acct} ${this.generate()}`,
      visibility,
      in_reply_to_id: id,
    });
    log.trace({ msg: "postedReply", resp });
  }

  async onFavorited({ created_at, account, status }) {
    const log = this.logInsultron();
    const { acct } = account;
    const { id, visibility } = status;

    log.info({ msg: "favorited", created_at, acct });

    const resp = this.postStatus({
      status: `@${acct} Oh you liked that, did you? ${this.generate()}`,
      visibility,
      in_reply_to_id: id,
    });
    log.trace({ msg: "postedReply", resp });
  }

  async onBoosted({ created_at, account, status }) {
    const log = this.logInsultron();
    const { acct } = account;
    const { id, visibility } = status;

    log.info({ msg: "boosted", created_at, acct });

    const resp = this.postStatus({
      status: `@${acct} Thank you for the boost, ${this.generate()}`,
      visibility,
      in_reply_to_id: id,
    });
    log.trace({ msg: "postedReply", resp });
  }

  async onFollowed({ created_at, account }) {
    const log = this.logInsultron();
    const { acct } = account;

    log.info({ msg: "followed by", created_at, acct });

    const resp = this.postStatus({
      status: `@${acct} Thanks for the follow, ${this.generate()}`,
    });
    log.trace({ msg: "postedReply", resp });
  }
}

main().catch(console.error);
