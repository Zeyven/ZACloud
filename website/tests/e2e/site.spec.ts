import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routes } from "../../src/lib/site";
const widths = [
  2560, 1920, 1728, 1512, 1440, 1280, 1024, 834, 768, 430, 393, 375,
];
test("responsive composition has no horizontal overflow at all specified widths", async ({
  page,
}, info) => {
  await page.goto("/zh-cn");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => getComputedStyle(document.body).fontFamily),
  ).toContain("inter");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width}px`,
    ).toBe(true);
  }
  await page.screenshot({
    path: `artifacts/${info.project.name}-mobile-375.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: `artifacts/${info.project.name}-desktop-1440.png`,
    fullPage: true,
  });
});
test("routes, metadata, semantic language switching and no unavailable research", async ({
  page,
}) => {
  for (const route of routes) {
    const response = await page.goto("/" + route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      "https://zaithe.com" + (route ? "/" + route : ""),
    );
    await page.locator(".language").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    expect(page.url()).toContain("/zh-cn" + (route ? "/" + route : ""));
  }
  expect((await page.goto("/research"))?.status()).toBe(404);
});
test("walkthrough, keyboard, menu and browser back", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.locator(".demo-detail h3")).toHaveText("Define the plan");
  await page.setViewportSize({ width: 393, height: 852 });
  await page.locator("summary").click();
  await page
    .locator(".mobile-menu")
    .getByRole("link", { name: "Company" })
    .click();
  await expect(page).toHaveURL(/company/);
  await page.goBack();
  await expect(page.locator("h1")).toContainText("ZAITHE");
  expect(errors).toEqual([]);
});
test("no media, reduced motion and 200 percent layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh-cn");
  await expect(page.locator("video, img:not(.brand-logo), canvas")).toHaveCount(
    0,
  );
  await page.setViewportSize({ width: 720, height: 500 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator("main")).toBeVisible();
});
test("JS disabled keeps complete brand content and navigable mobile menu", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto("/zh-cn");
  for (const selector of [
    ".hero",
    ".manifesto",
    ".pillars",
    ".products",
    ".studio-section",
    ".science",
    ".company-section",
    "footer",
  ])
    await expect(page.locator(selector)).toBeVisible();
  await page.locator("summary").click();
  await page
    .locator(".mobile-menu")
    .getByRole("link", { name: "公司" })
    .click();
  await expect(page).toHaveURL(/company/);
  await context.close();
});
test("WCAG automated checks on homepage and contact", async ({ page }) => {
  for (const route of [
    "/",
    "/zh-cn",
    "/contact",
    "/privacy",
    "/terms",
    "/products/za-nexus",
    "/products/za-space",
    "/products/za-thera",
    "/studio",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
test("contact creates an explicit email draft without submitting user data", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.addInitScript(() => {
    document.addEventListener(
      "click",
      (event) => {
        const link = (event.target as HTMLElement).closest("a");
        if (link?.href.startsWith("mailto:")) {
          event.preventDefault();
          (window as Window & { draft?: string }).draft = link.href;
        }
      },
      true,
    );
  });
  await page.goto("/contact");
  await page.getByLabel("Name", { exact: true }).fill("Test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.test");
  await page
    .getByLabel("Message", { exact: true })
    .fill("A local test message.");
  await page.locator("input[type=checkbox]").check();
  await page.getByRole("button", { name: "Create email" }).click();
  await expect(page.getByRole("status")).toContainText("has not been sent");
  const draft = new URL(
    await page.evaluate(() => (window as Window & { draft?: string }).draft || ""),
  );
  expect(draft.pathname).toBe("zaithe@zaithe.com");
  expect(draft.searchParams.get("body")).toContain("A local test message.");
  expect(posts).toEqual([]);
});
test("every route fits mobile and protected contact endpoint fails closed", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of routes) {
    await page.goto("/zh-cn" + (route ? "/" + route : ""));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  const response = await request.post("/api/contact", {
    data: {
      name: "Test",
      email: "test@example.test",
      company: "",
      topic: "General",
      message: "Test only",
      consent: true,
      website: "",
    },
  });
  expect(response.status()).toBe(503);
  expect((await response.json()).error).toBe("CONTACT_NOT_CONFIGURED");
  const invalid = await request.post("/api/contact", {
    data: { name: "Test" },
  });
  expect(invalid.status()).toBe(400);
});

test("touch navigation and orientation retain the composition", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/zh-cn");
  await page.locator("summary").tap();
  await page.locator(".mobile-menu").getByRole("link", { name: "产品" }).tap();
  await expect(page).toHaveURL(/products/);
  await page.setViewportSize({ width: 852, height: 393 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("distinct deterministic product demonstrations preserve human review", async ({
  page,
}) => {
  await page.goto("/products/za-nexus");
  await page.getByRole("button", { name: /S02.*Review note/ }).click();
  await expect(page.locator(".citation-panel blockquote")).toContainText(
    "Tab key",
  );
  await page.goto("/products/za-space");
  await page.getByRole("button", { name: "4:5", exact: true }).click();
  await page.getByLabel("Composition layers").press("End");
  await page.getByLabel("Composition layers").press("ArrowLeft");
  await page.getByLabel("Composition layers").press("ArrowLeft");
  await page.getByRole("button", { name: /^Review composition/ }).click();
  await expect(page.locator(".space-settings p[role=status]")).toContainText(
    "11 layers / 4:5",
  );
  await page.goto("/products/za-thera");
  const confirm = page.getByRole("button", { name: "Confirm room available" });
  await expect(confirm).toBeDisabled();
  await page.getByLabel("Cleaning check completed").check();
  await confirm.click();
  await expect(page.getByRole("status")).toContainText("human approved");
  await page.getByRole("button", { name: "Reset example" }).click();
  await expect(confirm).toBeDisabled();
});

test("Studio lazy runtime plays only on request and stops offscreen, on pause and reduced motion", async ({
  page,
}) => {
  await page.goto("/studio");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Explore motion" }).click();
  const host = page.locator(".studio-experience");
  await expect(host).toHaveAttribute("data-running", "true");
  await expect(page.locator("canvas")).toBeVisible();
  await page.waitForTimeout(350);
  const before = Number(await host.getAttribute("data-frames"));
  expect(before).toBeGreaterThan(1);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(host).toHaveAttribute("data-running", "false");
  const paused = await host.getAttribute("data-frames");
  await page.waitForTimeout(200);
  expect(await host.getAttribute("data-frames")).toBe(paused);
  await page.getByRole("button", { name: "Explore motion" }).click();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(host).toHaveAttribute("data-running", "false");
  await host.scrollIntoViewIfNeeded();
  await expect(host).toHaveAttribute("data-running", "true");
  await page
    .getByRole("button", { name: "Reduce motion", exact: true })
    .click();
  await expect(host).toHaveAttribute("data-running", "false");
  await page.goto("/studio");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Explore motion" }).click();
  await expect(page.locator(".studio-experience p[role=status]")).toContainText(
    "Static composition",
  );
  await expect(host).toHaveAttribute("data-running", "false");
});

test("Studio production selection and frame scrub are deterministic", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.locator(".production-stages button").nth(3).click();
  await expect(page.locator(".production-note")).toContainText(
    "Review the composition",
  );
  await page.getByLabel("Composition frame").press("End");
  await expect(page.locator(".studio-controls output")).toHaveText("240");
  await expect(page.locator(".studio-experience")).toHaveAttribute(
    "data-running",
    "false",
  );
});

test("quality fallbacks and page visibility stop Canvas work", async ({
  browser,
}) => {
  for (const kind of ["save-data", "no-canvas"]) {
    const context = await browser.newContext();
    await context.addInitScript((mode) => {
      if (mode === "save-data")
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true },
          configurable: true,
        });
      else HTMLCanvasElement.prototype.getContext = () => null;
    }, kind);
    const page = await context.newPage();
    await page.goto("/studio");
    await page.getByRole("button", { name: "Explore motion" }).click();
    await expect(
      page.locator(".studio-experience p[role=status]"),
    ).toContainText("Static composition");
    await expect(page.locator(".studio-experience")).toHaveAttribute(
      "data-running",
      "false",
    );
    await context.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/studio");
  await page.getByRole("button", { name: "Explore motion" }).click();
  const host = page.locator(".studio-experience");
  await expect(host).toHaveAttribute("data-running", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(host).toHaveAttribute("data-running", "false");
  const frames = await host.getAttribute("data-frames");
  await page.waitForTimeout(200);
  expect(await host.getAttribute("data-frames")).toBe(frames);
  await context.close();
});
