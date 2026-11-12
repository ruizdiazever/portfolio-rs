import { expect, test } from "@playwright/test";

test.describe("interactions", () => {
  test("skip link is the first focus target", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });


  test("experience dots align with their dates", async ({ page }) => {
    await page.goto("/en");

    const pairs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-timeline-dot]")).map((dot) => {
        const date = dot.parentElement?.querySelector("[data-timeline-date]");
        const dotRect = dot.getBoundingClientRect();
        const dateRect = date?.getBoundingClientRect();
        const line = dot.closest(".grid.gap-10");
        const lineRect = line?.getBoundingClientRect();
        const lineStyle = line ? getComputedStyle(line, "::after") : null;
        return {
          dotX: dotRect.left + dotRect.width / 2,
          lineX:
            lineRect && lineStyle
              ? lineRect.left +
                Number.parseFloat(lineStyle.left) +
                Number.parseFloat(lineStyle.width) / 2
              : 0,
          dot: dotRect.top + dotRect.height / 2,
          date: dateRect ? dateRect.top + dateRect.height / 2 : 0,
        };
      }),
    );

    expect(pairs.length).toBeGreaterThan(0);
    for (const pair of pairs) {
      expect(Math.abs(pair.dot - pair.date)).toBeLessThanOrEqual(1);
      expect(Math.abs(pair.dotX - pair.lineX)).toBeLessThanOrEqual(0.25);
    }
  });

  test("book cards flip in place", async ({ page }) => {
    await page.goto("/en/sections/books");

    const card = page.locator(".book-card:not(.hidden)").first();
    const toggle = card.locator(".book-card-toggle");
    const title = (await card.locator(".book-front h2").innerText()).trim();

    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();

    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(card).toHaveClass(/is-flipped/);
    await expect(card.locator(".book-front")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(card.locator(".book-back")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await expect(card.locator(".book-back h2")).toHaveText(title);
    await expect(toggle).toHaveAttribute(
      "aria-label",
      `${title}, Flip back`,
    );
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await card.locator(".book-card-back-toggle").click();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(card).not.toHaveClass(/is-flipped/);
    await expect(card.locator(".book-front")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  });

  test("technology tags link out", async ({ page }) => {
    await page.goto("/en");
    const tag = page.locator("[data-tech]").first();
    await expect(tag).toHaveAttribute("href", /^https?:\/\//);
    await expect(tag).toHaveAccessibleName(/.+/);
  });

  test("theme follows the system and the override persists", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/en");
    const html = page.locator("html");
    const colorScheme = page.locator('meta[name="color-scheme"]');
    const themeColor = page.locator('meta[name="theme-color"]');

    await expect(html).toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light dark");
    await expect(themeColor).toHaveAttribute("content", "#08090a");

    await page
      .getByRole("button", { name: "Switch to light theme" })
      .click();
    await expect(html).not.toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light");
    await expect(themeColor).toHaveAttribute("content", "#ffffff");

    await page.reload();
    await expect(html).not.toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light");
    await expect(
      page.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light dark");
    await expect(themeColor).toHaveAttribute("content", "#08090a");
    expect(
      await page.evaluate(() => localStorage.getItem("mode-watcher-mode")),
    ).toBeNull();
  });

  test("theme follows system changes without an override", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/en");
    const html = page.locator("html");
    const colorScheme = page.locator('meta[name="color-scheme"]');
    const themeColor = page.locator('meta[name="theme-color"]');

    await expect(html).not.toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light dark");
    await expect(themeColor).toHaveAttribute("content", "#ffffff");
    await expect(
      page.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeVisible();

    await page.emulateMedia({ colorScheme: "dark" });
    await expect(html).toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light dark");
    await expect(themeColor).toHaveAttribute("content", "#08090a");
    await expect(
      page.getByRole("button", { name: "Switch to light theme" }),
    ).toBeVisible();
  });

  test("article titles are headings", async ({ page }) => {
    await page.goto("/en/blog/articles");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Writing",
    );
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("post back link is inert until it appears", async ({ page }) => {
    await page.goto("/en/blog/portfolio-wasm");
    const back = page.locator("#back-button");
    await expect(back).toHaveAttribute("inert", "");

    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(back).not.toHaveAttribute("inert", "");
  });

  test("language switcher navigates to the translated page", async ({ page }) => {
    await page.goto("/en/sections/about");

    await page.getByRole("link", { name: /中文, Switch to Chinese/ }).click();

    await expect(page).toHaveURL(/\/zh\/sections\/about$/);
    await expect(
      page.getByRole("heading", { name: "关于", exact: true }),
    ).toBeVisible();
  });

  test("social links point at the current X profile", async ({ page }) => {
    await page.goto("/en");

    const xLinks = page.locator('a[aria-label="X (Twitter)"]');
    expect(await xLinks.count()).toBeGreaterThan(0);
    for (let index = 0; index < (await xLinks.count()); index++) {
      await expect(xLinks.nth(index)).toHaveAttribute(
        "href",
        "https://x.com/everruizdiazo",
      );
    }

    await page.goto("/en/sections/contact");
    await expect(
      page.getByRole("main").getByRole("link", { name: "X (Twitter)" }),
    ).toHaveAttribute("href", "https://x.com/everruizdiazo");
  });

  test("book filters are shareable through the query string", async ({ page }) => {
    await page.goto("/en/sections/books");

    const technical = page.locator("[data-technical='true']");
    const comics = page.locator("[data-comic='true']");
    expect(await technical.count()).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Comics", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/sections\/books\?filter=comic$/);
    await expect(
      page.getByRole("button", { name: "Comics", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(comics.first()).toBeVisible();
    await expect(technical.first()).toBeHidden();
    await expect(page.locator("#book-filter-status")).toHaveText(
      /Showing \d+ books?/,
    );

    await page.reload();
    await expect(comics.first()).toBeVisible();
    await expect(technical.first()).toBeHidden();

    await page.goBack();
    await expect(page).toHaveURL(/\/en\/sections\/books$/);
    await expect(
      page.getByRole("button", { name: "Technical", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(technical.first()).toBeVisible();
    await expect(page.locator("#book-filter-status")).toHaveText(
      /Showing \d+ books?/,
    );
  });
});
