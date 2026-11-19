/**
 * One source of truth for the pages the site asks crawlers and agents to read.
 * The sitemap, robots.txt and the e2e spec all read this list, so a new page
 * cannot end up advertised in one place and missing from another.
 */

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

/** Root-relative paths without the locale prefix. */
export const INDEXABLE_PAGES = [
  "",
  "/sections/about",
  "/sections/books",
  "/sections/contact",
  "/sections/cv",
  "/sections/privacy",
  "/blog/articles",
  "/blog/hardware/minisforum-ms-01",
  "/blog/organizations-using-rust",
  "/blog/portfolio-wasm",
  "/projects/berli-system",
  "/projects/picu-iot",
  "/projects/raau-design",
] as const;

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** The canonical urlset. Served at /sitemap.xml and indexed by /sitemap-index.xml. */
export function sitemapUrlSet(origin: string): string {
  const base = origin.replace(/\/$/, "");
  const urls = LOCALES.flatMap((locale) =>
    INDEXABLE_PAGES.map((page) => {
      const alternates = LOCALES.map(
        (alt) =>
          `<xhtml:link rel="alternate" hreflang="${alt}" href="${escapeXml(`${base}/${alt}${page}`)}"/>`,
      ).join("");
      return `<url><loc>${escapeXml(`${base}/${locale}${page}`)}</loc>${alternates}</url>`;
    }),
  ).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
}

/** A real sitemap index, so /sitemap-index.xml stays useful for old links. */
export function sitemapIndex(origin: string): string {
  const base = origin.replace(/\/$/, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${escapeXml(`${base}/sitemap.xml`)}</loc></sitemap></sitemapindex>`;
}
