import { expect, test } from "@playwright/test";
import sharp from "sharp";

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

  test("open graph images are generated on demand", async ({ page, request }) => {
    const cases = [
      ["/en", "https://www.everdev.it/og/home.png"],
      [
        "/en/blog/portfolio-wasm",
        "https://www.everdev.it/og/blog/portfolio-wasm.png",
      ],
      [
        "/en/projects/berli-system",
        "https://www.everdev.it/og/projects/berli-system.png",
      ],
      [
        "/zh/sections/about",
        "https://www.everdev.it/og/sections/about.png",
      ],
    ];

    for (const [path, image] of cases) {
      await page.goto(path);

      const images = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            'meta[property="og:image"], meta[name="twitter:image"]',
          ),
        )
          .map((element) => element.getAttribute("content"))
          .filter((content): content is string => Boolean(content)),
      );

      expect(new Set(images), path).toEqual(new Set([image]));

      const response = await request.get(new URL(image).pathname);
      expect(response.status(), image).toBe(200);
      expect(response.headers()["content-type"], image).toBe("image/png");
      expect(response.headers()["cache-control"], image).toContain(
        "max-age=3600",
      );
      expect(Number(response.headers()["content-length"]), image).toBeGreaterThan(
        5_000,
      );

      const metadata = await sharp(await response.body()).metadata();
      expect(metadata.width, image).toBe(1200);
      expect(metadata.height, image).toBe(630);
    }
  });

  test("icons and manifest resolve from S3", async ({ page, request }) => {
    await page.goto("/en");

    const urls = await page.evaluate(() => {
      const values: string[] = [];
      document
        .querySelectorAll(
          'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]',
        )
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

      expect(absolute, url).toMatch(
        /^https:\/\/s3\.berli\.app\/portfolio\/v1\//,
      );
      const response = await request.get(absolute);
      expect(response.status(), absolute).toBe(200);
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
      /tech lead|software engineer/i,
    );
    await expect(
      page.locator('meta[property="og:image"]').first(),
    ).toHaveAttribute(
      "content",
      "https://www.everdev.it/og/sections/about.png",
    );
  });
});
