import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 320, height: 800 } });

test.describe("320px layout", () => {
  for (const path of [
    "/en/sections/books",
    "/en/blog/organizations-using-rust",
    "/en/blog/hardware/minisforum-ms-01",
  ]) {
    test(`${path} does not clip content`, async ({ page }) => {
      await page.goto(path);

      const overflowing = await page.evaluate(() => {
        const selected = document.querySelectorAll(
          "article, main h1, main p, .book-card, main button",
        );
        return [...selected]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.right > window.innerWidth + 1;
          })
          .map((element) => `${element.tagName.toLowerCase()} ${element.textContent?.trim().slice(0, 40)}`);
      });

      expect(overflowing).toEqual([]);
    });
  }

  test("/en daily tools stay inside the viewport", async ({ page }) => {
    await page.goto("/en");

    const section = page.locator("section").filter({ hasText: "Daily tools" });
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("img")).toHaveCount(6);

    const overflowing = await section.evaluate((element) => {
      const selected = element.querySelectorAll("a, a span, a img");
      return [...selected]
        .filter((child) => {
          const rect = child.getBoundingClientRect();
          return rect.width > 0 && rect.right > window.innerWidth + 1;
        })
        .map(
          (child) =>
            `${child.tagName.toLowerCase()} ${child.textContent?.trim().slice(0, 40)}`,
        );
    });

    expect(overflowing).toEqual([]);
  });
});
