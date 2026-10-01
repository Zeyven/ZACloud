import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(e.message));
const chunks: string[] = [];
page.on("request", (request) => {
  if (request.url().endsWith(".js"))
    chunks.push(new URL(request.url()).pathname);
});
await page.goto("http://localhost:3000/studio");
const before = [...chunks];
await page.getByRole("button", { name: "Explore motion" }).click();
await page.waitForFunction(
  () =>
    document
      .querySelector(".studio-experience")
      ?.getAttribute("data-running") === "true",
);
await page.evaluate(() => {
  const values: number[] = [];
  (window as Window & { zaSamples?: number[] }).zaSamples = values;
  const node = document.querySelector(".studio-experience")!;
  const observer = new MutationObserver(() => {
    const n = Number(node.getAttribute("data-frame-ms"));
    if (n > 0) values.push(n);
  });
  observer.observe(node, {
    attributes: true,
    attributeFilter: ["data-frame-ms"],
  });
});
await page.waitForTimeout(1800);
await page
  .locator(".studio-experience")
  .screenshot({ path: "artifacts/studio-interactive-desktop.png" });
const measured = await page.evaluate(() => ({
  samples: (window as Window & { zaSamples?: number[] }).zaSamples || [],
  quality: document
    .querySelector(".studio-experience")
    ?.getAttribute("data-quality"),
  frames: document
    .querySelector(".studio-experience")
    ?.getAttribute("data-frames"),
}));
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await page.waitForTimeout(1400);
await page.getByRole("button", { name: "Pause motion" }).click();
const cpu = await page
  .locator(".studio-experience")
  .getAttribute("data-quality");
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
await page.setViewportSize({ width: 375, height: 812 });
await page.getByRole("button", { name: "Explore motion" }).click();
await page
  .locator(".studio-experience")
  .screenshot({ path: "artifacts/studio-interactive-mobile.png" });
await page.getByRole("button", { name: "Pause motion" }).click();
for (const [route, name] of [
  ["za-nexus", "nexus"],
  ["za-space", "space"],
  ["za-thera", "thera"],
]) {
  await page.goto("http://localhost:3000/products/" + route);
  await page
    .locator(".interactive-demo")
    .screenshot({ path: `artifacts/${name}-demo-mobile.png` });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .locator(".interactive-demo")
    .screenshot({ path: `artifacts/${name}-demo-desktop.png` });
  await page.setViewportSize({ width: 375, height: 812 });
}
const sorted = measured.samples.toSorted((a, b) => a - b);
await writeFile(
  "artifacts/runtime-qa.json",
  JSON.stringify(
    {
      browser: await browser.version(),
      initialScriptRequests: before,
      lateScriptRequests: chunks.filter((p) => !before.includes(p)),
      canvasFrames: measured.frames,
      quality: measured.quality,
      cpu4xQuality: cpu,
      renderSamples: sorted.length,
      p95DrawMs: sorted[Math.floor(sorted.length * 0.95)] ?? null,
      pageErrors: errors,
      scope:
        "Local Canvas draw timing, not overall frame time, INP or production RUM. Visibility event and offscreen pause are tested separately in Playwright.",
    },
    null,
    2,
  ),
);
await browser.close();
console.log("Runtime QA and interactive screenshots saved.");
