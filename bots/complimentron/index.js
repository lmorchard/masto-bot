import logger from "../../lib/logger.js";
import { loadTextLines, pick } from "../../lib/utils.js";
import { BaseBot } from "../../lib/bot.js";

export default class ComplimentronBot extends BaseBot {
  async init() {
    await super.init();
    
    this.log = logger({ module: "complimentron" });

    const contentFile = new URL("./shakespeare.txt", import.meta.url);
    this.log.trace({ msg: "load content", contentFile });
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
    const { log } = this;
    const { acct } = account;
    const { id, content, visibility } = status;

    log.info({ msg: "mentioned", created_at, acct, content });

    const resp = this.api.postStatus({
      status: `@${acct} ${this.generate()}`,
      visibility,
      in_reply_to_id: id,
    });

    log.debug({ msg: "postedReply", resp });
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

/*
exports.onCreateNote = async ({ send }) => {
  return send(await compliments.generate());
};

exports.onLike = async ({ send }) => {
  return send(`Oh you liked that, did you? ${await compliments.generate()}`);
};

exports.onBoost = async ({ send }) => {
  return send(`Thank you for the boost, ${await compliments.generate()}`);
};

exports.onFollow = async ({ send }) => {
  return send(`Thanks for the follow, ${await compliments.generate()}`);
};
*/
