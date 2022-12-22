import Logger from "../lib/logger.js";
import Bot from "../lib/bot.js";
import { loadJSON, updateJSON } from "../lib/data.js";
import { AuthedClient } from "../lib/client.js";

export function init({ program }) {
  const notificationsCommand = program
    .command("notifications")
    .description("notification operations");

  notificationsCommand
    .command("poll")
    .description("poll latest notifications")
    .action(runPoll);
}

const DATA_NAME = "notifications";

async function runPoll() {
  const log = Logger({ module: "commands/notifications" });
  const client = AuthedClient();
  const bot = await Bot();

  const { since_id } = await loadJSON(DATA_NAME);

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

  data.sort(({ created_at: a }, { created_at: b }) => a.localeCompare(b));

  for (const payload of data) {
    bot.dispatchNotification(payload);
  }

  updateJSON(DATA_NAME, {
    since_id: data[data.length - 1].id,
  });
}
