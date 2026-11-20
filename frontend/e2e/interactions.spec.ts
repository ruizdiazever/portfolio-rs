import { expect, test } from "@playwright/test";

test.describe("interactions", () => {
  test("skip link is the first focus target", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });


  test("experience dots align with their dates", async ({ page }) => {
    await page.goto("/en");

    const pairs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-timeline-dot]")).map((dot) => {
        const date = dot.parentElement?.querySelector("[data-timeline-date]");
        const dotRect = dot.getBoundingClientRect();
        const dateRect = date?.getBoundingClientRect();
        const line = dot.closest(".grid.gap-10");
        const lineRect = line?.getBoundingClientRect();
        const lineStyle = line ? getComputedStyle(line, "::after") : null;
        return {
          dotX: dotRect.left + dotRect.width / 2,
          lineX:
            lineRect && lineStyle
              ? lineRect.left +
                Number.parseFloat(lineStyle.left) +
                Number.parseFloat(lineStyle.width) / 2
              : 0,
          dot: dotRect.top + dotRect.height / 2,
          date: dateRect ? dateRect.top + dateRect.height / 2 : 0,
        };
      }),
    );

    expect(pairs.length).toBeGreaterThan(0);
    for (const pair of pairs) {
      expect(Math.abs(pair.dot - pair.date)).toBeLessThanOrEqual(1);
      expect(Math.abs(pair.dotX - pair.lineX)).toBeLessThanOrEqual(0.25);
    }
  });

  test("experience dots are opaque over the timeline rule", async ({ page }) => {
    await page.goto("/en");

    const dots = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-timeline-dot]")).map(
        (dot) => ({
          background: getComputedStyle(dot).backgroundColor,
          opacity: getComputedStyle(dot).opacity,
        }),
      ),
    );

    expect(dots.length).toBeGreaterThan(0);
    for (const dot of dots) {
      expect(dot.opacity).toBe("1");
      expect(dot.background).not.toMatch(/rgba\(/);
      expect(dot.background).not.toMatch(/\/\s*[\d.]+\s*\)/);
    }
  });

  test("book cards flip in place", async ({ page }) => {
    await page.goto("/en/sections/books");

    const card = page.locator(".book-card:not(.hidden)").first();
    const toggle = card.locator(".book-card-toggle");
    const title = (await card.locator(".book-front h2").innerText()).trim();

    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();

    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(card).toHaveClass(/is-flipped/);
    await expect(card.locator(".book-front")).toHaveAttribute("inert", "");
    await expect(card.locator(".book-back")).not.toHaveAttribute("inert", "");
    await expect(card.locator(".book-back h2")).toHaveText(title);
    await expect(toggle).toHaveAttribute(
      "aria-label",
      `${title}, Flip back`,
    );
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await card.locator(".book-card-back-toggle").click();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(card).not.toHaveClass(/is-flipped/);
    await expect(card.locator(".book-front")).not.toHaveAttribute("inert", "");
  });

  test("book covers stay monochrome until the card is hovered or focused", async ({
    page,
  }) => {
    await page.goto("/en/sections/books?filter=all");
    const cards = page.locator(".book-card:not(.hidden)");
    const card = cards.first();
    const cover = card.locator(".book-front img").first();
    await cover.scrollIntoViewIfNeeded();
    await expect(cover).toHaveCSS("filter", "grayscale(1)");

    await card.hover();
    await expect(cover).toHaveCSS("filter", "grayscale(0)");
    await expect(
      cards.nth(1).locator(".book-front img").first(),
    ).toHaveCSS("filter", "grayscale(1)");

    await page.mouse.move(0, 0);
    await expect(cover).toHaveCSS("filter", "grayscale(1)");

    await card.locator(".book-card-toggle").focus();
    await expect(cover).toHaveCSS("filter", "grayscale(0)");
  });

  test("about portrait stays monochrome until hovered", async ({ page }) => {
    await page.goto("/en/sections/about");
    const portrait = page.locator('img[alt="Ever Ruiz Diaz"]').first();
    await portrait.scrollIntoViewIfNeeded();
    await expect(portrait).toHaveCSS("filter", "grayscale(1)");

    await portrait.hover();
    await expect(portrait).toHaveCSS("filter", "grayscale(0)");

    await page.mouse.move(0, 0);
    await expect(portrait).toHaveCSS("filter", "grayscale(1)");
  });

  test("home avatar stays monochrome until hovered", async ({ page }) => {
    await page.goto("/en");
    const avatar = page.locator('img[alt="Ever Ruiz Diaz"]').first();
    await avatar.scrollIntoViewIfNeeded();
    await expect(avatar).toHaveCSS("filter", "grayscale(1)");

    await avatar.hover();
    await expect(avatar).toHaveCSS("filter", "grayscale(0)");

    await page.mouse.move(0, 0);
    await expect(avatar).toHaveCSS("filter", "grayscale(1)");
  });

  test("back links animate their arrow icon", async ({ page }) => {
    await page.goto("/en/projects/berli-system");
    const back = page.getByRole("link", { name: "Back to selected work" });
    const icon = back.locator("svg");
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveCSS("translate", "none");

    await back.hover();
    await expect(icon).toHaveCSS("translate", "-1.5px");

    await page.goto("/en/sections/cv");
    const home = page.getByRole("link", { name: "Go back home" });
    await expect(home.locator("svg")).toHaveCount(1);
  });

  test("technology tags link out", async ({ page }) => {
    await page.goto("/en");
    const tag = page.locator("[data-tech]").first();
    await expect(tag).toHaveAttribute("href", /^https?:\/\//);
    await expect(tag).toHaveAccessibleName(/.+/);
  });

  test("technology marks collapse into a count when they do not fit", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en");
    const cards = page.locator("#work article");
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);

    for (let index = 0; index < cardCount; index += 1) {
      const card = cards.nth(index);
      const total = await card.locator("[data-tech-item]").count();
      const more = card.locator("[data-tech-more]");
      await expect(more).toBeVisible();
      const countText = (
        await more.locator("[data-tech-more-count]").textContent()
      )?.trim();
      expect(countText).toMatch(/^\+\d+$/);
      const hiddenCount = Number(countText?.slice(1));
      expect(hiddenCount).toBeGreaterThan(0);

      await expect(
        card.locator("[data-tech-item]:not([hidden])"),
      ).toHaveCount(total - hiddenCount);
      await expect(more).toHaveAttribute("title", /\S/);

      const hiddenLabels = await card
        .locator("[data-tech-item][hidden]")
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute("aria-label")),
        );
      expect(await more.getAttribute("title")).toBe(
        hiddenLabels.filter(Boolean).join(", "),
      );

      const rows = await card
        .locator("[data-tech-item]:not([hidden])")
        .evaluateAll(
          (links) =>
            new Set(
              links.map((link) => Math.round(link.getBoundingClientRect().top)),
            ).size,
        );
      expect(rows).toBe(1);
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(cards.first().locator("[data-tech-more]")).toBeHidden();

    for (let index = 0; index < cardCount; index += 1) {
      const card = cards.nth(index);
      const total = await card.locator("[data-tech-item]").count();
      const more = card.locator("[data-tech-more]");
      const visible = await card
        .locator("[data-tech-item]:not([hidden])")
        .count();

      if (await more.isVisible()) {
        const countText = (
          await more.locator("[data-tech-more-count]").textContent()
        )?.trim();
        expect(Number(countText?.slice(1))).toBe(total - visible);
      } else {
        expect(visible).toBe(total);
      }
    }
  });

  test("project cards share height and reveal brand color on hover and focus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/en");
    const cards = page.locator("#work article");
    const heights = await cards.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    );
    expect(new Set(heights).size).toBe(1);

    const firstTech = cards.first().locator("[data-tech]").first();
    await expect(firstTech).toHaveCSS("filter", "grayscale(1)");
    await cards.first().hover();
    await expect(firstTech).toHaveCSS("filter", "grayscale(0)");
    await expect(
      cards.nth(1).locator("[data-tech]").first(),
    ).toHaveCSS("filter", "grayscale(1)");

    await page.mouse.move(0, 0);
    await cards.nth(2).locator("h3 a").focus();
    await expect(
      cards.nth(2).locator("[data-tech]").first(),
    ).toHaveCSS("filter", "grayscale(0)");
    await expect(firstTech).toHaveCSS("filter", "grayscale(1)");
  });

  test("theme follows the system and the override persists", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/en");
    const html = page.locator("html");
    const colorScheme = page.locator('meta[name="color-scheme"]');
    const themeColor = page.locator('meta[name="theme-color"]').first();

    await expect(html).toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light dark");
    await expect(themeColor).toHaveAttribute("content", "#08090a");

    await page
      .getByRole("button", { name: "Switch to light theme" })
      .click();
    await expect(html).not.toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light");
    await expect(themeColor).toHaveAttribute("content", "#ffffff");

    await page.reload();
    await expect(html).not.toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light");
    await expect(
      page.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light dark");
    await expect(themeColor).toHaveAttribute("content", "#08090a");
    expect(
      await page.evaluate(() => localStorage.getItem("mode-watcher-mode")),
    ).toBeNull();
  });

  test("theme follows system changes without an override", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/en");
    const html = page.locator("html");
    const colorScheme = page.locator('meta[name="color-scheme"]');
    const themeColor = page.locator('meta[name="theme-color"]').first();

    await expect(html).not.toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light dark");
    await expect(themeColor).toHaveAttribute("content", "#ffffff");
    await expect(
      page.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeVisible();

    await page.emulateMedia({ colorScheme: "dark" });
    await expect(html).toHaveClass(/dark/);
    await expect(colorScheme).toHaveAttribute("content", "light dark");
    await expect(themeColor).toHaveAttribute("content", "#08090a");
    await expect(
      page.getByRole("button", { name: "Switch to light theme" }),
    ).toBeVisible();
  });

  test("article titles are headings", async ({ page }) => {
    await page.goto("/en/blog/articles");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Writing",
    );
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("post back link is inert until it appears", async ({ page }) => {
    await page.goto("/en/blog/portfolio-wasm");
    const back = page.locator("#back-button");
    await expect(back).toHaveAttribute("inert", "");

    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(back).not.toHaveAttribute("inert", "");
  });

  test("section links stay inside the current locale", async ({ page }) => {
    await page.goto("/zh");

    await expect(
      page.getByRole("link", { name: "关于", exact: true }).first(),
    ).toHaveAttribute("href", "/zh/sections/about");
    await expect(
      page.getByRole("link", { name: "阅读", exact: true }).first(),
    ).toHaveAttribute("href", "/zh/sections/books");
  });

  test("type scale stays within the editorial steps", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/sections/books");
    const bookTitle = await page
      .locator("h1")
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(bookTitle).toBe(36);
    expect(
      await page.locator("main p").first().evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      ),
    ).toBe(16);

    await page.goto("/en");
    const sectionTitle = page.getByRole("heading", {
      name: "Daily tools",
      exact: true,
    });
    expect(
      await sectionTitle.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      ),
    ).toBe(28);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en");
    expect(
      await page.getByRole("heading", { name: "Daily tools", exact: true }).evaluate(
        (element) => parseFloat(getComputedStyle(element).fontSize),
      ),
    ).toBe(24);
    await page.goto("/en/sections/books");
    expect(
      await page.locator("h1").first().evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      ),
    ).toBe(28);
  });

  test("contribution activity overview collapses and expands", async ({
    page,
  }) => {
    await page.goto("/en");
    const card = page.locator("[data-contributions]");
    await card.scrollIntoViewIfNeeded();
    await expect(
      card.getByRole("link", { name: "View GitHub profile" }),
    ).toHaveAttribute("href", "https://github.com/ruizdiazever");
    const trigger = card.getByRole("button", { name: /Activity overview/ });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(card.getByText("Public repositories only")).toBeVisible();
    await expect(
      card.getByRole("img", { name: /Public contribution activity/ }),
    ).toBeVisible();

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("contribution activity stacks without overflowing on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en");
    const card = page.locator("[data-contributions]");
    await card.scrollIntoViewIfNeeded();
    await expect(
      card.getByRole("link", { name: "View GitHub profile" }),
    ).toHaveAttribute("href", "https://github.com/ruizdiazever");
    const trigger = card.getByRole("button", { name: /Activity overview/ });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(card.getByText("Public repositories only")).toBeVisible();
    await expect(
      card.getByRole("img", { name: /Public contribution activity/ }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
  });

  test("contribution card has breathing room and a legend", async ({
    page,
  }) => {
    await page.goto("/en");

    const gap = await page.evaluate(() => {
      const card = document.querySelector("[data-contributions]");
      const sections = document.querySelector("[data-sections]");
      if (!card || !sections) return -1;
      return (
        sections.getBoundingClientRect().top -
        card.getBoundingClientRect().bottom
      );
    });
    expect(gap).toBeGreaterThanOrEqual(20);
    await expect(page.getByText("Less", { exact: true })).toBeVisible();
    await expect(page.getByText("More", { exact: true })).toBeVisible();
  });

  test("contribution grid matches the number of weeks", async ({ page }) => {
    await page.goto("/en");

    const grid = page.locator('[role="img"][aria-label*="contributions"]');
    await expect(grid).toBeVisible();

    const counts = await grid.evaluate((element) => ({
      columns: getComputedStyle(element).gridTemplateColumns
        .split(" ")
        .filter(Boolean).length,
      cells: element.children.length,
    }));

    expect(counts.columns).toBe(
      counts.cells === 0 ? 1 : Math.ceil(counts.cells / 7),
    );
  });

  test("contribution graph stays monochrome until hovered", async ({
    page,
  }) => {
    await page.goto("/en");
    const grid = page.locator('[role="img"][aria-label*="contributions"]');
    await grid.scrollIntoViewIfNeeded();
    await expect(grid).toHaveCSS("filter", "grayscale(1)");

    await grid.hover();
    await expect(grid).toHaveCSS("filter", "grayscale(0)");

    await page.mouse.move(0, 0);
    await expect(grid).toHaveCSS("filter", "grayscale(1)");
  });

  test("footer mascot stays monochrome until hovered", async ({ page }) => {
    await page.goto("/en");
    const mascot = page.locator('footer img[alt*="mascot"]');
    await mascot.scrollIntoViewIfNeeded();
    await expect(mascot).toHaveCSS("filter", "grayscale(1)");

    await mascot.hover();
    await expect(mascot).toHaveCSS("filter", "grayscale(0)");

    await page.mouse.move(0, 0);
    await expect(mascot).toHaveCSS("filter", "grayscale(1)");
  });

  test("footer mascot aligns with its links and copyright", async ({
    page,
  }) => {
    await page.goto("/en");

    const offsets = await page.evaluate(() => {
      const mascot = document.querySelector('footer img[alt*="mascot"]');
      const link = document.querySelector("footer nav a");
      const copyright = document.querySelector(".site-footer-inner > div > p");
      if (!mascot || !link || !copyright) {
        throw new Error("footer is missing its mascot, links or copyright");
      }
      const mascotRect = mascot.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const copyrightRect = copyright.getBoundingClientRect();
      return {
        left: mascotRect.left - linkRect.left,
        center:
          mascotRect.top +
          mascotRect.height / 2 -
          (copyrightRect.top + copyrightRect.height / 2),
      };
    });

    expect(Math.abs(offsets.left)).toBeLessThan(1);
    expect(Math.abs(offsets.center)).toBeLessThan(1);
  });

  test("mobile layout keeps project links and the graph cue visible", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en");

    const maxTechRight = await page.locator("[data-tech]").evaluateAll((links) =>
      Math.max(...links.map((link) => link.getBoundingClientRect().right)),
    );
    expect(maxTechRight).toBeLessThanOrEqual(320);
    await expect(
      page.getByText("Swipe to see the full year"),
    ).toBeVisible();
  });

  test("200 percent text scaling does not clip book pages", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en/sections/books");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });

    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(width.scroll).toBeLessThanOrEqual(width.client);
  });

  test("long blog tables scroll inside their own wrapper", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/en/blog/portfolio-wasm");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });

    const wrapper = page.locator(".table-scroll").first();
    await expect(wrapper).toBeVisible();
    const widths = await wrapper.evaluate((element) => ({
      wrapper: element.clientWidth,
      table: element.scrollWidth,
    }));
    expect(widths.table).toBeGreaterThan(widths.wrapper);
    const pageWidth = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client);
  });

  test("sort icon morphs with the selected order", async ({ page }) => {
    await page.goto("/en/blog/organizations-using-rust");
    await expect(page.getByRole("cell", { name: "AWS", exact: true })).toBeVisible({
      timeout: 15_000,
    });

    const icon = page.locator("[data-sort-morph]").first();
    const before = await icon.locator("path").getAttribute("d");
    await page.getByRole("button", { name: /Name/ }).first().click();
    await page.getByRole("menuitem", { name: "Ascending" }).click();
    await expect
      .poll(() => icon.locator("path").getAttribute("d"))
      .not.toBe(before);
  });

  test("sort menu copy follows the current locale", async ({ page }) => {
    await page.goto("/zh/blog/organizations-using-rust");
    await expect(page.getByRole("cell", { name: "AWS", exact: true })).toBeVisible({
      timeout: 15_000,
    });

    await page.getByRole("button", { name: /名称/ }).first().click();
    await expect(page.getByRole("menuitem", { name: "升序" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "隐藏列" })).toBeVisible();
  });

  test("language switcher navigates to the translated page", async ({ page }) => {
    await page.goto("/en/sections/about");

    await page.getByRole("link", { name: /中文, Switch to Chinese/ }).click();

    await expect(page).toHaveURL(/\/zh\/sections\/about$/);
    await expect(
      page.getByRole("heading", { name: "关于", exact: true }),
    ).toBeVisible();
  });

  test("social links point at the current X profile", async ({ page }) => {
    await page.goto("/en");

    const xLinks = page.locator('a[aria-label="X (Twitter)"]');
    expect(await xLinks.count()).toBeGreaterThan(0);
    for (let index = 0; index < (await xLinks.count()); index++) {
      await expect(xLinks.nth(index)).toHaveAttribute(
        "href",
        "https://x.com/everruizdiazo",
      );
    }

    await page.goto("/en/sections/contact");
    await expect(
      page.getByRole("main").getByRole("link", { name: "X (Twitter)" }),
    ).toHaveAttribute("href", "https://x.com/everruizdiazo");
  });

  test("book filters are shareable through the query string", async ({ page }) => {
    await page.goto("/en/sections/books");

    const technical = page.locator("[data-technical='true']");
    const comics = page.locator("[data-comic='true']");
    expect(await technical.count()).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Comics", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/sections\/books\?filter=comic$/);
    await expect(
      page.getByRole("button", { name: "Comics", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(comics.first()).toBeVisible();
    await expect(technical.first()).toBeHidden();
    await expect(page.locator("#book-filter-status")).toHaveText(
      /Showing \d+ books?/,
    );

    await page.reload();
    await expect(comics.first()).toBeVisible();
    await expect(technical.first()).toBeHidden();

    await page.goBack();
    await expect(page).toHaveURL(/\/en\/sections\/books$/);
    await expect(
      page.getByRole("button", { name: "Technical", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(technical.first()).toBeVisible();
    await expect(page.locator("#book-filter-status")).toHaveText(
      /Showing \d+ books?/,
    );
  });
});
