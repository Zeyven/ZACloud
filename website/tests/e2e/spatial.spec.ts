import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("approved logo loads, spatial runtime is opt-in, finite and controllable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".brand-logo")).toHaveCount(4);
  expect(
    await page
      .locator(".brand-logo")
      .evaluateAll((images) =>
        images.every(
          (i) =>
            (i as HTMLImageElement).complete &&
            (i as HTMLImageElement).naturalWidth === 512,
        ),
      ),
  ).toBe(true);
  await expect(page.locator(".monument canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Enter the passage" }).focus();
  await page.keyboard.press("Enter");
  const host = page.locator(".monument");
  await expect(host).toHaveAttribute("data-mode", "webgl2");
  await expect(host).toHaveAttribute("data-running", "true");
  await page.getByRole("button", { name: "Pause passage" }).click();
  await expect(host).toHaveAttribute("data-running", "false");
  const count = await host.getAttribute("data-frames");
  await page.waitForTimeout(150);
  expect(await host.getAttribute("data-frames")).toBe(count);
  await page.getByRole("button", { name: "Continue passage" }).click();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(host).toHaveAttribute("data-running", "false");
  await host.scrollIntoViewIfNeeded();
  await expect(host).toHaveAttribute("data-running", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: true,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(host).toHaveAttribute("data-running", "false");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: false,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(host).toHaveAttribute("data-running", "true");
  // The cinematic pass ends itself; no endless render loop.
  await expect(host).toHaveAttribute("data-running", "false", {
    timeout: 20000,
  });
  expect(JSON.parse((await host.getAttribute("data-stats"))!).progress).toBe(1);
  const axe = await new AxeBuilder({ page }).include(".passage").analyze();
  expect(axe.violations).toEqual([]);
  expect(errors).toEqual([]);
});
test("spatial fallback preserves composition under device and preference limits", async ({
  browser,
}) => {
  for (const mode of ["reduced", "data", "cpu", "no-webgl", "shader-failed"]) {
    const context = await browser.newContext({
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
    });
    await context.addInitScript((mode) => {
      if (mode === "data")
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true },
          configurable: true,
        });
      if (mode === "cpu")
        Object.defineProperty(navigator, "hardwareConcurrency", { value: 2 });
      if (mode === "no-webgl") {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          this: HTMLCanvasElement,
          ...args: Parameters<typeof original>
        ) {
          if (String(args[0]).startsWith("webgl")) return null;
          return original.apply(this, args);
        } as typeof original;
      }
      if (mode === "shader-failed")
        WebGL2RenderingContext.prototype.getShaderParameter = () => false;
    }, mode);
    const p = await context.newPage();
    await p.goto("/");
    await p.getByRole("button", { name: "Enter the passage" }).click();
    await expect(
      p.getByRole("button", { name: "Static view", exact: true }),
    ).toBeDisabled();
    await expect(p.locator(".monument")).toHaveAttribute("data-mode", "static");
    await expect(p.locator(".monument-fallback")).not.toHaveClass(/enhanced/);
    await expect(p.locator(".passage h2")).toBeVisible();
    await context.close();
  }
});
test("context loss and changed motion preference release the spatial scene", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter the passage" }).click();
  await expect(page.locator(".monument")).toHaveAttribute(
    "data-mode",
    "webgl2",
  );
  await page
    .locator(".monument canvas")
    .evaluate((c) =>
      (c as HTMLCanvasElement)
        .getContext("webgl2")!
        .getExtension("WEBGL_lose_context")!
        .loseContext(),
    );
  await expect(page.locator(".monument")).toHaveAttribute(
    "data-mode",
    "static",
  );
  await expect(
    page.getByRole("button", { name: "Static view", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await page.getByRole("button", { name: "Enter the passage" }).click();
  await expect(page.locator(".monument")).toHaveAttribute(
    "data-mode",
    "webgl2",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".monument")).toHaveAttribute(
    "data-running",
    "false",
  );
  await expect(page.locator(".monument-fallback")).not.toHaveClass(/enhanced/);
});
test("sustained slow frame pacing falls back instead of maintaining an expensive loop", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = requestAnimationFrame;
    let virtual = 0;
    window.requestAnimationFrame = (callback) =>
      original(() => {
        virtual += 90;
        callback(virtual);
      });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Enter the passage" }).click();
  await expect(
    page.getByRole("button", { name: "Static view", exact: true }),
  ).toBeDisabled({ timeout: 12000 });
  await expect(page.locator(".monument")).toHaveAttribute(
    "data-running",
    "false",
  );
});
