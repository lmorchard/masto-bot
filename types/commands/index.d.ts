export default class CommandsIndexPlugin extends BasePlugin {
    init: CommandInit;
    auth: CommandAuth;
    notifications: CommandNotifications;
    streaming: CommandStreaming;
}
import BasePlugin from "../plugins/base.js";
import CommandInit from "./init.js";
import CommandAuth from "./auth.js";
import CommandNotifications from "./notifications.js";
import CommandStreaming from "./streaming.js";
