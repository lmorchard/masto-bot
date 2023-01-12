import BasePlugin from "../mixins/base.js";
import CommandInit from "./init.js";
import CommandAuth from "./auth.js";
import CommandNotifications from "./notifications.js";
import CommandStreaming from "./streaming.js";

export default class ClientPlugin extends BasePlugin {
  /** @param {import("../index.js").default} parent */
  constructor(parent) {
    super(parent);
    this.init = new CommandInit(parent);
    this.auth = new CommandAuth(parent);
    this.notifications = new CommandNotifications(parent);
    this.streaming = new CommandStreaming(parent);
  }
}
