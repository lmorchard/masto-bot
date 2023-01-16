export default class CommandInit extends BasePlugin {
    runInit({ clean, name, website, botPath, baseUrl }: {
        clean?: boolean;
        name: any;
        website: any;
        botPath: any;
        baseUrl: any;
    }): Promise<void>;
}
import BasePlugin from "../plugins/base.js";
