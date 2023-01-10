import { URL } from "url";

export const OAUTH_SCOPES =
  "read read:notifications read:statuses write follow push";
export const REDIRECT_URI_OOB = "urn:ietf:wg:oauth:2.0:oob";

/** @param {ReturnType<import("./init.js").default>} Base */
export default function CommandAuthMixin(Base) {
  return class CommandAuthMixinBase extends Base {
    constructor(options) {
      super(options);
      const { program } = this;

      const authCommand = program
        .command("auth")
        .description("auth operations");

      authCommand
        .command("register")
        .description("register an application for the client")
        .action(this.runAuthRegister.bind(this));

      authCommand
        .command("link")
        .description("get a link to authorize client")
        .action(this.runAuthLink.bind(this));

      authCommand
        .command("code <code>")
        .description("obtain a token using the authorization code")
        .action(this.runAuthCode.bind(this));

      authCommand
        .command("verify")
        .description("verify the current access token")
        .action(this.runAuthVerify.bind(this));
    }

    async runAuthRegister() {
      const { config, client } = this;
      const log = this.log();

      const response = await client({
        method: "POST",
        url: "/api/v1/apps",
        data: {
          client_name: config.get("botName"),
          website: config.get("botWebsite"),
          redirect_uris: REDIRECT_URI_OOB,
          scopes: OAUTH_SCOPES,
        },
      });

      const { status, data } = response;
      if (status !== 200) {
        log.error({ msg: "Failed to register application", data });
      }

      const {
        client_id: clientId,
        client_secret: clientSecret,
        vapid_key: vapidKey,
      } = response.data;

      await this.updateConfig({
        clientId,
        clientSecret,
        vapidKey,
      });

      log.info({ msg: "Registered client, updated config" });
    }

    async runAuthLink() {
      const { config } = this;
      const log = this.log();

      const authUrl = new URL(`${config.get("apiBaseUrl")}/oauth/authorize`);
      const params = {
        client_id: config.get("clientId"),
        scope: OAUTH_SCOPES,
        redirect_uri: REDIRECT_URI_OOB,
        response_type: "code",
      };
      for (const [name, value] of Object.entries(params)) {
        authUrl.searchParams.set(name, value);
      }
      log.info({ msg: "Authorization link", authUrl });
    }

    async runAuthCode(code) {
      const { config, client } = this;
      const log = this.log();

      try {
        const response = await client({
          method: "POST",
          url: "/oauth/token",
          data: {
            client_id: config.get("clientId"),
            client_secret: config.get("clientSecret"),
            scopes: OAUTH_SCOPES,
            redirect_uri: REDIRECT_URI_OOB,
            grant_type: "authorization_code",
            code,
          },
        });

        const { status, data } = response;
        if (status !== 200) {
          log.error({ msg: "Failed to register application", data });
        }

        const { access_token: accessToken } = data;
        await this.updateConfig({ accessToken });

        log.info({ msg: "Obtained access token, updated config" });
      } catch (err) {
        log.error({ msg: "Token request failed", err: err.message });
      }
    }

    async runAuthVerify() {
      const { config, authedClient: client } = this;
      const log = this.log();

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
      log.trace({ msg: "success", data });
    }
  };
}
