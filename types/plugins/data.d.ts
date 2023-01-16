export default class DataPlugin extends BasePlugin {
    static configSchema: {
        dataPath: {
            doc: string;
            env: string;
            format: StringConstructor;
            default: string;
            nullable: boolean;
        };
    };
    dataPath(): any;
    jsonPath(name: any): any;
    loadJSON(name: any, defVal?: {}): Promise<any>;
    saveJSON(name: any, data: any): Promise<any>;
    updateJSON(name: any, updates: any): Promise<any>;
}
import BasePlugin from "./base.js";
