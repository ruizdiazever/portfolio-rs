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
        "/blog/hardware/minisforum-ms-01",
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

  test("metadata images resolve from S3", async ({ page, request }) => {
    for (const path of ["/en", "/en/blog/portfolio-wasm"]) {
      await page.goto(path);

      const urls = await page.evaluate(() => {
        const values: string[] = [];
        document
          .querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')
          .forEach((element) => {
            const content = element.getAttribute("content");
            if (content) values.push(content);
          });
        document
          .querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
          .forEach((element) => {
            const href = element.getAttribute("href");
            if (href) values.push(href);
          });
        return values;
      });

      expect(urls.length).toBeGreaterThan(2);

      for (const url of urls) {
        const absolute = new URL(url, page.url()).href;

        if (absolute.endsWith(".webmanifest")) {
          const response = await request.get(absolute);
          const manifest = (await response.json()) as {
            icons: { src: string }[];
          };
          for (const icon of manifest.icons) {
            expect(icon.src).toMatch(
              /^https:\/\/s3\.berli\.app\/portfolio\/v1\//,
            );
            const iconResponse = await request.get(icon.src);
            expect(iconResponse.status(), icon.src).toBe(200);
          }
          continue;
        }

        expect(absolute, `${path} ${url}`).toMatch(
          /^https:\/\/s3\.berli\.app\/portfolio\/v1\//,
        );
        const response = await request.get(absolute);
        expect(response.status(), absolute).toBe(200);
      }
    }
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
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
      "content",
      /^https:\/\/s3\.berli\.app\/portfolio\/v1\/og\//,
    );
  });
});
