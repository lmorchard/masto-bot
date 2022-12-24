# mastotron

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
