import { expect, test } from "@playwright/test";

test.describe("performance budget", () => {
  test("home ships a small client payload", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "networkidle" });

    const metrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
      return {
        resources: resources.length,
        scripts: resources.filter(
          (entry) => entry.initiatorType === "script",
        ).length,
        scriptBytes: resources
          .filter((entry) => entry.initiatorType === "script")
          .reduce((total, entry) => total + entry.transferSize, 0),
        fonts: resources
          .filter((entry) => entry.name.endsWith(".woff2"))
          .map((entry) => entry.name.split("/").pop()),
        iconCdn: resources.filter((entry) =>
          entry.name.includes("cdn.jsdelivr.net"),
        ).length,
        htmlBytes: document.documentElement.outerHTML.length,
        dom: document.querySelectorAll("*").length,
      };
    });

    expect(metrics.resources).toBeLessThan(15);
    // Header scripts, the Morphicons bootstrap and the contribution island.
    expect(metrics.scripts).toBeLessThanOrEqual(10);
    expect(metrics.scriptBytes).toBeLessThan(200_000);
    expect(metrics.fonts).toHaveLength(1);
    expect(metrics.fonts[0]).toMatch(/\.woff2$/);
    expect(
      await page.evaluate(() => getComputedStyle(document.body).fontFamily),
    ).toMatch(/^Inter/);
    expect(metrics.iconCdn).toBe(0);
    expect(metrics.htmlBytes).toBeLessThan(300_000);
    expect(metrics.dom).toBeLessThan(1_300);
    await expect(
      page.locator('[role="img"][aria-label*="contributions"]'),
    ).toBeVisible();
    await expect(page.locator("[data-tagline]")).toBeVisible();
  });
});
