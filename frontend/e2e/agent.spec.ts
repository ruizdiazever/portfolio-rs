import { expect, test } from "@playwright/test";

test.describe("agent surfaces", () => {
  test("publishes a brief, manifest, feeds and discovery hints", async ({
    request,
  }) => {
    const brief = await request.get("/agent.md");
    expect(brief.status()).toBe(200);
    expect(brief.headers()["content-type"]).toContain("text/markdown");
    expect(await brief.text()).toContain("# Ever Ruiz Diaz");

    const llms = await request.get("/llms.txt");
    expect(llms.status()).toBe(200);
    expect(await llms.text()).toContain("## Agent files");

    const manifestResponse = await request.get("/agent.json");
    expect(manifestResponse.status()).toBe(200);
    const manifest = await manifestResponse.json();
    expect(manifest.schemaVersion).toBe("1.0");
    expect(manifest.counts.projects).toBeGreaterThan(0);
    expect(manifest.endpoints.llms).toContain("/llms.txt");
    expect(manifest.person.image).toContain("/site/avatar-192.webp");
    expect(manifest.signals.aiTrain).toBe(false);

    const rss = await request.get("/en/feed.xml");
    expect(rss.status()).toBe(200);
    expect(rss.headers()["content-type"]).toContain("application/rss+xml");
    expect(await rss.text()).toContain("<rss");

    const jsonFeed = await request.get("/zh/feed.json");
    expect(jsonFeed.status()).toBe(200);
    expect((await jsonFeed.json()).version).toContain("jsonfeed.org");

    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain(
      "Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference",
    );
  });

  test("machine files are not locale-redirected", async ({ page }) => {
    for (const path of [
      "/sitemap-index.xml",
      "/robots.txt",
      "/llms.txt",
      "/agent.md",
      "/agent.json",
    ]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(path);
    }
  });

  test("exposes agent links, JSON-LD and a Link header", async ({
    page,
    request,
  }) => {
    await page.goto("/en");

    await expect(page.locator('link[rel="describedby"]')).toHaveAttribute(
      "href",
      "/llms.txt",
    );
    await expect(
      page.locator('link[rel="alternate"][href="/agent.md"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('link[rel="alternate"][href="/en/feed.xml"]'),
    ).toHaveCount(1);

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const graph = (
      JSON.parse(jsonLd ?? "") as {
        "@graph": Array<Record<string, unknown>>;
      }
    )["@graph"];
    const person = graph.find((node) => node["@type"] === "Person");
    expect(person).toBeDefined();
    expect(String(person?.image)).toContain("/site/avatar-192.webp");
    expect(graph.some((node) => node["@type"] === "ProfilePage")).toBe(true);

    const response = await request.get("/en");
    expect(response.headers()["link"]).toContain('rel="describedby"');
    expect(response.headers()["link"]).toContain("/agent.md");
  });

  test("switches to a plain Markdown document and back", async ({ page }) => {
    await page.goto("/en");

    const toggle = page.locator("[data-agent-toggle]");
    const view = page.locator("[data-agent-view]");
    const human = page.locator(".human-view");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(view).toBeHidden();
    await expect(human).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(view).toBeVisible();
    await expect(human).toBeHidden();
    await expect(page.locator("footer")).toBeHidden();
    await expect(page).toHaveURL(/mode=agent/);
    await expect(page.locator("#agent-mode-announcer")).toHaveText(
      "Agent lens on. Public context is ready.",
    );
    await expect(page.locator(".agent-plain-text")).toContainText(
      "# Ever Ruiz Diaz",
    );
    await expect(page.locator(".agent-plain-text")).toContainText("## Selected work");

    await page.locator("[data-agent-close]").click();
    await expect(view).toBeHidden();
    await expect(human).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toBeFocused();
    await expect(page).not.toHaveURL(/mode=agent/);
  });

  test("localizes the agent document in Chinese", async ({ page }) => {
    await page.goto("/zh?mode=agent");

    const document = page.locator(".agent-plain-text");
    await expect(document).toContainText("## 精选工作");
    await expect(document).toContainText("常驻罗马的软件工程师");
    await expect(document).toContainText("## 使用边界");
    await expect(document).not.toContainText("## Selected work");
    await expect(page.locator(".agent-text-toolbar")).toContainText(
      "agent.md (EN)",
    );
  });

  test("header icons morph between their states", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/en");

    const themePath = page.locator("#theme-morph path");
    const agentPath = page.locator("#agent-morph path");
    await expect(page.locator("#theme-morph")).toHaveAttribute(
      "reduced-motion",
      "user",
    );
    const themeBefore = await themePath.getAttribute("d");
    const agentBefore = await agentPath.getAttribute("d");

    await page.locator("#theme-toggle").click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect
      .poll(() => themePath.getAttribute("d"))
      .not.toBe(themeBefore);

    await page.locator("[data-agent-toggle]").click();
    await expect(page.locator("[data-agent-view]")).toBeVisible();
    await expect
      .poll(() => agentPath.getAttribute("d"))
      .not.toBe(agentBefore);
  });

  test("the header control matches the other icon buttons", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en");

    const agent = await page.locator("[data-agent-toggle]").boundingBox();
    const theme = await page.locator("#theme-toggle").boundingBox();
    expect(agent?.width).toBe(theme?.width);
    expect(agent?.height).toBe(theme?.height);
    await expect(page.locator("[data-agent-toggle] .agent-label")).toHaveCount(0);
  });

  test("agent view is plain text at 320px with a copy receipt", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en?mode=agent");

    const toggle = page.locator("[data-agent-toggle]");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-agent-view]")).toBeVisible();
    await expect(page.locator(".human-view")).toBeHidden();

    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.client);

    const plainText = page.locator(".agent-plain-text");
    await expect(plainText).toContainText("# Ever Ruiz Diaz");
    expect(await plainText.evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/mono/i);

    const copyButton = page.locator("[data-agent-copy]");
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(page.locator("#agent-copy-status")).toContainText(
      "Agent brief copied.",
    );
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("# Ever Ruiz Diaz");
  });

  test("agent view survives 200 percent text scaling", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en?mode=agent");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });

    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.client);
    await expect(page.locator("[data-agent-copy]")).toBeVisible();
    await expect(page.locator("[data-agent-view]")).toBeVisible();
  });

  test("keeps the mode across pages and localizes the control", async ({
    page,
  }) => {
    await page.goto("/en?mode=agent");
    await page.goto("/en/sections/books");
    await expect(page.locator("[data-agent-view]")).toBeVisible();
    await expect(page.locator("[data-agent-toggle]")).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.goto("/zh");
    const toggle = page.locator("[data-agent-toggle]");
    await expect(toggle).toHaveAccessibleName(/退出代理视角/);
    await toggle.click();
    await expect(toggle).toHaveAccessibleName(/进入代理视角/);
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toHaveAccessibleName(/退出代理视角/);
    await expect(page.locator("[data-agent-view]")).toContainText("代理视角");
  });
});
