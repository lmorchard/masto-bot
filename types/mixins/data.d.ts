/** @param {ReturnType<import("./logger.js").default>} Base */
export default function DataMixin(Base: ReturnType<typeof import("./logger.js").default>): {
    new (options: any): {
        configSchema(): {
            dataPath: {
                doc: string;
                env: string;
                format: StringConstructor;
                default: string;
                nullable: boolean;
            };
            logLevel: {
                doc: string;
                env: string;
                format: string[];
                default: string;
            };
        };
        preAction(command: any): Promise<void>;
        dataPath(): any;
        jsonPath(name: any): any;
        loadJSON(name: any, defVal?: {}): Promise<any>;
        saveJSON(name: any, data: any): Promise<any>;
        updateJSON(name: any, updates: any): Promise<any>;
        updateConfig(updates: any): Promise<any>;
        rootlog: import("pino").Logger<{
            level: any;
            transport: {
                target: string;
                options: {
                    colorize: boolean;
                };
            };
        }>;
        log(bindings: {}, options: any): import("pino").default.Logger<any>;
        config: any;
        runConfigShow(options: any): Promise<void>;
        runConfigSet(configName: any, configValue: any, options: any): Promise<void>;
    };
};
