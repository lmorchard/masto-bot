export const OAUTH_SCOPES: "read read:notifications read:statuses write follow push";
export const REDIRECT_URI_OOB: "urn:ietf:wg:oauth:2.0:oob";
export default class CommandAuth extends BasePlugin {
    runAuthRegister(): Promise<void>;
    runAuthLink(): Promise<void>;
    runAuthCode(code: any): Promise<void>;
    runAuthVerify(): Promise<void>;
}
import BasePlugin from "../plugins/base.js";
