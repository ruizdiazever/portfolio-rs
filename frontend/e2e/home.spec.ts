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
      page.getByRole("heading", { name: "Writing", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Selected work", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Experience", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Daily tools", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "DeepSeek Harness agent harness" }),
    ).toHaveAttribute(
      "href",
      "https://github.com/deepseek-ai/deepseek-harness",
    );
    const dailyTools = page.locator("section").filter({ hasText: "Daily tools" });
    await expect(dailyTools.locator("img")).toHaveCount(6);
    const iconSources = await dailyTools
      .locator("img")
      .evaluateAll((images) =>
        images.map((image) => (image as HTMLImageElement).src),
      );
    expect(iconSources).toEqual([
      "https://cdn.jsdelivr.net/npm/simple-icons@16.37.0/icons/deepseek.svg",
      "https://cdn.jsdelivr.net/npm/simple-icons@16.37.0/icons/firefox.svg",
      "https://cdn.jsdelivr.net/npm/simple-icons@16.37.0/icons/bitwarden.svg",
      "https://cdn.jsdelivr.net/npm/simple-icons@16.37.0/icons/docker.svg",
      "https://cdn.jsdelivr.net/npm/simple-icons@16.37.0/icons/warp.svg",
      "https://cdn.jsdelivr.net/npm/simple-icons@16.37.0/icons/zedindustries.svg",
    ]);
    for (const src of iconSources) {
      const response = await page.request.get(src);
      expect(response.status(), src).toBe(200);
      expect(response.headers()["content-type"], src).toContain(
        "image/svg+xml",
      );
    }
    const headings = (await page.locator("main h2").allTextContents()).map(
      (heading) => heading.trim(),
    );
    expect(headings.indexOf("Daily tools")).toBeLessThan(
      headings.indexOf("Writing"),
    );
    await expect(
      page.getByRole("link", { name: "Zed editor" }),
    ).toHaveAttribute("href", "https://zed.dev");
    await expect(page.getByText("contributions in the last year")).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("ZH landing is translated", async ({ page }) => {
    await page.goto("/zh");

    await expect(
      page.getByRole("heading", { name: "写作", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "精选项目", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "经历", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "日常工具", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "DeepSeek Harness 智能体工作台" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Zed 编辑器" }),
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
