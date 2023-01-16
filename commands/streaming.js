import URL from "url";
import WebSocket from "ws";
import BasePlugin from "../plugins/base.js";

export default class CommandStreaming extends BasePlugin {
  /** @param {import("../index.js").default} parent */
  constructor(parent) {
    super(parent);
    const { program } = parent;
    program
      .command("streaming")
      .description("connect to streaming websocket API")
      .action(this.runStreaming.bind(this));
  }

  logStreaming() {
    return this.parent.logger.log({ action: "streaming" });
  }

  async runStreaming() {
    const { parent } = this;
    const { config } = parent;
    const log = this.logStreaming();
    const baseURL = config.get("apiBaseUrl");

    const params = new URL.URLSearchParams({
      access_token: config.get("accessToken"),
      stream: "user:notification"
    });
    const wsBaseURL = baseURL.replace("http", "ws");
    const wsURL = `${wsBaseURL}/api/v1/streaming`;
    log.info({ msg: "Connecting to websocket", wsURL });

    this.ws = new WebSocket(`${wsURL}?${params.toString()}`, {
      headers: {
        "User-Agent": config.get("userAgent"),
      },
    });
    this.ws.on("open", this.handleStreamingOpen.bind(this));
    this.ws.on("message", this.handleStreamingMessage.bind(this));
  }

  async handleStreamingOpen() {
    const { parent } = this;
    const log = this.logStreaming();
    log.trace({ msg: "open" });
    parent.onStart();
  }

  async handleStreamingMessage(dataBuf) {
    const { parent } = this;
    const { bot } = parent;
    const log = this.logStreaming();
    try {
      const json = dataBuf.toString();
      const { stream, event, payload: payloadJSON } = JSON.parse(json);
      const payload = JSON.parse(payloadJSON);
      log.trace({ msg: "received", stream, event, payload });

      await bot.dispatchNotification(payload);
    } catch (err) {
      log.error({ msg: "received", err });
    }
  }
}
