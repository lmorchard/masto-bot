export default class BotPlugin extends BasePlugin {
    static configSchema: {
        botName: {
            doc: string;
            env: string;
            format: StringConstructor;
            default: string;
        };
        botWebsite: {
            doc: string;
            env: string;
            format: StringConstructor;
            default: string;
        };
        ignoreBots: {
            doc: string;
            env: string;
            format: BooleanConstructor;
            default: boolean;
        };
        timerInterval: {
            doc: string;
            env: string;
            format: NumberConstructor;
            default: number;
        };
    };
    static NOTIFICATION_TYPES_TO_METHODS: {
        mention: string;
        favourite: string;
        reblog: string;
        follow: string;
    };
    scheduleCallback(propName: any, dataName: any, scheduledInterval: any, callback: any): Promise<any>;
    dispatchNotification(payload: any): Promise<any>;
}
import BasePlugin from "./base.js";
