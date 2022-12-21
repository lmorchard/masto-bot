# masto-bot

## TODO

- turn streaming events into onHandler calls in bot
- turn notifictions into onHandler calls in bot
- get git push working from bot
- start building follow-friday shoutouts


- multiple bots based on directories rather than env?
  - switch .env files for bot
- periodic run to process notifications and send outbox
- event model for bot
  - onMention
  - onDirectMessage
  - onLike
  - onBoost
  - onFollow
  - onUnfollow
  - what other methods? https://docs.joinmastodon.org/methods/

- rework config so the schema can be tweaked in modules
