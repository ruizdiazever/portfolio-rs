# Deploy

Production runs on the `portfolio` VM (see `infra/ansible/vms.yml`) behind the
Caddy edge on `www.everdev.it`.

## Pipeline

1. `ci.yml` runs on every PR and push: Rust fmt/clippy/test/build, Astro
   check/build, Playwright e2e.
2. On `main`, the `images` job builds `api` and `frontend` and pushes
   `ghcr.io/ruizdiazever/portfolio-{api,frontend}:latest` + `:<sha>`.
3. The VM runs `portfolio-update.timer` every 10 min: `update.sh` resets the
   checkout to `origin/main`, pulls the images and converges
   `deploy/compose.yaml` with `--wait`.

## Layout on the VM

| Path | What |
|---|---|
| `/home/runner/portfolio` | checkout of this repo (public, HTTPS) |
| `/etc/portfolio/env` | secrets + env for the stack, `0600 runner:runner` (vault) |
| `deploy/compose.yaml` | the stack |
| `deploy/update.sh` | the deploy script (ansible installs it as `/usr/local/bin/portfolio-update.sh`) |

Caddy routes `www.everdev.it/api/*` to `portfolio:3002` (prefix stripped) and
everything else to `portfolio:4321`. Browser API calls are same-origin.

## Manual operations

```bash
# force a deploy now
sudo systemctl start portfolio-update.service
systemctl status portfolio-update.timer
journalctl -u portfolio-update.service -n 50

# roll back to a previous image
cd /home/runner/portfolio
PORTFOLIO_ENV_FILE=/etc/portfolio/env IMAGE_TAG=<sha> \
  docker compose --env-file /etc/portfolio/env -f deploy/compose.yaml up -d
```
