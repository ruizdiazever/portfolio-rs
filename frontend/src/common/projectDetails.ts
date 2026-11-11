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
      en: "A modular work OS for teams: projects, timesheets, HR, and notes in one async workspace.",
      zh: "面向团队的模块化工作操作系统：项目、工时、HR 与笔记，集中在一个异步工作空间。",
    },
    body: {
      en: "BERLi is a multi-tenant work OS for teams that run on projects, people, and time. Projects, timesheets, HR records, expenses, notes, documents, and reporting live in one workspace, with modules each customer can switch on or off. The API is Rust and Axum with SQLx and Postgres; Redis holds sessions and queues; the interface is Astro and Svelte. Identity, RBAC, and audit are shared across every module. The repositories are private while the platform is in progress.",
      zh: "BERLi 是面向团队的多租户工作操作系统，围绕项目、人员与时间运转。项目、工时、HR 档案、报销、笔记、文档与报表都在同一个工作空间里，客户可以按需开启或关闭模块。API 使用 Rust、Axum、SQLx 与 Postgres；Redis 负责会话与队列；界面使用 Astro 与 Svelte。身份、RBAC 与审计是所有模块共享的基础能力。平台仍在开发中，仓库暂为私有。",
    },
    stack: [
      "Rust",
      "Axum",
      "SQLx",
      "Postgres",
      "Redis",
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
