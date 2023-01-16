export default class ConfigPlugin extends BasePlugin {
    extendSchema(schema?: {}): void;
    configSchema: any;
    get(name: any): any;
    config: any;
    runConfigShow(options: any): Promise<void>;
    runConfigSet(configName: any, configValue: any, options: any): Promise<void>;
    updateConfig(configData?: {}): Promise<any>;
}
import BasePlugin from "./base.js";
