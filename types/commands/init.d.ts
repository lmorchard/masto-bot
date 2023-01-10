/** @param {ReturnType<import("../mixins/bot.js").default>} Base */
export default function CommandsInitMixin(Base: ReturnType<typeof import("../mixins/bot.js").default>): {
    new (options: any): {
        runInit({ clean, name, website, botPath, baseUrl }: {
            clean?: boolean;
            name: any;
            website: any;
            botPath: any;
            baseUrl: any;
        }): Promise<void>;
        configSchema(): {
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
        onStart(): Promise<void>;
        intervalTimer: NodeJS.Timer;
        onInterval(): Promise<void>;
        scheduleCallback(propName: any, dataName: any, scheduledInterval: any, callback: any): Promise<any>;
        dispatchNotification(payload: any): Promise<any>;
        onMentioned({ created_at, account, status }: {
            created_at: any;
            account: any;
            status: any;
        }): Promise<void>;
        onFavorited({ created_at, account, status }: {
            created_at: any;
            account: any;
            status: any;
        }): Promise<void>;
        onBoosted({ created_at, account, status }: {
            created_at: any;
            account: any;
            status: any;
        }): Promise<void>;
        onFollowed({ created_at, account }: {
            created_at: any;
            account: any;
        }): Promise<void>;
        onOther(type: any, payload: any): Promise<void>;
        preAction(command: any): Promise<void>;
        client: import("axios").AxiosInstance;
        authedClient: import("axios").AxiosInstance;
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
    NOTIFICATION_TYPES_TO_METHODS: {
        mention: string;
        favourite: string;
        reblog: string;
        follow: string;
    };
};
