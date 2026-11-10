import { expect, test } from "@playwright/test";

test.describe("seo", () => {
  test("robots.txt points to the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("Sitemap: https://www.everdev.it/sitemap-index.xml");
  });

  test("sitemap covers every localized page", async ({ request }) => {
    const response = await request.get("/sitemap-index.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");

    const body = await response.text();
    for (const locale of ["en", "zh"]) {
      for (const path of [
        "",
        "/sections/about",
        "/sections/books",
        "/sections/contact",
        "/sections/cv",
        "/blog/articles",
        "/blog/organizations-using-rust",
        "/blog/portfolio-wasm",
        "/projects/berli-system",
        "/projects/picu-iot",
        "/projects/raau-design",
      ]) {
        expect(body).toContain(`https://www.everdev.it/${locale}${path}`);
      }
    }
    expect(body).toContain('hreflang="en"');
    expect(body).toContain('hreflang="zh"');
  });

  test("pages expose canonical and alternate links", async ({ page }) => {
    await page.goto("/en/sections/about");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.everdev.it/en/sections/about",
    );
    await expect(
      page.locator('link[rel="alternate"][hreflang="zh"]'),
    ).toHaveAttribute("href", "https://www.everdev.it/zh/sections/about");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Software Engineer/,
    );
  });
});
