import { URL } from "url";
import config from "../lib/config.js";
import logger from "../lib/logger.js";
import { Client, AuthedClient } from "../lib/client.js";

export function init({ program }) {
  const notificationsCommand = program
    .command("notifications")
    .description("notification operations")
    .action(run);
}

async function run() {
  const { log } = logger;
  const client = AuthedClient();

  const response = await client({
    method: "GET",
    url: "/api/v1/notifications",
    params: {

    }
  });

  const { status, data } = response;
  if (status !== 200) {
    log.error({ msg: "Failed to register application", data });
  }

  console.log({ msg: "notifications", data });
}