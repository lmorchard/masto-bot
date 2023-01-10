/** @param {ReturnType<import("./data.js").default>} Base */
export default function ClientMixin(Base: ReturnType<typeof import("./data.js").default>): {
    new (options: any): {
        preAction(command: any): Promise<void>;
        client: import("axios").AxiosInstance;
        authedClient: import("axios").AxiosInstance;
        configSchema(): {
            apiBaseUrl: {
                doc: string;
                env: string;
                format: StringConstructor;
                default: string;
            };
            clientId: {
                doc: string;
                env: string;
                format: StringConstructor;
                default: any;
                nullable: boolean;
                sensitive: boolean;
            };
            clientSecret: {
                doc: string;
                env: string;
                format: StringConstructor;
                default: any;
                nullable: boolean;
                sensitive: boolean;
            };
            vapidKey: {
                doc: string;
                env: string;
                format: StringConstructor;
                default: any;
                nullable: boolean;
                sensitive: boolean;
            };
            accessToken: {
                doc: string;
                env: string;
                format: StringConstructor;
                default: any;
                nullable: boolean;
                sensitive: boolean;
            };
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
        Client(opts?: {}): import("axios").AxiosInstance;
        AuthedClient(opts?: {}): import("axios").AxiosInstance;
        postStatus({ status, in_reply_to_id, visibility, sensitive, }: {
            status: any;
            in_reply_to_id: any;
            visibility?: string;
            sensitive?: boolean;
        }): Promise<import("axios").AxiosResponse<any, any>>;
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
