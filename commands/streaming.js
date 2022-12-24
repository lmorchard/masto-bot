import URL from "url";
import WebSocket from "ws";

export default (Base) =>
  class extends Base {
    constructor(options) {
      super(options);
      this.program
        .command("streaming")
        .description("connect to streaming websocket API")
        .action(this.runStreaming.bind(this));
    }

    logStreaming() {
      return this.log({ action: "streaming" });
    }

    async runStreaming() {
      const { config } = this;
      const log = this.logStreaming();
      const baseURL = config.get("apiBaseUrl");

      const params = new URL.URLSearchParams({
        access_token: config.get("accessToken"),
      });
      const wsBaseURL = baseURL.replace("http", "ws");
      const wsUrl = `${wsBaseURL}/api/v1/streaming?${params.toString()}`;
      log.info({ msg: "Connecting to websocket", wsUrl });

      this.ws = new WebSocket(wsUrl);
      this.ws.on("open", this.handleStreamingOpen.bind(this));
      this.ws.on("message", this.handleStreamingMessage.bind(this));
    }
    
    async handleStreamingOpen() {
      const log = this.logStreaming();
      log.trace({ msg: "open" });
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          stream: "user:notification",
        })
      );
      log.info({ msg: "Subscribed to notifications" });
    }

    async handleStreamingMessage(dataBuf) {
      const log = this.logStreaming();
      try {
        const json = dataBuf.toString();
        const { stream, event, payload: payloadJSON } = JSON.parse(json);
        const payload = JSON.parse(payloadJSON);
        log.trace({ msg: "received", stream, event, payload });

        await this.dispatchNotification(payload);
      } catch (err) {
        log.error({ msg: "received", err });
      }
    }
  };
