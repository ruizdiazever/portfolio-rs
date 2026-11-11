import { expect, test } from "@playwright/test";

test.describe("assets", () => {
  test("optimized images load through the image endpoint", async ({
    page,
    request,
  }) => {
    await page.goto("/en");

    for (const alt of ["Avatar", "Crab"]) {
      const image = page.getByAltText(alt, { exact: true }).first();
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();

      await expect
        .poll(() =>
          image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);

      if (alt === "Crab") {
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

  test("about page image is served locally", async ({ page, request }) => {
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
    expect(src).not.toContain("console.minio.berli.app");

    const response = await request.get(src!);
    expect(response.status()).toBe(200);
  });
});
