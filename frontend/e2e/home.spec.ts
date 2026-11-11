import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("root redirects to the default locale", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/en$/);
  });

  test("EN landing renders the main sections", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/en");

    await expect(page).toHaveTitle(/Ever Ruiz Diaz/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: /Ever Ruiz Diaz/ }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Blog", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Software", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Experience", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("contributions in the last year")).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("ZH landing is translated", async ({ page }) => {
    await page.goto("/zh");

    await expect(
      page.getByRole("heading", { name: "博客", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "项目", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "经验", exact: true }),
    ).toBeVisible();
  });

  test("every landing card links to a page", async ({ page }) => {
    await page.goto("/en");

    const links = page.locator("main a[href^='/en/']");
    const count = await links.count();
    expect(count).toBeGreaterThan(5);

    for (let index = 0; index < count; index++) {
      await expect(links.nth(index)).toHaveAttribute("href", /^\/en\//);
    }
  });
});
