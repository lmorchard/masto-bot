import axios from "axios";

export default (Base) =>
  class extends Base {
    async preAction(command) {
      await super.preAction(command);

      this.client = this.Client();
      this.authedClient = this.AuthedClient();
    }

    configSchema() {
      return {
        ...super.configSchema(),
        apiBaseUrl: {
          doc: "Base URL for the Mastodon site",
          env: "API_BASE_URL",
          format: String,
          default: "https://mastodon.social",
        },
        clientId: {
          doc: "OAuth client ID used by the client",
          env: "CLIENT_ID",
          format: String,
          default: null,
          nullable: true,
          sensitive: true,
        },
        clientSecret: {
          doc: "OAuth client secret used by the client",
          env: "CLIENT_SECRET",
          format: String,
          default: null,
          nullable: true,
          sensitive: true,
        },
        vapidKey: {
          doc: "VAPID key used by the client",
          env: "VAPID_KEY",
          format: String,
          default: null,
          nullable: true,
          sensitive: true,
        },
        accessToken: {
          doc: "OAuth access token used by the client",
          env: "ACCESS_TOKEN",
          format: String,
          default: null,
          nullable: true,
          sensitive: true,
        },
      }
    }

    Client(opts = {}) {
      const log = this.log();
      const baseURL = this.config.get("apiBaseUrl");
      log.trace({ msg: "Client", baseURL });
      return axios.create({ baseURL });
    }
    
    AuthedClient(opts = {}) {
      const { config } = this;
      const log = this.log();
      const baseURL = config.get("apiBaseUrl");
      const accessToken = config.get("accessToken");
      log.trace({ msg: "AuthedClient", baseURL, accessToken });
      return axios.create({
        baseURL,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    async postStatus({
      status,
      in_reply_to_id,
      visibility = "public",
      sensitive = false,
    }) {
      const log = this.log();
      const data = {
        status,
        in_reply_to_id,
        visibility,
        sensitive,
      };
      log.trace({ msg: "postStatus", ...data });
      return this.authedClient({
        method: "POST",
        url: "/api/v1/statuses",
        data,
      });
    }
  };
