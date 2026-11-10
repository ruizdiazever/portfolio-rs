# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS builder

RUN npm install --global pnpm@10.26.1

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# API_URL is public and inlined at build: the browser calls the same origin
# and Caddy routes /api. GITHUB_TOKEN is a runtime server secret only.
ARG API_URL=/api
ENV API_URL=$API_URL

RUN pnpm run build

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production \
  HOST=0.0.0.0 \
  PORT=4321

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER node
EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
