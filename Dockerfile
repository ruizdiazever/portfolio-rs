# Builder
FROM rustlang/rust:nightly-bullseye as builder
RUN wget https://github.com/cargo-bins/cargo-binstall/releases/latest/download/cargo-binstall-x86_64-unknown-linux-musl.tgz
RUN tar -xvf cargo-binstall-x86_64-unknown-linux-musl.tgz
RUN cp cargo-binstall /usr/local/cargo/bin
RUN cargo binstall cargo-leptos -y
RUN rustup target add wasm32-unknown-unknown
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN cargo install cargo-leptos
RUN cargo leptos build --release -vv

# Runner
FROM debian:bookworm-slim as runtime
WORKDIR /app
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder . .
ENV PRODUCTION=false \
    API_VERSION=0.0.1 \
    API_SERVER_URL=0.0.0.0:3002 \
    RUST_LOG=api=debug,tower_http=info \
    EMAIL=ruizdiaz.oe@gmail.com \
    SMTP_USERNAME=ruizdiaz.oe@gmail.com
CMD ["/app/target/release/portfolio"]
