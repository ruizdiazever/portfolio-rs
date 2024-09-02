FROM rust:latest

RUN apt update && apt install iputils-ping redis-tools -y

WORKDIR /api
COPY . .

EXPOSE 3002
