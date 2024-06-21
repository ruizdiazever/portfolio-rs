# Portfolio WASM

<img src="./public/images/mascot.png" alt="Ferris, mascot of Rust" width="100"/>

Portfolio WASM powered by Rust with Leptos and Axum

## Commands

```bash
sh run_build.sh  # First time
sh run.sh        # Running
```

## Env

To set in Cloud

```
LEPTOS_OUTPUT_NAME="portfolio"
LEPTOS_SITE_ROOT="site"
LEPTOS_SITE_PKG_DIR="pkg"
LEPTOS_SITE_ADDR="127.0.0.1:3000"
LEPTOS_RELOAD_PORT="3001"
```

## TiKV database
Test with CURL `curl http://localhost:2379/pd/health`

### **PD (Placement Driver):**

* **Containers:** pingcap/pd:latest.
* **Function:** Acts as the cluster manager. It manages cluster metadata, load balances between nodes, and coordinates data replication. PD nodes communicate with each other and with TiKV nodes to ensure high availability and system consistency.

### **TiKV (TiKV Nodes**
* **Containers:** pingcap/tikv:latest
* **Function:** They are the storage nodes of the cluster. TiKV is a distributed database that handles data storage, supporting read and write operations. Each TiKV node connects to PD nodes to receive instructions on how to balance and replicate data.

## Powered by ⚡️

- [Rust](https://www.rust-lang.org/): most powerfull language in solar system.
- [Leptos](https://www.leptos.dev/): A cutting-edge Rust framework for the modern web.
- [Axum](https://github.com/tokio-rs/axum): a web application framework that focuses on ergonomics and modularity.
- [TailwindCSS](https://tailwindcss.com/): CSS framework.
- [TiKV](https://tikv.org/): a highly scalable, low latency, and easy to use
key-value database coded in Rust.
