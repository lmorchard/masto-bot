export default class ClientPlugin extends BasePlugin {
    static configSchema: {
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
    };
    preAction(): Promise<void>;
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
}
import BasePlugin from "./base.js";
