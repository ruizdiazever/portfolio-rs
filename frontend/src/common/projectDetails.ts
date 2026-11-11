export interface ProjectDetail {
  title: string;
  tagline: { en: string; zh: string };
  body: { en: string; zh: string };
  stack: string[];
  repository?: string;
}

export const projectDetails: Record<string, ProjectDetail> = {
  "berli-system": {
    title: "BERLi",
    tagline: {
      en: "A Rust-first platform for identity, credentials, and operations.",
      zh: "以 Rust 为核心的身份、凭证与运维平台。",
    },
    body: {
      en: "BERLi brings credentials, identities, and operational workflows into one place. The API is Axum and async-graphql; Postgres and Redis hold state; Meilisearch handles search; the interface is Astro and Svelte. The repositories are private while the platform is in progress.",
      zh: "BERLi 把凭证、身份与运维流程放在同一个地方。API 使用 Axum 与 async-graphql；Postgres 与 Redis 保存状态；Meilisearch 负责搜索；界面使用 Astro 与 Svelte。平台仍在开发中，仓库暂为私有。",
    },
    stack: [
      "Rust",
      "Axum",
      "async-graphql",
      "Postgres",
      "Redis",
      "Meilisearch",
      "Astro",
      "Svelte",
      "Docker",
      "Proxmox",
      "Caddy",
    ],
    repository: "https://github.com/berli-app",
  },
  "picu-iot": {
    title: "Picu IoT",
    tagline: {
      en: "An IoT stack built in Rust.",
      zh: "用 Rust 构建的 IoT 技术栈。",
    },
    body: {
      en: "Picu is an IoT stack built around Rust: an Axum and GraphQL API, Postgres and Redis for state, and a Svelte dashboard. The stack is small: an API, a state layer, and a dashboard.",
      zh: "Picu 是一套以 Rust 为核心的 IoT 技术栈：Axum 与 GraphQL API、Postgres 与 Redis 状态层，以及 Svelte 仪表盘。整套系统保持精简：一个 API、一层状态、一个仪表盘。",
    },
    stack: ["Rust", "Axum", "GraphQL", "Postgres", "Redis", "Svelte", "Docker"],
  },
  "raau-design": {
    title: "RAAU Design",
    tagline: {
      en: "The digital home for an engineering design studio.",
      zh: "RAAU 工程设计工作室的数字主页。",
    },
    body: {
      en: "RAAU is an engineering design studio. This is its digital home: a quiet, fast site built to let the work speak. The site is still in progress.",
      zh: "RAAU 是一家工程设计工作室。这是它的数字主页：安静、快速，让作品自己说话。网站仍在进行中。",
    },
    stack: [
      "Astro",
      "Svelte",
      "Rust",
      "Postgres",
      "Redis",
      "Meilisearch",
      "Docker",
      "Proxmox",
      "Caddy",
    ],
  },
};
