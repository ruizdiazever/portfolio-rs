import { media } from "./media";
import { getPosts } from "./getPosts";
import { getProjectsFromJson } from "./getProjectCards";
import { books } from "$lib/components/sections/books/data";
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

const summary =
  "Software engineer in Rome. Rust, TypeScript and systems that have to work.";

const about =
  "Ever Ruiz Diaz is a software engineer in Rome. He builds Rust and TypeScript systems, platform APIs and interfaces. He is currently building BERLi, a work OS for projects, timesheets and HR. He writes about Rust, infrastructure and design, and keeps a public reading list.";

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${base}${path}`;
}

export function getAgentManifest(locale: AgentLocale = "en") {
  const posts = getPosts();
  const projects = getProjectsFromJson();
  const generatedAt = new Date().toISOString();
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

  const reading = books.map((book) => ({
    title: book.title,
    author: book.author,
    year: book.publishedYear,
    genre: book.genre,
    format: book.comic ? "comic" : book.paper ? "paper" : "digital",
    notes: locale === "zh" ? book.descriptionZh : book.description,
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
      role: "Software Engineer",
      summary,
      about,
      location: "Rome, Italy",
      image: media("site/avatar-192.webp"),
      knowsAbout,
      sameAs: [profileLinks.linkedin, profileLinks.github, profileLinks.x],
    },
    capabilities: ["profile", "selected-work", "writing", "reading", "contact"],
    endpoints: {
      llms: `${base}/llms.txt`,
      brief: `${base}/agent.md`,
      manifest: `${base}/agent.json`,
      sitemap: `${base}/sitemap-index.xml`,
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
      reading: reading.length,
    },
    work,
    writing,
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
  const work = manifest.work
    .map(
      (item) =>
        `### ${item.name}\n\n${item.description}\n\n- URL: ${item.url}\n- Repository: ${item.repository ?? "not public"}\n- Technologies: ${item.technologies.join(", ")}\n- Updated: ${item.updated}`,
    )
    .join("\n\n");

  const writing = manifest.writing
    .map(
      (item) =>
        `### ${item.name}\n\n${item.description}\n\n- URL: ${item.url}\n- Published: ${item.published}\n- Read: ${item.readMinutes} minutes\n- Tags: ${item.tags.join(", ")}`,
    )
    .join("\n\n");

  const reading = manifest.reading
    .map(
      (item) =>
        `- ${item.title} by ${item.author} (${item.year}). ${item.genre}, ${item.format}. ${item.notes}`,
    )
    .join("\n");

  return `# ${manifest.person.name}

> ${manifest.person.summary}

${manifest.person.about}

- Canonical: ${manifest.site.canonical}
- Languages: English, Chinese
- Role: ${manifest.person.role}
- Location: ${manifest.person.location}
- Updated: ${manifest.contentUpdatedAt}
- Generated: ${manifest.generatedAt}
- Profile image: ${manifest.person.image}

## Selected work

${work}

## Writing

${writing}

## Reading

${reading}

## Contact

- Contact page: ${manifest.contact.page}
- LinkedIn: ${manifest.contact.linkedin}
- GitHub: ${manifest.contact.github}
- X: ${manifest.contact.x}

## Machine files

- llms.txt: ${manifest.endpoints.llms}
- Agent brief: ${manifest.endpoints.brief}
- Structured manifest: ${manifest.endpoints.manifest}
- RSS: ${manifest.endpoints.feeds.en.rss}
- JSON Feed: ${manifest.endpoints.feeds.en.json}
- Sitemap: ${manifest.endpoints.sitemap}
- Robots and content policy: ${manifest.endpoints.robots}

## Use

These facts are public and may be used as a reference with a link to the source.
Do not use them for AI training. This is a static public profile; it does not
expose a model, a chat endpoint, an A2A endpoint or an MCP server.

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

- [Agent brief](${manifest.endpoints.brief}): A complete plain-text profile with work, writing, reading and contact.
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
