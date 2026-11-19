import { paraglideMiddleware } from "./paraglide/server.js";
import { defineMiddleware } from "astro:middleware";
import { agentMarkdown, getAgentManifest } from "$lib/common/agent";
import { htmlToMarkdown } from "$lib/common/markdown";

/**
 * Root files that are formats of their own. They skip the locale redirect and
 * the HTML headers; they are already what an agent asked for.
 */
const machinePaths = new Set([
  "/sitemap.xml",
  "/sitemap-index.xml",
  "/robots.txt",
  "/llms.txt",
  "/agent.md",
  "/agent.json",
  "/AGENTS.md",
]);

/**
 * The trust pages an agent probes at the root. paraglide rewrites an unprefixed
 * path to its locale, which would send /about to a page that does not exist, so
 * these render the English copy instead. Their canonical URL is the localized
 * page.
 */
const aliasPaths = new Set(["/about", "/contact", "/privacy"]);

const discoveryLinks = [
  '</llms.txt>; rel="describedby"',
  '</agent.md>; rel="alternate"; type="text/markdown"',
  '</agent.json>; rel="alternate"; type="application/json"',
].join(", ");

/**
 * The edge owns HSTS, nosniff, frame options and Referrer-Policy. CSP is the
 * one header it does not set, so the app owns it: it knows the inline theme
 * scripts, the self-hosted fonts, the S3 media origin and the Plausible host.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://plausible.berli.app",
  "style-src 'self' 'unsafe-inline'",
  // Repository avatars come from GitHub in the contributions island.
  "img-src 'self' data: blob: https://s3.berli.app https://avatars.githubusercontent.com https://plausible.berli.app",
  "font-src 'self' data:",
  "media-src 'self' https://s3.berli.app",
  "connect-src 'self' https://plausible.berli.app",
  "manifest-src 'self'",
  "worker-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

function quality(accept: string, type: string): number {
  for (const part of accept.split(",")) {
    const [media, ...params] = part.split(";").map((value) => value.trim());
    if (media?.toLowerCase() !== type) continue;
    for (const param of params) {
      const [key, value] = param.split("=");
      if (key?.trim().toLowerCase() === "q") return Number(value) || 0;
    }
    return 1;
  }
  return 0;
}

/** A browser asks for HTML; an agent that only asks for Markdown gets Markdown. */
export function prefersMarkdown(accept: string): boolean {
  const markdown = quality(accept, "text/markdown");
  return markdown > 0 && markdown >= quality(accept, "text/html");
}

function withVary(headers: Headers): Headers {
  const current = headers.get("Vary");
  const values = new Set(
    (current ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  values.add("Accept");
  headers.set("Vary", [...values].join(", "));
  return headers;
}

function htmlHeaders(headers: Headers): Headers {
  headers.set("Content-Security-Policy", contentSecurityPolicy);
  headers.set("Link", discoveryLinks);
  return withVary(headers);
}

function markdownResponse(body: string): Response {
  return new Response(body, {
    headers: htmlHeaders(
      new Headers({ "Content-Type": "text/markdown; charset=utf-8" }),
    ),
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (machinePaths.has(pathname)) return next();

  const wantsMarkdown =
    context.request.method === "GET" &&
    prefersMarkdown(context.request.headers.get("accept") ?? "");

  // The root is a redirect to the English home, so it has no HTML of its own.
  // Its Markdown form is the curated brief. The middleware owns the redirect so
  // a Markdown request to / is answered instead of redirected.
  if (pathname === "/") {
    if (wantsMarkdown) {
      return markdownResponse(agentMarkdown(getAgentManifest("en")));
    }
    return new Response(null, {
      status: 302,
      headers: { Location: `/en${context.url.search}` },
    });
  }

  const response = aliasPaths.has(pathname)
    ? await next()
    : await paraglideMiddleware(context.request, () => next());

  if (!(response.headers.get("content-type") ?? "").includes("text/html")) {
    return response;
  }

  if (wantsMarkdown) {
    const html = await response.text();
    return markdownResponse(htmlToMarkdown(html, context.url.origin));
  }

  htmlHeaders(response.headers);
  return response;
});
