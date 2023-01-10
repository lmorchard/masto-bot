# mastotron

## Setup flow

```
# Create a new Mastodon account and log into it

# Set common config params in environment
export LOG_LEVEL=debug
export DATA_PATH=./data/testbot

# Create the data path and initial configuration with server and bot info
./bots/complimentron/index.js init \
  --base-url  "https://toot.lmorchard.com" \
  --name "Test bot" \
  --website "https://lmorchard.com"

# Register the bot as an application with the server
./bots/complimentron/index.js auth register

# Construct an OAuth authorization link, visit to approve access and copy the given code
./bots/complimentron/index.js auth link

# Paste the authorization code as argument to this command
./bots/complimentron/index.js auth code asdfasdfasdfasdfasdfasdf

# Verify access to the API
./bots/complimentron/index.js auth verify

# Show the current configuration, with secrets
./bots/complimentron/index.js config show

# Start up streaming notifications client
./bots/complimentron/index.js streaming
```
