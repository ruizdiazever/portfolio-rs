# Builder
FROM rustlang/rust:nightly-bullseye AS builder
RUN wget https://github.com/cargo-bins/cargo-binstall/releases/latest/download/cargo-binstall-x86_64-unknown-linux-musl.tgz && \
    tar -xvf cargo-binstall-x86_64-unknown-linux-musl.tgz && \
    cp cargo-binstall /usr/local/cargo/bin && \
    cargo binstall cargo-leptos -y && \
    rustup target add wasm32-unknown-unknown
WORKDIR /app
COPY . .
RUN cargo install cargo-leptos && \
    cargo leptos build --release -vv

# Runner
FROM rust:slim-bullseye AS runtime
WORKDIR /app
RUN apt-get update -y \
    && apt-get install -y openssl ca-certificates \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/portfolio /app/
CMD ["/app/portfolio"]
