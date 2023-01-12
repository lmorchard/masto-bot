const DATA_NAME = "notifications";

import BasePlugin from "../mixins/base.js";

export default class CommandStreaming extends BasePlugin {
  /** @param {import("../index.js").default} parent */
  constructor(parent) {
    super(parent);
    const { program } = parent;

    const notificationsCommand = program
      .command("notifications")
      .description("notification operations");

    notificationsCommand
      .command("poll")
      .description("poll latest notifications")
      .action(this.runPollNotifications.bind(this));
  }

  async runPollNotifications() {
    const { parent } = this;
    const { bot, data, logger } = parent;
    const { authedClient: client } = parent.client;
    const log = logger.log({ action: "pollNotifications" });

    const { since_id } = await data.loadJSON(DATA_NAME);

    const response = await client({
      method: "GET",
      url: "/api/v1/notifications",
      params: { since_id },
    });

    const { status, data: responseData } = response;
    if (status !== 200) {
      log.error({ msg: "Failed to register application", data });
    }

    const count = responseData.length;
    if (count < 1) {
      log.info({ msg: "No new notifications" });
      return;
    }
    log.info({ msg: "Fetched new notifications", count });

    responseData.sort(({ created_at: a }, { created_at: b }) =>
      a.localeCompare(b)
    );

    for (const payload of responseData) {
      bot.dispatchNotification(payload);
    }

    data.updateJSON(DATA_NAME, {
      since_id: responseData[responseData.length - 1].id,
    });

    parent.onInterval();
  }
}
