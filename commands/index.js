import CommandInitMixin from "./init.js";
import CommandAuthMixin from "./auth.js";
import CommandNotificationsMixin from "./notifications.js";
import CommandStreamingMixin from "./streaming.js";

/** @typedef {ReturnType<import("../mixins/bot.js").default>} Base */

/** @param {Base} Base */
export default function CommandsMixin(Base) {
  return CommandStreamingMixin(
    CommandNotificationsMixin(CommandAuthMixin(CommandInitMixin(Base)))
  );
}
