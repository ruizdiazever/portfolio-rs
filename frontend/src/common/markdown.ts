/**
 * A small HTML to Markdown conversion for content negotiation.
 *
 * The site already publishes a curated Markdown brief, but an agent that asks
 * for `text/markdown` on a page should get that page, not a redirect. The
 * conversion keeps the structure an agent can act on (headings, lists, links,
 * images, code) and drops the chrome. It is deliberately not a general purpose
 * converter: it only has to handle the HTML this site renders.
 */

const BLOCK_TAGS =
  "p|div|section|article|header|footer|main|aside|figure|figcaption|dl|dt|dd|table|thead|tbody|tr|ul|ol";

function decodeEntities(value: string): string {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&middot;", "·")
    .replaceAll("&mdash;", "—")
    .replaceAll("&ndash;", "–")
    .replaceAll("&hellip;", "…")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function absolute(href: string, origin: string): string {
  if (!href) return href;
  if (/^[a-z][\da-z+.-]*:/i.test(href) || href.startsWith("#")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  return new URL(href, origin).href;
}

function inline(html: string, origin: string): string {
  return html
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
      const label = decodeEntities(text.replace(/<[^>]+>/g, "")).trim();
      return label ? `[${label}](${absolute(decodeEntities(href), origin)})` : "";
    })
    .replace(
      /<img\b[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi,
      (_, alt, src) => `![${decodeEntities(alt)}](${absolute(decodeEntities(src), origin)})`,
    )
    .replace(/<img\b[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, (_, src, alt) =>
      `![${decodeEntities(alt)}](${absolute(decodeEntities(src), origin)})`,
    )
    .replace(/<\/?(?:strong|b)\b[^>]*>/gi, "**")
    .replace(/<\/?(?:em|i)\b[^>]*>/gi, "_")
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, text) => `\`${text}\``)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
}

export function htmlToMarkdown(html: string, origin: string): string {
  let body = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<head\b[\s\S]*?<\/head>/gi, "")
    .replace(/<(script|style|svg|noscript|template|iframe)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|link|meta)\b[^>]*\/?>/gi, "");

  const main = /<main\b[\s\S]*?<\/main>/i.exec(body);
  if (main) body = main[0];

  body = body
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, text) => {
      const marker = "#".repeat(Number(level));
      return `\n\n${marker} ${text.trim()}\n\n`;
    })
    .replace(/<hr\b[^>]*>/gi, "\n\n---\n\n")
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => `\n- ${text.trim()}`)
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, text) => `\n\n> ${text.trim()}\n\n`)
    .replace(/<\/t[dh]>/gi, " | ")
    .replace(/<tr\b[^>]*>/gi, "\n| ")
    .replace(new RegExp(`<(?:${BLOCK_TAGS})\\b[^>]*>`, "gi"), "\n\n")
    .replace(new RegExp(`</(?:${BLOCK_TAGS})>`, "gi"), "\n\n");

  const text = decodeEntities(inline(body, origin))
    .split("\n")
    .map((line) => line.replace(/^[ \t]+|[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  return `${text}\n`;
}
