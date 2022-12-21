import URL from "url";
import WebSocket from "ws";
import config from "../lib/config.js";
import logger from "../lib/logger.js";
import Bot from "../lib/bot.js";

export function init({ program }) {
  const authCommand = program
    .command("streaming")
    .description("connect to streaming websocket API")
    .action(run);
}

async function run() {
  const log = logger();

  const bot = await Bot();
  await bot.init();

  const baseURL = config.get("apiBaseUrl");

  const params = new URL.URLSearchParams({
    access_token: config.get("accessToken"),
  });
  const wsBaseURL = baseURL.replace("http", "ws");
  const wsUrl = `${wsBaseURL}/api/v1/streaming?${params.toString()}`;
  log.info({ msg: "Connecting to websocket", wsUrl });

  const ws = new WebSocket(wsUrl);

  ws.on("open", function open() {
    log.trace({ msg: "open" });
    ws.send(
      JSON.stringify({
        type: "subscribe",
        stream: "user:notification",
      })
    );
    log.info({ msg: "Subscribed to notifications" });
  });

  ws.on("message", function message(dataBuf) {
    try {
      const json = dataBuf.toString();
      const { stream, event, payload: payloadJSON } = JSON.parse(json);
      const payload = JSON.parse(payloadJSON);
      log.trace({ msg: "received", stream, event, payload });

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
    } catch (err) {
      log.error({ msg: "received", err });
    }
  });
}
