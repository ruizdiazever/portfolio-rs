import { expect, test } from "@playwright/test";

/**
 * The contract behind the agent surfaces: the files an agent probes, the
 * headers it reads and the structured data it parses. Each test maps to a
 * user-visible promise in docs/agent-readiness.md.
 */

type Graph = { "@graph": Array<Record<string, unknown>> };

async function graph(page: import("@playwright/test").Page): Promise<Graph> {
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  return JSON.parse(jsonLd ?? "") as Graph;
}

test.describe("machine files", () => {
  test("sitemap.xml is a urlset and the index points at it", async ({
    request,
  }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()["content-type"]).toContain("xml");
    const xml = await sitemap.text();
    expect(xml).toContain("<urlset");
    expect(xml).toContain("/en/sections/privacy");

    const index = await request.get("/sitemap-index.xml");
    expect(index.status()).toBe(200);
    expect(await index.text()).toContain("<sitemapindex");
    expect(await index.text()).toContain("/sitemap.xml");
  });

  test("robots.txt allows agents and points at the sitemap", async ({
    request,
  }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(robots.headers()["content-type"]).toContain("text/plain");

    const body = await robots.text();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("User-agent: GPTBot");
    expect(body).toContain("User-agent: ClaudeBot");
    expect(body).not.toMatch(/Disallow:\s*\/\s*$/m);
    expect(body).toContain("Content-Signal: search=yes");
    expect(body).toContain("Content-Usage:");
    expect(body).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
  });

  test("AGENTS.md is a Markdown guide at the root", async ({ request }) => {
    const guide = await request.get("/AGENTS.md");
    expect(guide.status()).toBe(200);
    expect(guide.headers()["content-type"]).toContain("text/markdown");
    const body = await guide.text();
    expect(body).toContain("# Ever Ruiz Diaz");
    expect(body).toContain("## Machine files");
    expect(body).toContain("## Rules");
  });

  test("unknown paths answer with a real 404", async ({ request }) => {
    const missing = await request.get("/isagentready-missing-check");
    expect(missing.status()).toBe(404);
  });
});

test.describe("content negotiation", () => {
  test("returns Markdown for Accept: text/markdown", async ({ request }) => {
    const home = await request.get("/en", {
      headers: { Accept: "text/markdown" },
    });
    expect(home.status()).toBe(200);
    expect(home.headers()["content-type"]).toContain("text/markdown");
    expect(home.headers()["vary"]).toContain("Accept");
    const body = await home.text();
    expect(body).toContain("# Ever Ruiz Diaz");
    expect(body).not.toContain("<div");

    const root = await request.get("/", { headers: { Accept: "text/markdown" } });
    expect(root.status()).toBe(200);
    expect(root.headers()["content-type"]).toContain("text/markdown");
    expect(await root.text()).toContain("# Ever Ruiz Diaz");
  });

  test("still returns HTML to a browser", async ({ request }) => {
    const page = await request.get("/en", {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    expect(page.headers()["content-type"]).toContain("text/html");
    expect(page.headers()["vary"]).toContain("Accept");
  });
});

test.describe("headers", () => {
  test("every HTML page carries the CSP and the discovery links", async ({
    request,
  }) => {
    for (const path of [
      "/en",
      "/zh",
      "/en/sections/contact",
      "/en/blog/articles",
      "/about",
      "/privacy",
    ]) {
      const response = await request.get(path);
      const csp = response.headers()["content-security-policy"] ?? "";
      expect(csp, path).toContain("default-src 'self'");
      expect(csp, path).toContain("script-src");
      expect(csp, path).toContain("frame-ancestors 'none'");
      expect(response.headers()["link"], path).toContain('rel="describedby"');
    }
  });
});

test.describe("trust pages", () => {
  for (const [path, heading] of [
    ["/about", "About"],
    ["/contact", "Contact"],
    ["/privacy", "Privacy"],
  ] as const) {
    test(`${path} serves real content at the root`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveText(heading);
      await expect(page.locator("main p").first()).not.toBeEmpty();
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(canonical).toContain(`/en/sections/${heading.toLowerCase()}`);
      await expect(page.locator("footer")).toBeVisible();
    });
  }

  test("the footer links to all three from every page", async ({ page }) => {
    await page.goto("/en/blog/articles");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/en/sections/about",
    );
    await expect(footer.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/en/sections/contact",
    );
    await expect(footer.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/en/sections/privacy",
    );
  });
});

test.describe("structured data", () => {
  test("the home page answers its own questions with FAQPage", async ({
    page,
  }) => {
    await page.goto("/en");
    const nodes = (await graph(page))["@graph"];
    const faq = nodes.find((node) => node["@type"] === "FAQPage") as
      | { mainEntity: Array<{ name: string }> }
      | undefined;
    expect(faq).toBeDefined();

    for (const question of faq?.mainEntity ?? []) {
      await expect(
        page.locator("dt").filter({ hasText: question.name }).first(),
      ).toBeVisible();
    }
  });

  test("blog posts are BlogPosting with a named author", async ({ page }) => {
    await page.goto("/en/blog/organizations-using-rust");
    const nodes = (await graph(page))["@graph"];
    const article = nodes.find((node) => node["@type"] === "BlogPosting") as
      | Record<string, unknown>
      | undefined;
    expect(article).toBeDefined();
    expect(article?.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    const author = article?.author as
      | { "@type": string; name: string; url: string }
      | undefined;
    expect(author?.["@type"]).toBe("Person");
    expect(author?.name).toBe("Ever Ruiz Diaz");
    expect(author?.url).toContain("/sections/about");

    const url = await page
      .locator('meta[property="article:published_time"]')
      .getAttribute("content");
    expect(url).toBe(article?.datePublished);
  });

  test("projects describe their code", async ({ page }) => {
    await page.goto("/en/projects/berli-system");
    const nodes = (await graph(page))["@graph"];
    const project = nodes.find(
      (node) => node["@type"] === "SoftwareSourceCode",
    ) as Record<string, unknown> | undefined;
    expect(project?.name).toBe("BERLi");
    expect(Array.isArray(project?.programmingLanguage)).toBe(true);
  });

  test("every entity is linked by a stable @id", async ({ page }) => {
    await page.goto("/en");
    const nodes = (await graph(page))["@graph"];
    for (const node of nodes) {
      expect(String(node["@id"])).toMatch(/^https?:\/\/\S+#[\w-]+$/);
    }
    const person = nodes.find((node) => node["@type"] === "Person");
    const website = nodes.find((node) => node["@type"] === "WebSite") as
      | { publisher: { "@id": string } }
      | undefined;
    expect(website?.publisher["@id"]).toBe(person?.["@id"]);
  });
});

test.describe("accessibility surface", () => {
  test("each page has one h1, landmarks and no hidden focus", async ({
    page,
  }) => {
    for (const path of ["/en", "/en/sections/books", "/about", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("header")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
      const hidden = await page
        .locator("[aria-hidden='true']")
        .evaluateAll((nodes) =>
          nodes.filter(
            (node) =>
              node.matches(
                "a[href],button,input,select,textarea,[tabindex]",
              ) ||
              node.querySelector(
                "a[href],button,input,select,textarea,[tabindex]",
              ) !== null,
          ).length,
        );
      expect(hidden).toBe(0);
      const images = await page.locator("img").evaluateAll((nodes) =>
        nodes.filter((node) => !node.hasAttribute("alt")).length,
      );
      expect(images).toBe(0);
    }
  });
});
