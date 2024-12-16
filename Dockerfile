# Builder
FROM rustlang/rust:nightly-alpine AS builder
RUN apk update && \
    apk add --no-cache bash curl npm libc-dev binaryen
RUN npm install -g tailwindcss
RUN curl --proto '=https' --tlsv1.2 -LsSf https://github.com/leptos-rs/cargo-leptos/releases/latest/download/cargo-leptos-installer.sh | sh
RUN rustup target add wasm32-unknown-unknown
WORKDIR /work
COPY . .
RUN cargo leptos build --release -vv

# Runner
FROM rustlang/rust:nightly-alpine AS runner
WORKDIR /app
COPY --from=builder . .
RUN npx tailwindcss -i /app/style/tailwind.css -o /app/style/output.css
ENV PRODUCTION=false \
    API_VERSION=0.0.1 \
    API_SERVER_URL=0.0.0.0:3002 \
    RUST_LOG=api=debug,tower_http=info \
    EMAIL=ruizdiaz.oe@gmail.com \
    SMTP_USERNAME=ruizdiaz.oe@gmail.com
CMD ["/app/target/release/portfolio"]
