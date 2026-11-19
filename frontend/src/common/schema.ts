import { LOCALE } from "$lib/common/consts";
import { media } from "$lib/common/media";
import { seoConfig } from "$lib/common/seoConfig";
import type { Locale } from "$lib/common/siteRoutes";

export type FaqEntry = { question: string; answer: string };

export type ArticleMeta = {
  /** The article title without the site suffix the document title carries. */
  headline: string;
  /** ISO date the piece was published. */
  published: string;
  /** ISO date it last changed, same as `published` when it never did. */
  modified?: string;
  section?: string;
  tags?: string[];
};

export type SchemaContext = {
  origin: string;
  locale: Locale;
  /** Absolute URL of the page being described. */
  url: string;
  title: string;
  description: string;
  /** Absolute URL of the social image, kept as the article image too. */
  image: string;
};

export type SchemaNode = Record<string, unknown>;

export const personId = (origin: string) => `${origin}/#person`;
export const websiteId = (origin: string) => `${origin}/#website`;

/**
 * The graph every page shares. `Person` and `WebSite` carry stable @ids, and
 * every page node points back at them, so an agent can follow one entity.
 */
export function coreGraph({
  origin,
  locale,
  url,
  title,
  description,
  pageType = "WebPage",
}: SchemaContext & { pageType?: string }): SchemaNode[] {
  const home = `${origin}/${locale}`;
  const pageId = `${url}#webpage`;

  return [
    {
      "@type": "Person",
      "@id": personId(origin),
      name: "Ever Ruiz Diaz",
      url: home,
      image: media("site/avatar-192.webp"),
      jobTitle: "Software Engineer",
      description:
        "Software engineer in Rome. Rust, TypeScript and systems that have to work.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rome",
        addressCountry: "IT",
      },
      sameAs: [
        "https://www.linkedin.com/in/everdev/",
        "https://github.com/ruizdiazever",
        "https://x.com/everruizdiazo",
      ],
      knowsAbout: [
        "Rust",
        "TypeScript",
        "platform engineering",
        "distributed systems",
        "design systems",
        "Postgres",
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId(origin),
      url: home,
      name: seoConfig.siteName,
      inLanguage: LOCALE[locale],
      publisher: { "@id": personId(origin) },
    },
    {
      "@type": pageType,
      "@id": pageId,
      url,
      name: title,
      description,
      isPartOf: { "@id": websiteId(origin) },
      about: { "@id": personId(origin) },
      inLanguage: LOCALE[locale],
    },
  ];
}

export function blogPostingNode(
  context: SchemaContext,
  article: ArticleMeta,
): SchemaNode {
  return {
    "@type": "BlogPosting",
    "@id": `${context.url}#article`,
    headline: article.headline,
    description: context.description,
    url: context.url,
    mainEntityOfPage: { "@id": `${context.url}#webpage` },
    datePublished: article.published,
    dateModified: article.modified ?? article.published,
    image: context.image,
    inLanguage: LOCALE[context.locale],
    author: {
      "@type": "Person",
      "@id": personId(context.origin),
      name: "Ever Ruiz Diaz",
      url: `${context.origin}/en/sections/about`,
      image: media("site/avatar-192.webp"),
    },
    publisher: {
      "@type": "Person",
      "@id": personId(context.origin),
      name: "Ever Ruiz Diaz",
      url: `${context.origin}/en`,
      image: media("site/avatar-192.webp"),
    },
    ...(article.section ? { articleSection: article.section } : {}),
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
  };
}

/** The dates and tags a post carries, in the shape the graph wants. */
export function articleMeta(
  post: { title: Record<string, string>; date: Date; tags: string[] },
  locale: "en" | "zh",
): ArticleMeta {
  const published = post.date.toISOString();
  return {
    headline: post.title[locale],
    published,
    modified: published,
    section: post.tags[0],
    tags: post.tags,
  };
}

export type ProjectMeta = {
  name: string;
  repository?: string | null;
  technologies: string[];
};

export function projectNode(
  context: SchemaContext,
  project: ProjectMeta,
): SchemaNode {
  return {
    "@type": "SoftwareSourceCode",
    "@id": `${context.url}#project`,
    name: project.name,
    description: context.description,
    url: context.url,
    image: context.image,
    codeRepository: project.repository ?? undefined,
    programmingLanguage: project.technologies,
    author: { "@id": personId(context.origin) },
    isPartOf: { "@id": websiteId(context.origin) },
  };
}

export function faqNode(context: SchemaContext, entries: FaqEntry[]): SchemaNode {
  return {
    "@type": "FAQPage",
    "@id": `${context.url}#faq`,
    url: context.url,
    inLanguage: LOCALE[context.locale],
    isPartOf: { "@id": websiteId(context.origin) },
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
