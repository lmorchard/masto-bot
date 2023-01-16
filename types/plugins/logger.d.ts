export default class LoggerPlugin extends BasePlugin {
    static configSchema: {
        logLevel: {
            doc: string;
            env: string;
            format: string[];
            default: string;
        };
    };
    rootlog: import("pino").Logger<{
        level: any;
        transport: {
            target: string;
            options: {
                colorize: boolean;
            };
        };
    }>;
    log(bindings: {}, options: any): pino.Logger<any>;
}
import BasePlugin from "./base.js";
import pino from "pino";
