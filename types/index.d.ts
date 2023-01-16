export default class Mastotron {
    static configSchema: {};
    constructor(options: any);
    options: any;
    events: Events;
    program: Command;
    config: ConfigPlugin;
    logger: LoggerPlugin;
    data: DataPlugin;
    client: ClientPlugin;
    bot: BotPlugin;
    commands: CommandsIndexPlugin;
    init(): Promise<void>;
    run(argv?: string[]): Promise<void>;
    preAction(command: any): Promise<void>;
    onStart(): Promise<void>;
    intervalTimer: NodeJS.Timer;
    onInterval(): Promise<void>;
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
}
import Events from "./plugins/events.js";
import { Command } from "commander";
import ConfigPlugin from "./plugins/config.js";
import LoggerPlugin from "./plugins/logger.js";
import DataPlugin from "./plugins/data.js";
import ClientPlugin from "./plugins/client.js";
import BotPlugin from "./plugins/bot.js";
import CommandsIndexPlugin from "./commands/index.js";
