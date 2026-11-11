import { expect, test } from "@playwright/test";

test.describe("assets", () => {
  test("optimized images load through the image endpoint", async ({
    page,
    request,
  }) => {
    await page.goto("/en");

    for (const alt of ["Ever Ruiz Diaz", "Rust mascot"]) {
      const image = page.getByAltText(alt, { exact: true }).first();
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();

      await expect
        .poll(() =>
          image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);

      if (alt.includes("mascot")) {
        const ratio = await image.evaluate(
          (element) =>
            (element as HTMLImageElement).naturalWidth /
            (element as HTMLImageElement).naturalHeight,
        );
        expect(ratio, "mascot must keep its wide aspect ratio").toBeGreaterThan(
          1.5,
        );
      }

      const src = await image.getAttribute("src");
      expect(src, `src for ${alt}`).toBeTruthy();

      const response = await request.get(src!);
      expect(response.status(), `image request for ${src}`).toBe(200);
      expect(response.headers()["content-type"]).toMatch(/^image\//);
    }
  });

  test("about page image is served from S3", async ({ page, request }) => {
    await page.goto("/en/sections/about");

    const image = page.getByAltText("Ever Ruiz Diaz", { exact: true }).first();
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();

    await expect
      .poll(() =>
        image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);

    const src = await image.getAttribute("src");
    expect(src).toBeTruthy();
    expect(src).toMatch(/^https:\/\/s3\.berli\.app\/portfolio\/v1\//);
    expect(src).not.toContain("console.minio.berli.app");

    const response = await request.get(src!);
    expect(response.status()).toBe(200);
  });

  test("no content images are served by the app", async ({ page }) => {
    for (const path of ["/en", "/en/sections/books", "/en/blog/hardware/minisforum-ms-01", "/en/blog/portfolio-wasm"]) {
      await page.goto(path);

      const sources = await page.locator("img").evaluateAll((images) =>
        images.map((image) => (image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src),
      );

      expect(sources.length).toBeGreaterThan(0);
      for (const src of sources) {
        expect(src, `${path} image ${src}`).toMatch(
          /^https:\/\/s3\.berli\.app\/portfolio\/v1\//,
        );
        const response = await page.request.get(src);
        expect(response.status(), `${path} image ${src}`).toBe(200);
      }
    }
  });
});
