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

  test("book cards reveal details on keyboard focus", async ({ page }) => {
    await page.goto("/en/sections/books");

    const card = page.locator(".book-card:not(.hidden)").first();
    await card.focus();
    await expect(card.locator(".details")).toHaveCSS("opacity", "1");
  });

  test("technology tags link out", async ({ page }) => {
    await page.goto("/en");
    const tag = page.locator("[data-tech]").first();
    await expect(tag).toHaveAttribute("href", /^https?:\/\//);
    await expect(tag).toHaveAccessibleName(/.+/);
  });

  test("theme toggle switches to dark and persists", async ({ page }) => {
    await page.goto("/en");
    const html = page.locator("html");

    await expect(html).not.toHaveClass(/dark/);

    await expect(async () => {
      await page.getByRole("button", { name: "Theme" }).click();
      await expect(html).toHaveClass(/dark/, { timeout: 1_000 });
    }).toPass({ timeout: 20_000 });

    await page.reload();
    await expect(html).toHaveClass(/dark/);

    await expect(async () => {
      await page.getByRole("button", { name: "Theme" }).click();
      await expect(html).not.toHaveClass(/dark/, { timeout: 1_000 });
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

  test("book filter hides non-matching cards", async ({ page }) => {
    await page.goto("/en/sections/books");

    const technical = page.locator("[data-technical='true']");
    const comics = page.locator("[data-comic='true']");
    const technicalCount = await technical.count();
    expect(technicalCount).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Comics", exact: true }).click();
    await expect(comics.first()).toBeVisible();
    await expect(technical.first()).toBeHidden();
  });
});
