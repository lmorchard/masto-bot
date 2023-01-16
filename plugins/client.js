import axios from "axios";
import BasePlugin from "./base.js";

export default class ClientPlugin extends BasePlugin {
  static configSchema = {
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
    userAgent: {
      doc: "User-Agent header to use in requests",
      env: "USER_AGENT",
      format: String,
      default: "Mastotron/1.0.0",
    }
  };

  async preAction() {
    this.client = this.Client();
    this.authedClient = this.AuthedClient();
  }

  Client(opts = {}) {
    const { parent } = this;
    const { logger } = parent;
    const { config } = parent.config;
    const log = logger.log();
    const baseURL = config.get("apiBaseUrl");
    log.trace({ msg: "Client", baseURL });
    return axios.create({
      baseURL,
      headers: {
        "User-Agent": config.get("userAgent"),
      },
    });
  }

  AuthedClient(opts = {}) {
    const { parent } = this;
    const { logger } = parent;
    const { config } = parent.config;
    const log = logger.log();
    const baseURL = config.get("apiBaseUrl");
    const accessToken = config.get("accessToken");
    log.trace({ msg: "AuthedClient", baseURL, accessToken });
    return axios.create({
      baseURL,
      headers: {
        "User-Agent": config.get("userAgent"),
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
    const log = this.parent.logger.log();
    const data = {
      status,
      in_reply_to_id,
      visibility,
      sensitive,
    };
    log.debug({ msg: "postStatus", ...data });
    return this.authedClient({
      method: "POST",
      url: "/api/v1/statuses",
      data,
    });
  }
}
