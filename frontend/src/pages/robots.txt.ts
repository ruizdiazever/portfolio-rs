import type { APIRoute } from "astro";
import { seoConfig } from "$lib/common/seoConfig";

const AI_AGENTS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

/**
 * Retrieval and citation are welcome; training is not. The policy is declared
 * twice on purpose: Content-Signal for search and AI crawlers, Content-Usage
 * for the AIPREF draft. Neither blocks a fetch, so the agent checks that read
 * this file still see an open site.
 */
const getRobotsTxt = (origin: string) => {
  const base = origin.replace(/\/$/, "");
  const agents = AI_AGENTS.map(
    (agent) => `User-agent: ${agent}\nAllow: /`,
  ).join("\n\n");

  return `
User-agent: *
Allow: /

${agents}

Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference
Content-Usage: search=y, ai-input=y, train-ai=n

Sitemap: ${base}/sitemap.xml
`.trimStart();
};

export const GET: APIRoute = ({ site }) =>
  new Response(getRobotsTxt(site?.href ?? seoConfig.baseURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
