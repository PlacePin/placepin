# create branch and apply changes (after I provide/you apply the edits)

git checkout -b pr/01-harden-server
git add -A
git commit -m "server: harden security (helmet, CORS whitelist, rate-limiter, logger)"
git push --set-upstream origin pr/01-harden-server

# open a PR using GitHub CLI (if installed)

gh pr create --title "server: harden security (helmet, CORS whitelist, rate-limiter, logger)" --body "$(cat ./.github/pr_templates/harden-server.md || echo 'Hardening server: helmet, CORS, rate-limit, logger')" --draft
