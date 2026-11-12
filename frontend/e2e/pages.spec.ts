import { expect, test, type Page } from "@playwright/test";

const pages: Array<{
  path: string;
  heading?: string;
  text?: string;
}> = [
  { path: "/en/sections/about", heading: "About" },
  { path: "/en/sections/books", heading: "Reading" },
  { path: "/en/sections/contact", heading: "Contact", text: "Have a systems problem" },
  { path: "/zh/sections/about", heading: "关于" },
  { path: "/zh/sections/books", heading: "阅读" },
  { path: "/zh/sections/contact", heading: "联系" },
  { path: "/en/sections/cv", heading: "CV" },
  { path: "/en/blog/articles", heading: "Writing" },
  { path: "/zh/blog/articles", heading: "写作" },
  { path: "/en/blog/hardware/minisforum-ms-01", heading: "Updating the MS-01 BIOS" },
  { path: "/zh/blog/hardware/minisforum-ms-01", heading: "更新 MS-01 BIOS" },
  { path: "/en/blog/organizations-using-rust", heading: "Organizations using Rust" },
  { path: "/zh/blog/organizations-using-rust", heading: "使用 Rust 的组织" },
  { path: "/en/blog/portfolio-wasm", heading: "Building a Rust/WASM portfolio" },
  { path: "/zh/blog/portfolio-wasm", heading: "用 Rust 与 WASM 重做作品集" },
  { path: "/en/projects/berli-system", heading: "BERLi" },
  { path: "/en/projects/picu-iot", heading: "Picu IoT" },
  { path: "/en/projects/raau-design", heading: "RAAU Design" },
  { path: "/zh/projects/berli-system", heading: "BERLi" },
];

test.describe("pages", () => {
  for (const { path, heading, text } of pages) {
    test(`${path} renders`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `status for ${path}`).toBe(200);

      if (heading) {
        await expect(
          page.getByRole("heading", { name: heading, exact: true }).first(),
        ).toBeVisible();
      }
      if (text) {
        await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
      }
    });
  }

  test("unknown route renders the 404 page", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  });
});

test.describe("organizations table", () => {
  test("paginates and filters", async ({ page }) => {
    await page.goto("/en/blog/organizations-using-rust");

    await expect(page.getByText("Page 1 of 3")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("cell", { name: "AWS", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page.getByText("Page 2 of 3")).toBeVisible();

    await page.getByPlaceholder("Filter by name…").fill("Google");
    await expect(page.getByText("Page 1 of 1")).toBeVisible();
    await expect(page.getByRole("cell", { name: "Google", exact: true })).toBeVisible();
  });
});

async function openFeedbackDialog(page: Page) {
  await expect(async () => {
    await page.getByRole("button", { name: "Love" }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 20_000 });
}

test.describe("feedback", () => {
  test("validates and submits feedback", async ({ page }) => {
    await page.route("**/api/feedback", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, id: "e2e-feedback" }),
      }),
    );

    await page.goto("/en/blog/portfolio-wasm");
    await expect(page.getByText("Was this useful?")).toBeVisible();

    await openFeedbackDialog(page);
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: "Feedback" }),
    ).toBeVisible();
    await expect(dialog.getByLabel("Feedback")).toBeVisible();

    await dialog.getByRole("button", { name: "Submit" }).click();
    await expect(
      dialog.getByText("Enter your feedback before submitting."),
    ).toBeVisible();

    await dialog.getByRole("textbox").fill("Excellent portfolio!");
    await dialog.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText("Thank you for your feedback!"),
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
