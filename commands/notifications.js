const DATA_NAME = "notifications";

export default (Base) =>
  class extends Base {
    constructor(options) {
      super(options);
      const { program } = this;

      const notificationsCommand = program
        .command("notifications")
        .description("notification operations");

      notificationsCommand
        .command("poll")
        .description("poll latest notifications")
        .action(this.runPollNotifications.bind(this));
    }
    
    async runPollNotifications(options) {
      const log = this.log({ action: "pollNotifications" });
      const client = this.authedClient;
    
      const { since_id } = await this.loadJSON(DATA_NAME);
    
      const response = await client({
        method: "GET",
        url: "/api/v1/notifications",
        params: { since_id },
      });
    
      const { status, data } = response;
      if (status !== 200) {
        log.error({ msg: "Failed to register application", data });
      }
    
      const count = data.length;
      if (count < 1) {
        log.info({ msg: "No new notifications" });
        return;
      }
      log.info({ msg: "Fetched new notifications", count });
    
      data.sort(({ created_at: a }, { created_at: b }) => a.localeCompare(b));
    
      for (const payload of data) {
        this.dispatchNotification(payload);
      }
    
      this.updateJSON(DATA_NAME, {
        since_id: data[data.length - 1].id,
      });

      this.onInterval();
    }    
  };
