# 追求卓越之旅

欢迎来到我的WASM作品集，这是一个展示我使用[Rust](https://www.rust-lang.org/)和WebAssembly工作的前沿showcase，由[Leptos](https://leptos.dev/)框架驱动。

这个作品集不仅仅是项目的集合；它体现了我对科技行业卓越和创新的承诺。

# 技术栈

除了Leptos，我还使用了[Axum](https://github.com/tokio-rs/axum)来创建一个使用[RedisDB](https://redis.io/)进行持久化的微服务。我使用API来实现一些网页功能，如访问量或反馈。

# 设计

受[Vercel](https://vercel.com/)、[Nio](https://www.nio.com/)、[SpaceX](https://www.spacex.com/)、[Apple](https://www.apple.com/)和[Nothing](https://nothing.tech/)的成就启发，以[Guille](https://twitter.com/gzmoreira/)作为拉丁美洲软件开发者的榜样，我致力于达到顶级标准。

探索目前正在开发的部分，体现质量和精确性。每个元素都经过精心策划，以创造一个功能性和美观的数字空间。尽管有些部分仍在进行中，我很高兴与您分享这个旅程。

# 特点

### 通过SSR和水合作用增强性能
  - 通过服务器端渲染实现闪电般的初始页面加载。
  - 通过客户端水合作用实现与交互内容的无缝过渡。
  - 针对速度和用户交互进行优化。

### 交互式反馈系统
  - 清晰、直观的反馈界面。
  - 通过RedisDB和SMTP实现实时电子邮件通知。
  - 简化的用户参与过程。

### 高级分析与洞察
  - 个别帖子查看跟踪。
  - RedisDB中的集中访客分析。
  - 可视化参与度指标仪表板。

# 架构

![作品集架构](/assets/images/articles/portfolio_arch.svg)


# 监控

如上图所示，我使用了[Grafana](https://grafana.com/)和[InfluxDB](https://www.influxdata.com/)（另一个由Rust驱动的精彩项目）进行监控。对于不了解这些技术的人来说，InfluxDB是一个时间序列数据库，它有自己的数据收集系统，而Grafana作为这些数据的客户端。此外，InfluxDB有一个警报系统，我将其连接到Telegram机器人以随时了解任何事件。

![Grafana仪表板](/assets/images/articles/grafana.webp)

# 部署

我已经在自己心爱的迷你服务器上部署了整个作品集和周边各种技术。

技术成功的兴奋感显而易见。经过不懈努力，我已经在自己的服务器上启动了我的作品集和整个技术环境，这是一个真正的创新殿堂：

| 组件 | 名称 |
|-----------|------|
| **操作系统** | Fedora Server 40 |
| **HTTPS服务器** | Caddy |
| **域名** | SquareSpace |
| **管理** | Cockpit和SSH |
| **监控** | Grafana与InfluxDB |
| **警报** | InfluxDB与Telegram |

# 再见

制作这个作品集是一次美好的冒险，了解WASM世界并加强我的Rust知识，我把它献给我美丽的女儿Sofia，她是我力量的源泉和永恒的灵感！
