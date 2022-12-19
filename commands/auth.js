import { URL } from "url";
import axios from "axios";
import config from "../lib/config.js";
import logger from "../lib/logger.js";
import { Client, AuthedClient } from "../lib/client.js";
import { OAUTH_SCOPES } from "../lib/constants.js";

export function init({ program }) {
  const authCommand = program.command("auth").description("auth operations");

  authCommand
    .command("register")
    .description("register an application for the bot")
    .action(runRegister);

  authCommand
    .command("link")
    .description("get a link to authorize bot")
    .action(runLink);

  authCommand
    .command("code <code>")
    .description("obtain a token using the authorization code")
    .action(runCode);

  authCommand
    .command("verify")
    .description("verify the current access token")
    .action(runVerify);
}

async function runRegister() {
  const { BOT_NAME, BOT_WEBSITE } = config;
  const { log } = logger;
  const client = Client();

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
    log.error({ msg: "Failed to register application", data });
  }

  const { client_id, client_secret, vapid_key } = response.data;

  console.log("Application registered:");
  console.log("");
  console.log(`CLIENT_ID=${client_id}`);
  console.log(`CLIENT_SECRET=${client_secret}`);
  console.log(`VAPID_KEY=${vapid_key}`);
}

async function runLink() {
  const { log } = logger;
  const { API_BASE_URL, CLIENT_ID } = config;

  const authUrl = new URL(`${API_BASE_URL}/oauth/authorize`);
  const params = {
    client_id: CLIENT_ID,
    scope: OAUTH_SCOPES,
    redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
    response_type: "code",
  };
  for (const [name, value] of Object.entries(params)) {
    authUrl.searchParams.set(name, value);
  }

  log.info({ msg: "Authorization link", authUrl });
}

async function runCode(code) {
  const { CLIENT_ID, CLIENT_SECRET } = config;
  const { log } = logger;
  const client = Client();

  try {
    const response = await client({
      method: "POST",
      url: "/oauth/token",
      data: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scopes: OAUTH_SCOPES,
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        grant_type: "authorization_code",
        code,
      },
    });

    const { status, data } = response;
    if (status !== 200) {
      log.error({ msg: "Failed to register application", data });
    }

    const { access_token } = data;
    log.debug({ msg: "success", data });
    console.log("Success, add this to .env:");
    console.log("");
    console.log(`ACCESS_TOKEN=${access_token}`);
  } catch (err) {
    log.error({ msg: "Token request failed", err: err.message });
  }
}

async function runVerify() {
  const { log } = logger;
  const client = AuthedClient();

  const response = await client({
    method: "GET",
    url: "/api/v1/accounts/verify_credentials",
  });

  const { status, data } = response;
  if (status !== 200) {
    log.error({ msg: "Failed to register application", data });
  }
  const { username, display_name } = data;
  log.info({ msg: "Verified", username, display_name });
  log.debug({ msg: "success", data });
}
