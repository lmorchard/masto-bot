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

## TODO

- get git push working from bot
- start building follow-friday shoutouts
- periodic run to process notifications and send outbox

## Pushing updates to Glitch via git

You can [use git to push updates into Glitch](https://support.glitch.com/t/code-locally-push-to-glitch-via-git/4227/10?u=lmorchard) - e.g. for `content/profiles.csv` or other files. To prepare your project to rebuild on git push, run these commands in the Glitch terminal:

```
git config receive.denyCurrentBranch updateInstead
echo '/usr/bin/refresh' > .git/hooks/post-receive
chmod +x .git/hooks/post-receive 
```

## Trying to use nodegit (and failing)

```
sudo apt install libgit2-dev
sudo apt install krb5-config
```
