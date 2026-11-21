import { media } from "./media";
import { getPosts } from "./getPosts";
import { getProjectsFromJson } from "./getProjectCards";
import { books } from "$lib/components/sections/library/books";
import { games, steamPoster, steamStore } from "$lib/components/sections/library/games";
import { seoConfig } from "./seoConfig";

export type AgentLocale = "en" | "zh";

const base = seoConfig.baseURL.replace(/\/$/, "");

const profileLinks = {
  linkedin: "https://www.linkedin.com/in/everdev/",
  github: "https://github.com/ruizdiazever",
  x: "https://x.com/everruizdiazo",
};

const knowsAbout = [
  "Rust",
  "TypeScript",
  "platform engineering",
  "distributed systems",
  "design systems",
  "Postgres",
];

const profileCopy = {
  en: {
    summary:
      "Software engineer in Rome. Rust, TypeScript and systems that have to work.",
    about:
      "Ever Ruiz Diaz is a software engineer in Rome. He builds Rust and TypeScript systems, platform APIs and interfaces. He is currently building BERLi, a work OS for projects, timesheets and HR. He writes about Rust, infrastructure and design, and keeps a public library of books and games.",
    role: "Software Engineer",
    location: "Rome, Italy",
    languages: "English, Chinese",
  },
  zh: {
    summary:
      "常驻罗马的软件工程师，做 Rust、TypeScript 和必须可靠运行的系统。",
    about:
      "Ever Ruiz Diaz 是常驻罗马的软件工程师，构建 Rust 和 TypeScript 系统、平台 API 与界面。他目前在做 BERLi，一个面向项目、工时和人事的工作操作系统。他写 Rust、基础设施和设计，并维护一个公开的书与游戏收藏。",
    role: "软件工程师",
    location: "罗马，意大利",
    languages: "英文、中文",
  },
} as const;

const genreZh: Record<string, string> = {
  "Science Fiction": "科幻",
  "Literary Fiction": "文学",
  "Political Satire": "政治讽刺",
  "Technical Paper": "技术论文",
  Fantasy: "奇幻",
  Biography: "传记",
  Technical: "技术",
  Comics: "漫画",
  Comedy: "喜剧",
  Adventure: "冒险",
  FPS: "第一人称射击",
  VR: "VR",
  Platformer: "平台跳跃",
  RPG: "角色扮演",
  Puzzle: "解谜",
  Narrative: "叙事",
};

const formatZh = {
  comic: "漫画",
  paper: "纸质",
  digital: "电子",
} as const;

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${base}${path}`;
}

export function getAgentManifest(locale: AgentLocale = "en") {
  const posts = getPosts();
  const projects = getProjectsFromJson();
  const generatedAt = new Date().toISOString();
  const copy = profileCopy[locale];
  const dates = [...posts.map((post) => post.date), ...projects.map((project) => project.date)];
  const contentUpdatedAt = new Date(Math.max(...dates.map((date) => date.getTime())))
    .toISOString()
    .slice(0, 10);

  const work = projects.map((project) => ({
    name: project.title,
    description: project.description[locale],
    url: absolute(`/${locale}${project.url}`),
    repository: project.repository || null,
    technologies: project.tech,
    updated: project.date.toISOString().slice(0, 10),
  }));

  const writing = posts.map((post) => ({
    name: post.title[locale],
    description: post.description[locale],
    url: absolute(`/${locale}${post.url}`),
    published: post.date.toISOString().slice(0, 10),
    readMinutes: post.readTime,
    tags: post.tags,
  }));

  const reading = books.map((book) => {
    const format = book.comic ? "comic" : book.paper ? "paper" : "digital";
    return {
      title: book.title,
      author: book.author,
      year: book.publishedYear,
      genre: locale === "zh" ? (genreZh[book.genre] ?? book.genre) : book.genre,
      format:
        locale === "zh"
          ? formatZh[format as keyof typeof formatZh]
          : format,
      notes: locale === "zh" ? book.descriptionZh : book.description,
    };
  });

  const played = games.map((game) => ({
    title: game.title,
    developer: game.developer,
    year: game.year,
    genre: locale === "zh" ? (genreZh[game.genre] ?? game.genre) : game.genre,
    notes: locale === "zh" ? game.descriptionZh : game.description,
    store: steamStore(game.steamAppId),
    poster: steamPoster(game.steamAppId),
    status: "finished",
  }));

  return {
    schemaVersion: "1.0",
    generatedAt,
    contentUpdatedAt,
    site: {
      name: "Ever Ruiz Diaz",
      url: `${base}/${locale}`,
      canonical: `${base}/${locale}`,
      locales: ["en", "zh"],
      language: locale,
    },
    person: {
      name: "Ever Ruiz Diaz",
      role: copy.role,
      summary: copy.summary,
      about: copy.about,
      location: copy.location,
      image: media("site/avatar-192.webp"),
      knowsAbout,
      sameAs: [profileLinks.linkedin, profileLinks.github, profileLinks.x],
    },
    capabilities: [
      "profile",
      "selected-work",
      "writing",
      "games",
      "reading",
      "contact",
    ],
    endpoints: {
      llms: `${base}/llms.txt`,
      brief: `${base}/agent.md`,
      manifest: `${base}/agent.json`,
      sitemap: `${base}/sitemap.xml`,
      robots: `${base}/robots.txt`,
      feeds: {
        en: { rss: `${base}/en/feed.xml`, json: `${base}/en/feed.json` },
        zh: { rss: `${base}/zh/feed.xml`, json: `${base}/zh/feed.json` },
      },
      contact: absolute(`/${locale}/sections/contact`),
    },
    counts: {
      projects: work.length,
      writing: writing.length,
      games: played.length,
      reading: reading.length,
    },
    work,
    writing,
    games: played,
    reading,
    contact: {
      page: absolute(`/${locale}/sections/contact`),
      linkedin: profileLinks.linkedin,
      github: profileLinks.github,
      x: profileLinks.x,
    },
    signals: {
      search: true,
      aiInput: true,
      aiTrain: false,
      use: "reference",
    },
    notes: {
      model: null,
      chat: false,
      privateData: false,
      protocols: "static-profile; no A2A or MCP endpoint",
    },
  };
}

export type AgentManifest = ReturnType<typeof getAgentManifest>;

export function agentMarkdown(manifest: AgentManifest): string {
  const zh = manifest.site.language === "zh";
  const language = zh ? "zh" : "en";
  const labels = zh
    ? {
        canonical: "规范地址",
        languages: "语言",
        role: "角色",
        location: "所在地",
        updated: "内容更新",
        generated: "生成时间",
        profileImage: "头像",
        work: "精选工作",
        writing: "写作",
        games: "游戏",
        reading: "阅读",
        contact: "联系",
        machineFiles: "机器可读文件",
        use: "使用边界",
        url: "链接",
        repository: "仓库",
        technologies: "技术",
        notPublic: "未公开",
        published: "发布",
        developer: "开发商",
        released: "发行",
        genre: "类型",
        store: "商店",
        finished: "已通关",
        read: "阅读",
        minutes: "分钟",
        tags: "标签",
        contactPage: "联系页面",
        agentBrief: "代理简报（英文）",
        manifest: "结构化清单（英文）",
        rss: "RSS（中文）",
        jsonFeed: "JSON Feed（中文）",
        sitemap: "站点地图",
        robots: "爬虫与内容政策",
        useText:
          "这些事实是公开的，可以在链接到来源的前提下作为参考。不要把它们用于 AI 训练。这是一个静态公开档案，不提供模型、对话接口、A2A 端点或 MCP 服务。",
      }
    : {
        canonical: "Canonical",
        languages: "Languages",
        role: "Role",
        location: "Location",
        updated: "Updated",
        generated: "Generated",
        profileImage: "Profile image",
        work: "Selected work",
        writing: "Writing",
        games: "Games",
        reading: "Reading",
        contact: "Contact",
        machineFiles: "Machine files",
        use: "Use",
        url: "URL",
        repository: "Repository",
        technologies: "Technologies",
        notPublic: "not public",
        published: "Published",
        developer: "Developer",
        released: "Released",
        genre: "Genre",
        store: "Store",
        finished: "Finished",
        read: "Read",
        minutes: "minutes",
        tags: "Tags",
        contactPage: "Contact page",
        agentBrief: "Agent brief",
        manifest: "Structured manifest",
        rss: "RSS",
        jsonFeed: "JSON Feed",
        sitemap: "Sitemap",
        robots: "Robots and content policy",
        useText:
          "These facts are public and may be used as a reference with a link to the source. Do not use them for AI training. This is a static public profile; it does not expose a model, a chat endpoint, an A2A endpoint or an MCP server.",
      };

  const work = manifest.work
    .map(
      (item) =>
        `### ${item.name}\n\n${item.description}\n\n- ${labels.url}: ${item.url}\n- ${labels.repository}: ${item.repository ?? labels.notPublic}\n- ${labels.technologies}: ${item.technologies.join(", ")}\n- ${labels.updated}: ${item.updated}`,
    )
    .join("\n\n");

  const writing = manifest.writing
    .map(
      (item) =>
        `### ${item.name}\n\n${item.description}\n\n- ${labels.url}: ${item.url}\n- ${labels.published}: ${item.published}\n- ${labels.read}: ${item.readMinutes} ${labels.minutes}\n- ${labels.tags}: ${item.tags.join(", ")}`,
    )
    .join("\n\n");

  const played = manifest.games
    .map(
      (item) =>
        `### ${item.title}\n\n${item.notes}\n\n- ${labels.developer}: ${item.developer}\n- ${labels.released}: ${item.year}\n- ${labels.genre}: ${item.genre}\n- ${labels.store}: ${item.store}`,
    )
    .join("\n\n");

  const reading = manifest.reading
    .map((item) =>
      zh
        ? `- ${item.title}，${item.author} 著（${item.year}）。${item.genre}，${item.format}。${item.notes}`
        : `- ${item.title} by ${item.author} (${item.year}). ${item.genre}, ${item.format}. ${item.notes}`,
    )
    .join("\n");

  const feeds = manifest.endpoints.feeds[language];

  return `# ${manifest.person.name}

> ${manifest.person.summary}

${manifest.person.about}

- ${labels.canonical}: ${manifest.site.canonical}
- ${labels.languages}: ${zh ? profileCopy.zh.languages : profileCopy.en.languages}
- ${labels.role}: ${manifest.person.role}
- ${labels.location}: ${manifest.person.location}
- ${labels.updated}: ${manifest.contentUpdatedAt}
- ${labels.generated}: ${manifest.generatedAt}
- ${labels.profileImage}: ${manifest.person.image}

## ${labels.work}

${work}

## ${labels.writing}

${writing}

## ${labels.games}

${played}

## ${labels.reading}

${reading}

## ${labels.contact}

- ${labels.contactPage}: ${manifest.contact.page}
- LinkedIn: ${manifest.contact.linkedin}
- GitHub: ${manifest.contact.github}
- X: ${manifest.contact.x}

## ${labels.machineFiles}

- llms.txt: ${manifest.endpoints.llms}
- ${labels.agentBrief}: ${manifest.endpoints.brief}
- ${labels.manifest}: ${manifest.endpoints.manifest}
- ${labels.rss}: ${feeds.rss}
- ${labels.jsonFeed}: ${feeds.json}
- ${labels.sitemap}: ${manifest.endpoints.sitemap}
- ${labels.robots}: ${manifest.endpoints.robots}

## ${labels.use}

${labels.useText}

Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference
`;
}

export function llmsText(manifest: AgentManifest): string {
  const work = manifest.work
    .map((item) => `- [${item.name}](${item.url}): ${item.description}`)
    .join("\n");
  const writing = manifest.writing
    .map(
      (item) =>
        `- [${item.name}](${item.url}): ${item.description} (${item.published}, ${item.readMinutes} min)`,
    )
    .join("\n");
  const played = manifest.games
    .map(
      (item) =>
        `- [${item.title}](${item.store}): ${item.notes} (${item.developer}, ${item.year})`,
    )
    .join("\n");
  const reading = manifest.reading
    .map(
      (item) =>
        `- ${item.title} by ${item.author} (${item.year}): ${item.genre}`,
    )
    .join("\n");

  return `# ${manifest.person.name}

> ${manifest.person.summary}

This is the public, machine-readable entry point for the portfolio of Ever Ruiz
Diaz. It maps the stable facts an agent needs to understand the person, the
selected work and the writing without scraping the visual site.

## Agent files

- [Agent brief](${manifest.endpoints.brief}): A complete plain-text profile with work, writing, games, reading and contact.
- [Structured manifest](${manifest.endpoints.manifest}): The same facts as validated JSON.
- [RSS feed](${manifest.endpoints.feeds.en.rss}): English writing feed.
- [JSON Feed](${manifest.endpoints.feeds.en.json}): English writing feed as JSON.
- [Chinese RSS](${manifest.endpoints.feeds.zh.rss}): Chinese writing feed.
- [Sitemap](${manifest.endpoints.sitemap}): Every indexable page.
- [Robots and content policy](${manifest.endpoints.robots}): Crawling and content signals.

## Selected work

${work}

## Writing

${writing}

## Games

${played}

## Reading

${reading}

## Contact

- [Contact page](${manifest.contact.page})
- [LinkedIn](${manifest.contact.linkedin})
- [GitHub](${manifest.contact.github})
- [X](${manifest.contact.x})

## Use

Public facts may be retrieved and referenced with a link to the source. Do not
use them for AI training. No private data is exposed. This portfolio does not
operate an A2A or MCP endpoint.

Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference
`;
}

/**
 * The root AGENTS.md this site serves. It is written for an agent that lands
 * here without the repository, so it answers what the site is, where the
 * stable facts are and what it may do, in that order.
 */
export function agentsGuide(manifest: AgentManifest): string {
  return `# Ever Ruiz Diaz, site guide for agents

> ${manifest.person.summary}

${manifest.person.about}

- Canonical: ${manifest.site.canonical}
- Role: ${manifest.person.role}
- Location: ${manifest.person.location}
- Languages: ${profileCopy.en.languages}
- Updated: ${manifest.contentUpdatedAt}
- Generated: ${manifest.generatedAt}

## What this site is

A static public profile: work, writing, and a library of books and games. The HTML pages are
server rendered and readable without JavaScript. Every page carries JSON-LD with
a Person, a WebSite and the entity for that page.

## Machine files

- [Agent brief](${manifest.endpoints.brief}): the complete profile as Markdown.
- [Agent manifest](${manifest.endpoints.manifest}): the same facts as JSON.
- [llms.txt](${manifest.endpoints.llms}): a short map of the site.
- [Sitemap](${manifest.endpoints.sitemap}): every indexable page.
- [Robots and content policy](${manifest.endpoints.robots}): crawling rules and content signals.
- [English RSS](${manifest.endpoints.feeds.en.rss}) and [English JSON Feed](${manifest.endpoints.feeds.en.json}).
- [Chinese RSS](${manifest.endpoints.feeds.zh.rss}) and [Chinese JSON Feed](${manifest.endpoints.feeds.zh.json}).

## Reading the pages

Send \`Accept: text/markdown\` to any page to get a Markdown representation
instead of HTML. Responses carry \`Vary: Accept\`. \`/robots.txt\` declares
\`search=yes, ai-input=yes, ai-train=no, use=reference\`.

## Doing things here

There is nothing to execute, buy or book. The only action is contact:

- [Contact page](${manifest.contact.page})
- [LinkedIn](${manifest.contact.linkedin})
- [GitHub](${manifest.contact.github})
- [X](${manifest.contact.x})

The site exposes no MCP server, no A2A agent card and no account system. Do not
invent one.

## Rules

- Reference these facts with a link to the canonical URL.
- Do not use the content for AI training.
- Do not look for private data. None is published, and the feedback form is the
  only write path.

Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference
Content-Usage: search=y, ai-input=y, train-ai=n
`;
}
