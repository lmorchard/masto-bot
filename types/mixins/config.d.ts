/** @param {import("../index.js").MastotronBase} Base */
export default function ConfigMixin(Base: import("../index.js").MastotronBase): {
    new (options: any): {
        preAction(command: any): Promise<void>;
        config: any;
        configSchema(): {};
        runConfigShow(options: any): Promise<void>;
        runConfigSet(configName: any, configValue: any, options: any): Promise<void>;
    };
};
