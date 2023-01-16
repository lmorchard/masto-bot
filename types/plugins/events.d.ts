export default class Events {
    subscriptions: Map<any, any>;
    lastId: number;
    on(eventName: any, handler: any): number;
    off(eventName: any, id: any): void;
    emit(eventName: any, ...data: any[]): Promise<any[]>;
}
