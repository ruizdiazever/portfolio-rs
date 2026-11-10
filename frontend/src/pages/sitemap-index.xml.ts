import type { APIRoute } from "astro";
import { seoConfig } from "$lib/common/seoConfig";

const LOCALES = ["en", "zh"] as const;

const PAGES = [
  "",
  "/sections/about",
  "/sections/books",
  "/sections/contact",
  "/sections/cv",
  "/blog/articles",
  "/blog/organizations-using-rust",
  "/blog/portfolio-wasm",
  "/projects/berli-system",
  "/projects/picu-iot",
  "/projects/raau-design",
];

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = () => {
  const origin = seoConfig.baseURL.replace(/\/$/, "");

  const urls = LOCALES.flatMap((locale) =>
    PAGES.map((page) => {
      const loc = `${origin}/${locale}${page}`;
      const alternates = LOCALES.map(
        (alt) =>
          `<xhtml:link rel="alternate" hreflang="${alt}" href="${escapeXml(`${origin}/${alt}${page}`)}"/>`,
      ).join("");
      return `<url><loc>${escapeXml(loc)}</loc>${alternates}</url>`;
    }),
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
