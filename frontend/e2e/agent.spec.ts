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

  test("switches to the machine view and back", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    const entry = page.locator("[data-machine-toggle]");
    const machine = page.locator("[data-machine-view]");
    const human = page.locator(".human-view");
    await expect(entry).toHaveAccessibleName("View as machine");
    await expect(machine).toBeHidden();
    await expect(human).toBeVisible();

    await entry.click();
    await expect(page.locator("html")).toHaveAttribute("data-view", "machine");
    await expect(machine).toBeVisible();
    await expect(human).toBeHidden();
    await expect(page.locator("body > header")).toBeHidden();
    await expect(page.locator("footer")).toBeHidden();
    await expect(page).toHaveURL(/view=machine/);
    await expect(page.locator("#machine-announcer")).toHaveText(
      "Machine view on. Public context is ready.",
    );
    await expect(page.locator("[data-machine-body]")).toContainText(
      "# Ever Ruiz Diaz",
    );
    await expect(page.locator("[data-machine-body]")).toContainText(
      "## Selected work",
    );
    await expect(
      page.locator('[data-machine-body] a[href*="/en/projects/"]').first(),
    ).toHaveAttribute("href", /view=human/);
    await expect(page.locator('[data-view-switch="machine"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator('[data-view-switch="human"]')).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    const keys = page.locator('.view-switch-kbd [data-slot="kbd"]');
    await expect(keys).toHaveCount(2);
    await expect(keys.first()).toHaveText("⇧");
    await expect(keys.nth(1)).toHaveText("M");

    await page.locator('[data-view-switch="human"]').click();
    await expect(machine).toBeHidden();
    await expect(human).toBeVisible();
    await expect(page.locator("body > header")).toBeVisible();
    await expect(page).not.toHaveURL(/view=machine/);
    await expect(entry).toBeFocused();
  });

  test("forces dark and restores the reader theme", async ({ page }) => {
    await page.emulateMedia({
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    await page.goto("/en?view=machine");

    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("html")).toHaveAttribute("data-view", "machine");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(8, 9, 10)",
    );
    await expect(page.locator("body > header")).toBeHidden();
    await expect(page.locator("footer")).toBeHidden();
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).colorScheme,
      ),
    ).toBe("dark");

    await page.locator('[data-view-switch="human"]').click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).colorScheme,
      ),
    ).toBe("light dark");
  });

  test("canonicalizes the old agent URL", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en?mode=agent");

    await expect(page).toHaveURL(/\/en\?view=machine$/);
    await expect(page.locator("html")).toHaveAttribute("data-view", "machine");
    await expect(page.locator('[data-view-switch="machine"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-view")),
    ).toBe("machine");
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-agent-mode")),
    ).toBeNull();
  });

  test("types the document in green, then settles neutral", async ({
    page,
  }) => {
    await page.goto("/en");
    await page.locator("[data-machine-toggle]").click();

    const machine = page.locator("[data-machine-view]");
    await expect(machine).toHaveClass(/is-typing/);
    await expect(page.locator(".machine-kicker")).toHaveCSS(
      "color",
      "rgb(92, 255, 138)",
    );
    await expect(page.locator("[data-machine-body]")).toHaveCSS(
      "color",
      "rgb(92, 255, 138)",
    );
    await expect(machine).toHaveClass(/is-settling/, { timeout: 6_000 });
    await expect(machine).not.toHaveClass(/is-settling/, { timeout: 6_000 });
    await expect(machine).not.toHaveClass(/is-typing/);
    await expect(page.locator(".machine-kicker")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator("[data-machine-body]")).toHaveCSS(
      "color",
      "rgb(208, 214, 224)",
    );
    await expect(page.locator("[data-machine-body]")).toContainText(
      "## Selected work",
    );
  });

  test("skips the entrance when reduced motion is requested", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en?view=machine");

    await expect(page.locator("[data-machine-view]")).not.toHaveClass(
      /is-typing/,
    );
    await expect(page.locator(".machine-kicker")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator("[data-machine-view]")).not.toHaveClass(
      /is-settling/,
    );
    await expect(page.locator("[data-machine-body]")).toHaveCSS(
      "color",
      "rgb(208, 214, 224)",
    );
    await expect(page.locator("[data-machine-body]")).toContainText(
      "## Selected work",
    );
  });

  test("theme icon morphs with the theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/en");

    const themePath = page.locator("#theme-morph path");
    await expect(page.locator("#theme-morph")).toHaveAttribute(
      "reduced-motion",
      "user",
    );
    const themeBefore = await themePath.getAttribute("d");

    await page.locator("#theme-toggle").click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect
      .poll(() => themePath.getAttribute("d"))
      .not.toBe(themeBefore);
  });

  test("language control uses the target-language icon", async ({ page }) => {
    await page.goto("/en");
    const toChinese = page.getByRole("link", {
      name: /中文, Switch to Chinese/,
    });
    await expect(toChinese).toHaveAttribute("href", "/zh");
    const chinesePath = await toChinese
      .locator("#language-morph path")
      .getAttribute("d");

    await page.goto("/zh");
    const toEnglish = page.getByRole("link", { name: /^EN,/ });
    await expect(toEnglish).toHaveAttribute("href", "/en");
    const englishPath = await toEnglish
      .locator("#language-morph path")
      .getAttribute("d");

    expect(englishPath).not.toBe(chinesePath);
  });

  test("the header control matches the other icon buttons", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en");

    const machine = await page.locator("[data-machine-toggle]").boundingBox();
    const theme = await page.locator("#theme-toggle").boundingBox();
    const language = await page
      .getByRole("link", { name: /中文, Switch to Chinese/ })
      .boundingBox();
    expect(machine?.width).toBe(theme?.width);
    expect(machine?.height).toBe(theme?.height);
    expect(language?.width).toBe(theme?.width);
    expect(language?.height).toBe(theme?.height);
    await expect(page.locator("[data-machine-toggle]")).toHaveAccessibleName(
      "View as machine",
    );
    await expect(page.locator("[data-machine-toggle]")).toHaveText("");
  });

  test("machine view is plain text at 320px with a copy receipt", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en?view=machine");

    await expect(page.locator("html")).toHaveAttribute("data-view", "machine");
    await expect(page.locator("[data-machine-view]")).toBeVisible();
    await expect(page.locator(".human-view")).toBeHidden();

    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.client);

    await expect(page.locator(".view-switch-kbd")).toBeHidden();
    const body = page.locator("[data-machine-body]");
    await expect(body).toContainText("# Ever Ruiz Diaz");
    expect(
      await body.evaluate((element) => getComputedStyle(element).fontFamily),
    ).toMatch(/mono/i);

    const copyButton = page.locator("[data-machine-copy]");
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(copyButton).toContainText("Copied");
    await expect(page.locator("#machine-status")).toHaveText("Copied");
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("# Ever Ruiz Diaz");
  });

  test("machine view survives 200 percent text scaling", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en?view=machine");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });

    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.client);
    await expect(page.locator("[data-machine-copy]")).toBeVisible();
    await expect(page.locator("[data-machine-view]")).toBeVisible();
    await expect(page.locator(".view-switch")).toBeVisible();
  });

  test("keeps the machine view across pages and localizes the control", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en?view=machine");
    await page.goto("/en/sections/books");
    await expect(page.locator("html")).toHaveAttribute("data-view", "machine");
    await expect(page.locator("[data-machine-view]")).toBeVisible();
    await expect(page.locator(".view-switch")).toBeVisible();

    await page.goto("/zh?view=human");
    const entry = page.locator("[data-machine-toggle]");
    await expect(entry).toHaveAccessibleName("以机器视图查看");
    await entry.click();
    await expect(page.locator('[data-view-switch="machine"]')).toHaveText(
      /机器/,
    );
    await expect(page.locator("[data-machine-body]")).toContainText(
      "## 精选工作",
    );
    await page.locator('[data-view-switch="human"]').click();
    await expect(entry).toBeFocused();
  });

  test("migrates the old stored agent preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.evaluate(() => {
      localStorage.removeItem("portfolio-view");
      localStorage.setItem("portfolio-agent-mode", "agent");
    });

    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-view", "machine");
    await expect(page).toHaveURL(/\/en$/);
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-view")),
    ).toBe("machine");
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-agent-mode")),
    ).toBeNull();
  });

  test("canonicalizes the old human URL", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en?view=machine");
    await expect(page.locator("html")).toHaveAttribute("data-view", "machine");

    await page.goto("/en?mode=human");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-view",
      "machine",
    );
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator(".human-view")).toBeVisible();
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-view")),
    ).toBe("human");
  });

  test("toggles the view with Shift+M", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    await page.keyboard.press("Shift+M");
    await expect(page.locator("html")).toHaveAttribute("data-view", "machine");
    await expect(page).toHaveURL(/view=machine/);

    await page.keyboard.press("Shift+M");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-view",
      "machine",
    );
    await expect(page).toHaveURL(/\/en$/);
  });
});
