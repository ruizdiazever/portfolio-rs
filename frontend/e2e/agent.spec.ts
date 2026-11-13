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

  test("switches modes from the header and keeps the panel in flow", async ({
    page,
  }) => {
    await page.goto("/en");

    const toggle = page.locator("[data-agent-toggle]");
    const panel = page.locator("[data-agent-dock]");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(panel).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(panel).toBeVisible();
    await expect(page).toHaveURL(/mode=agent/);
    await expect(page.locator("#agent-mode-announcer")).toHaveText(
      "Agent lens on. Public context is ready.",
    );

    await page.waitForTimeout(250);
    const inFlow = await page.evaluate(() => {
      const dock = document.querySelector("[data-agent-dock]")!;
      const main = document.querySelector("main")!;
      return {
        dockBottom: dock.getBoundingClientRect().bottom,
        mainTop: main.getBoundingClientRect().top,
        overflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      };
    });
    expect(inFlow.mainTop).toBeGreaterThanOrEqual(inFlow.dockBottom - 1);
    expect(inFlow.overflow).toBe(false);

    await page.locator("[data-agent-close]").click();
    await expect(panel).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toBeFocused();
    await expect(page).not.toHaveURL(/mode=agent/);
  });

  test("survives 320px and exposes the copy receipt", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en?mode=agent");

    const toggle = page.locator("[data-agent-toggle]");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-agent-dock]")).toBeVisible();

    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.client);

    const copyButton = page.locator("[data-agent-copy]");
    await expect(copyButton).toBeVisible();
    const copyBox = await copyButton.boundingBox();
    expect(copyBox?.width).toBeGreaterThan(120);

    await copyButton.click();
    await expect(page.locator("#agent-copy-status")).toContainText(
      "Agent brief copied.",
    );
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("# Ever Ruiz Diaz");
  });

  test("machine mode transforms the page and keeps the header in one row", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en");
    await page.locator("[data-agent-toggle]").click();
    await page.waitForTimeout(250);

    await expect(page.locator(".machine-layer")).toBeVisible();
    await expect(page.locator("[data-agent-toggle] .agent-label")).toHaveCount(0);

    const machine = await page.evaluate(() => ({
      font: getComputedStyle(document.body).fontFamily,
      header: document.querySelector("#navbar")?.getBoundingClientRect().height,
      theme: document
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute("content"),
      overflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    }));
    expect(machine.font).toMatch(/mono/i);
    expect(machine.header).toBeLessThan(100);
    expect(machine.theme).toBe("#030805");
    expect(machine.overflow).toBe(false);

    await page.emulateMedia({ colorScheme: "light" });
    await expect(
      page.locator('meta[name="theme-color"]'),
    ).toHaveAttribute("content", "#f1f6ee");
  });

  test("agent panel survives 200 percent text scaling", async ({ page }) => {
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
    await expect(page.locator("[data-agent-dock]")).toBeVisible();
  });

  test("keeps the mode across pages and localizes the control", async ({
    page,
  }) => {
    await page.goto("/en?mode=agent");
    await page.goto("/en/sections/books");
    await expect(page.locator("[data-agent-dock]")).toBeVisible();
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
    await expect(page.locator("[data-agent-dock]")).toContainText("代理视角");
  });
});
