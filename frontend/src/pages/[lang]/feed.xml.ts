import type { APIRoute } from "astro";
import { getPosts } from "$lib/common/getPosts";
import { seoConfig } from "$lib/common/seoConfig";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = ({ params }) => {
  const lang = params.lang === "zh" ? "zh" : "en";
  const base = seoConfig.baseURL.replace(/\/$/, "");
  const posts = getPosts().sort((a, b) => b.date.getTime() - a.date.getTime());
  const items = posts
    .map((post) => {
      const url = `${base}/${lang}${post.url}`;
      return `<item><title>${escapeXml(post.title[lang])}</title><link>${escapeXml(url)}</link><guid>${escapeXml(url)}</guid><pubDate>${post.date.toUTCString()}</pubDate><description>${escapeXml(post.description[lang])}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Ever Ruiz Diaz</title><link>${escapeXml(`${base}/${lang}`)}</link><description>Notes on Rust, systems and design.</description><language>${lang}</language><atom:link href="${escapeXml(`${base}/${lang}/feed.xml`)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
