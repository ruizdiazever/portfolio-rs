# syntax=docker/dockerfile:1

FROM rust:1.99-slim-bookworm AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential pkg-config libssl-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
RUN --mount=type=cache,target=/usr/local/cargo/registry \
  cargo fetch --locked

COPY src ./src
RUN --mount=type=cache,target=/usr/local/cargo/registry \
  --mount=type=cache,target=/app/target \
  cargo build --release --locked \
  && cp target/release/api /usr/local/bin/api

FROM debian:bookworm-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl libssl3 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /api
COPY --from=builder /usr/local/bin/api /usr/local/bin/api
COPY --from=builder /app/src/assets ./src/assets

RUN useradd --system --uid 10001 --user-group app \
  && chown -R app:app /api
USER app

ENV API_SERVER_URL=0.0.0.0:3002
EXPOSE 3002

CMD ["/usr/local/bin/api"]
