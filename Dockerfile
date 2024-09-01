# Get started with a build env with Rust nightly
FROM rustlang/rust:nightly-alpine as builder

RUN apk update && \
    apk add --no-cache bash curl npm libc-dev binaryen protoc openssl-dev protobuf-dev gcc git g++ libc-dev make binaryen

RUN npm install -g sass tailwindcss

RUN curl --proto '=https' --tlsv1.2 -LsSf https://github.com/leptos-rs/cargo-leptos/releases/download/v0.2.20/cargo-leptos-installer.sh | sh

# Add the WASM target
RUN rustup target add wasm32-unknown-unknown

WORKDIR /work
COPY . .

RUN echo "Exposing PORT.."
RUN echo $PORT

RUN npx tailwindcss -i ./style/tailwind.css -o ./style/output.css
RUN cargo leptos build --release -vv

FROM rustlang/rust:nightly-alpine as runner

WORKDIR /app

COPY --from=builder /work/target/release/portfolio /app/
COPY --from=builder /work/target/site /app/site
COPY --from=builder /work/Cargo.toml /app/

EXPOSE 3000
ENV LEPTOS_SITE_ROOT=./site

CMD ["/app/portfolio"]
