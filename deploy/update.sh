#!/usr/bin/env bash
# Pull the images CI published for main and converge the portfolio stack.
# Idempotent: safe to run from the systemd timer every few minutes.
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/runner/portfolio}"
ENV_FILE="${PORTFOLIO_ENV_FILE:-/etc/portfolio/env}"
COMPOSE_FILE="$REPO_DIR/deploy/compose.yaml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing env file: $ENV_FILE" >&2
  exit 1
fi
if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "missing compose file: $COMPOSE_FILE" >&2
  exit 1
fi

cd "$REPO_DIR"
git fetch --depth=1 --prune origin main
git reset --hard FETCH_HEAD

export PORTFOLIO_ENV_FILE="$ENV_FILE"
COMPOSE=(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE")

"${COMPOSE[@]}" pull --quiet
"${COMPOSE[@]}" up -d --remove-orphans --wait --wait-timeout 180

docker image prune -f --filter "until=168h" >/dev/null
echo "portfolio: deployed $(git rev-parse --short HEAD)"
