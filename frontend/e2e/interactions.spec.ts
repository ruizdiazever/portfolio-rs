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
    await expect(card.locator(".book-back h3")).toHaveText(title);
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await toggle.click();
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

  test("theme toggle switches theme and persists", async ({ page }) => {
    await page.goto("/en");
    const html = page.locator("html");

    await expect(html).toHaveClass(/dark/);

    await expect(async () => {
      await page.getByRole("button", { name: "Theme" }).click();
      await expect(html).not.toHaveClass(/dark/, { timeout: 1_000 });
    }).toPass({ timeout: 20_000 });

    await page.reload();
    await expect(html).not.toHaveClass(/dark/);

    await expect(async () => {
      await page.getByRole("button", { name: "Theme" }).click();
      await expect(html).toHaveClass(/dark/, { timeout: 1_000 });
    }).toPass({ timeout: 20_000 });
  });

  test("language switcher navigates to the translated page", async ({ page }) => {
    await page.goto("/en/sections/about");

    await page.getByRole("link", { name: "Language" }).click();

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

    await page.reload();
    await expect(comics.first()).toBeVisible();
    await expect(technical.first()).toBeHidden();

    await page.goBack();
    await expect(page).toHaveURL(/\/en\/sections\/books$/);
    await expect(
      page.getByRole("button", { name: "Technical", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(technical.first()).toBeVisible();
  });
});
