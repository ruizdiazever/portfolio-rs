import { expect, test } from "@playwright/test";

test.describe("interactions", () => {
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

    await expect(async () => {
      await page.getByRole("button", { name: "Language" }).click();
      await expect(
        page.getByRole("menuitemradio", { name: "中文" }),
      ).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 20_000 });

    await page.getByRole("menuitemradio", { name: "中文" }).click();

    await expect(page).toHaveURL(/\/zh\/sections\/about$/);
    await expect(
      page.getByRole("heading", { name: "About", exact: true }),
    ).toBeVisible();
  });

  test("project technology popover opens", async ({ page }) => {
    await page.goto("/en");

    const trigger = page.locator("[data-slot='popover-trigger']").first();
    await expect(trigger).toBeVisible();

    await expect(async () => {
      await trigger.click();
      await expect(page.locator("[data-slot='popover-content']")).toBeVisible({
        timeout: 1_000,
      });
    }).toPass({ timeout: 20_000 });
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
