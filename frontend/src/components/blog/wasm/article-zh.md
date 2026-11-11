
2024 年，我用 Rust 和 WebAssembly 重做了作品集：界面用 Leptos，API 用 Axum，浏览量和小反馈存在 Redis 里。

我想看看纯 Rust 技术栈在 Web 上能走多远。下面是我学到的东西。网站后来迁到了 Astro 与 Svelte；这篇记录的是当时的那一版。

## 技术栈

Leptos 把界面编译成 WebAssembly。一个很小的 Axum 服务处理浏览量和反馈，数据落在 Redis。API 刻意保持很窄：只提供页面真正需要的几个接口。

## 设计

我想要一个安静、快速的作品集。克制感来自 [Vercel](https://vercel.com/)、[Nio](https://www.nio.com/)、[Apple](https://www.apple.com/) 和 [Nothing](https://nothing.tech/)；[Guille Moreira](https://twitter.com/gzmoreira/) 的作品则提醒我，拉丁美洲的开发者能做出什么。

第一版上线时，有些部分还没完成。我没有把它们藏起来——作品集应该展示正在做的东西，而不只是打磨好的部分。

## 特点

### SSR 与水合
- 服务端渲染首屏。
- 交互部分在客户端水合。
- 尽量小的 JavaScript 体积。

### 反馈
- 每篇文章下方的短反馈表单。
- 通过 Redis 与 SMTP 发邮件通知。
- 不需要账号。

### 分析
- 每篇文章的浏览量。
- Redis 中的访客统计。
- 一个可视化关键数据的仪表盘。

## 架构

![作品集架构](https://s3.berli.app/portfolio/v1/blog/portfolio-wasm/architecture.svg)

## 监控

我用 [Grafana](https://grafana.com/) 和 [InfluxDB](https://www.influxdata.com/) 做监控。InfluxDB 存时间序列，Grafana 读取这些数据。我把 InfluxDB 的警报接到 Telegram 机器人，出问题时能收到消息。

![Grafana 仪表板](https://s3.berli.app/portfolio/v1/blog/portfolio-wasm/grafana-1280.webp)

## 部署

作品集跑在一台小主机上：Fedora Server 40、Caddy 负责 HTTPS、Cockpit 与 SSH 管理、Grafana 与 InfluxDB 监控。当前网站已经迁到 Proxmox，使用 Caddy 与 S3 媒体；下表描述的是 2024 年的配置。

| 组件 | 名称 |
|-----------|------|
| **操作系统** | Fedora Server 40 |
| **HTTPS 服务器** | Caddy |
| **域名** | everdev.it |
| **管理** | Cockpit 和 SSH |
| **监控** | Grafana 与 InfluxDB |
| **警报** | InfluxDB 与 Telegram |

## 再见

做这个作品集让我意识到，WebAssembly 并没有消除难的部分：状态、路由、设计决策，一样都没少。它也让我更深入 Rust。

把它献给我的女儿 Sofia——她是我力量的来源，也是我不断提醒自己为什么要把事情做好的原因。
