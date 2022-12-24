export default (Base) =>
  class extends Base {
    static NOTIFICATION_TYPES_TO_METHODS = {
      mention: "onMentioned",
      favourite: "onFavorited",
      reblog: "onBoosted",
      follow: "onFollowed",
    };
  
    async dispatchNotification(payload) {
      const log = this.log();
      const { NOTIFICATION_TYPES_TO_METHODS } = this.constructor;
  
      log.trace({ msg: "dispatchNotification", payload });
      const name = NOTIFICATION_TYPES_TO_METHODS[payload.type];
      if (name) {
        return this[name](payload);
      }
      return this.onOther(type, payload);
    }
  
    async onMentioned({ created_at, account, status }) {
      const log = this.log();
      const { acct } = account;
      const { content } = status;
  
      log.info({ msg: "mentioned", created_at, acct, content });
    }
  
    async onFavorited({ created_at, account, status }) {
      const log = this.log();
      const { acct } = account;
      const { content } = status;
  
      log.info({ msg: "favorited", created_at, acct, content });
    }
  
    async onBoosted({ created_at, account, status }) {
      const log = this.log();
      const { acct } = account;
      const { content } = status;
  
      log.info({ msg: "boosted", created_at, acct, content });
    }
  
    async onFollowed({ created_at, account }) {
      const log = this.log();
      const { acct } = account;
  
      log.info({ msg: "followed by", created_at, acct });
    }
  
    async onOther(type, payload) {
      const log = this.log();
      log.debug({ msg: "unhandled type", type, payload });
    }      
  }
