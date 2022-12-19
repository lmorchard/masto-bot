import axios from "axios";
import config from "../lib/config.js";
import logger from "../lib/logger.js";
import { OAUTH_SCOPES } from "../lib/constants.js";

export function init({ program }) {
  program
    .command("register")
    .description("register an application for the bot")
    .action(run);
}

async function run() {
  const { API_BASE_URL, BOT_NAME, BOT_WEBSITE } = config;
  const { log } = logger;

  const client = axios.create({
    baseURL: API_BASE_URL,
  });

  const response = await client({
    method: "POST",
    url: "/api/v1/apps",
    data: {
      client_name: BOT_NAME,
      website: BOT_WEBSITE,
      redirect_uris: "urn:ietf:wg:oauth:2.0:oob",
      scopes: OAUTH_SCOPES,
    },
  });

  const { status, data } = response;
  if (status !== 200) {
    log.error({ msg: "Failed to register application", data});
  }

  const { client_id, client_secret, vapid_key } = response.data;

  console.log("Application registered:");
  console.log("");
  console.log(`CLIENT_ID=${client_id}`);
  console.log(`CLIENT_SECRET=${client_secret}`);
  console.log(`VAPID_KEY=${vapid_key}`); 
}
