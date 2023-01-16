export default class CommandStreaming extends BasePlugin {
    logStreaming(): import("pino").default.Logger<any>;
    runStreaming(): Promise<void>;
    ws: any;
    handleStreamingOpen(): Promise<void>;
    handleStreamingMessage(dataBuf: any): Promise<void>;
}
import BasePlugin from "../plugins/base.js";
