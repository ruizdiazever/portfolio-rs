import type { APIRoute } from "astro";
import { getPosts } from "$lib/common/getPosts";
import { seoConfig } from "$lib/common/seoConfig";

export const GET: APIRoute = ({ params }) => {
  const lang = params.lang === "zh" ? "zh" : "en";
  const base = seoConfig.baseURL.replace(/\/$/, "");
  const posts = getPosts().sort((a, b) => b.date.getTime() - a.date.getTime());
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Ever Ruiz Diaz",
    home_page_url: `${base}/${lang}`,
    feed_url: `${base}/${lang}/feed.json`,
    description: "Notes on Rust, systems and design.",
    language: lang,
    items: posts.map((post) => ({
      id: `${base}/${lang}${post.url}`,
      url: `${base}/${lang}${post.url}`,
      title: post.title[lang],
      summary: post.description[lang],
      date_published: post.date.toISOString(),
      tags: post.tags,
    })),
  };
  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
};
