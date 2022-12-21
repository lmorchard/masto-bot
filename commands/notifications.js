import { URL } from "url";
import config from "../lib/config.js";
import Logger from "../lib/logger.js";
import Bot from "../lib/bot.js";
import { loadJSON, updateJSON } from "../lib/data.js";
import { Client, AuthedClient } from "../lib/client.js";

export function init({ program }) {
  const notificationsCommand = program
    .command("notifications")
    .description("notification operations");

  notificationsCommand
    .command("poll")
    .description("poll latest notifications")
    .action(runPoll);
}

const DATA_NAME = "notifications-state";

async function runPoll() {
  const log = Logger({ module: "commands/notifications" });
  const client = AuthedClient();

  const bot = await Bot();
  await bot.init();

  const state = await loadJSON(DATA_NAME);
  const { since_id } = state;

  const response = await client({
    method: "GET",
    url: "/api/v1/notifications",
    params: { since_id },
  });

  const { status, data } = response;
  if (status !== 200) {
    log.error({ msg: "Failed to register application", data });
  }

  const count = data.length;
  if (count < 1) {
    log.info({ msg: "No new notifications" });
    return;
  }
  log.info({ msg: "Fetched new notifications", count });

  // Sort notifications in chronological order
  data.sort(({ created_at: a }, { created_at: b }) => a.localeCompare(b));

  for (const payload of data) {
    handleNotification(log, bot, payload);
  }

  updateJSON(DATA_NAME, {
    since_id: data[data.length - 1].id,
  });
}

function handleNotification(log, bot, payload) {
  log.trace({ msg: "notification", payload });

  const { type, created_at, account, status } = payload;
  const commonParams = { created_at, account, status, payload };

  switch (type) {
    case "mention":
      return bot.onMentioned(commonParams);
    case "favourite":
      return bot.onFavorited(commonParams);
    case "reblog":
      return bot.onBoosted(commonParams);
    case "follow":
      return bot.onFollowed(commonParams);
    default:
      log.debug({ msg: "unhandled type", stream, event, payload });
      return;
  }
}
