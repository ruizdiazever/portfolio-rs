# Builder
FROM rustlang/rust:nightly-bullseye AS builder
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
FROM rust:slim-bookworm AS runtime
WORKDIR /app
RUN apt-get update -y \
    && apt-get install -y openssl ca-certificates \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder . .
CMD ["/app/app/target/release/portfolio"]
