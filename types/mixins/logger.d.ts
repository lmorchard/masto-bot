/** @param {ReturnType<import("./config.js").default>} Base */
export default function LoggerMixin(Base: ReturnType<typeof import("./config.js").default>): {
    new (options: any): {
        configSchema(): {
            logLevel: {
                doc: string;
                env: string;
                format: string[];
                default: string;
            };
        };
        preAction(command: any): Promise<void>;
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
        config: any;
        runConfigShow(options: any): Promise<void>;
        runConfigSet(configName: any, configValue: any, options: any): Promise<void>;
    };
};
import pino from "pino";
