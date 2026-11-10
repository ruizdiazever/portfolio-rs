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

      const src = await image.getAttribute("src");
      expect(src, `src for ${alt}`).toBeTruthy();

      const response = await request.get(src!);
      expect(response.status(), `image request for ${src}`).toBe(200);
      expect(response.headers()["content-type"]).toMatch(/^image\//);
    }
  });
});
