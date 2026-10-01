import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(e.message));
const js: string[] = [];
page.on("request", (r) => {
  if (new URL(r.url()).pathname.endsWith(".js"))
    js.push(new URL(r.url()).pathname);
});
await page.goto("http://127.0.0.1:3000/zh-cn");
await page.evaluate(() => document.fonts.ready);
const before = [...js];
await page.locator(".passage").scrollIntoViewIfNeeded();
await page
  .locator(".passage")
  .screenshot({ path: "artifacts/passage-static-desktop.png" });
await page.getByRole("button", { name: "进入空间" }).click();
await page.waitForFunction(
  () =>
    document.querySelector<HTMLElement>(".monument")?.dataset.mode === "webgl2",
);
const samples: number[] = [];
for (let i = 0; i < 35; i++) {
  await page.waitForTimeout(45);
  const s = await page.locator(".monument").getAttribute("data-stats");
  if (s) samples.push(JSON.parse(s).frameMs);
}
await page.getByRole("button", { name: "暂停空间" }).click();
await page.locator(".passage").scrollIntoViewIfNeeded();
await page.waitForTimeout(100);
await page
  .locator(".passage")
  .screenshot({ path: "artifacts/passage-spatial-desktop.png" });
const desktop = JSON.parse(
  (await page.locator(".monument").getAttribute("data-stats"))!,
);
const lazyJs = js.filter((x) => !before.includes(x));
const client = await page.context().newCDPSession(page);
await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await page.getByRole("button", { name: "继续空间" }).click();
await page.waitForTimeout(700);
const cpu4x = JSON.parse(
  (await page.locator(".monument").getAttribute("data-stats"))!,
);
await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
await page.setViewportSize({ width: 375, height: 812 });
await page.reload();
await page.locator(".passage").scrollIntoViewIfNeeded();
await page
  .locator(".passage")
  .screenshot({ path: "artifacts/passage-static-mobile.png" });
await page.getByRole("button", { name: "进入空间" }).click();
await page.waitForTimeout(350);
await page.getByRole("button", { name: "暂停空间" }).click();
await page.locator(".passage").scrollIntoViewIfNeeded();
await page
  .locator(".passage")
  .screenshot({ path: "artifacts/passage-spatial-mobile.png" });
const mobile = JSON.parse(
  (await page.locator(".monument").getAttribute("data-stats"))!,
);
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > innerWidth,
);
await page.emulateMedia({ reducedMotion: "reduce" });
await page
  .locator(".passage")
  .screenshot({ path: "artifacts/passage-reduced-mobile.png" });
const nojs = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 375, height: 812 },
});
const staticPage = await nojs.newPage();
await staticPage.goto("http://127.0.0.1:3000/zh-cn");
await staticPage
  .locator(".passage")
  .screenshot({ path: "artifacts/passage-nojs-mobile.png" });
samples.sort((a, b) => a - b);
await writeFile(
  "artifacts/spatial-qa.json",
  JSON.stringify(
    {
      browser: await browser.version(),
      samples: samples.length,
      p95SubmissionMs: samples[Math.floor(samples.length * 0.95)],
      desktop,
      cpu4x,
      mobile,
      mobileOverflow: overflow,
      lazyJs,
      pageErrors: errors,
      notes: [
        "Cloud Chromium; WebGL may use software rendering.",
        "CPU submission timing, not GPU elapsed time or production RUM.",
        "No native Safari/iOS or physical thermal/battery certification.",
      ],
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  "Spatial screenshots, lazy-load requests and bounded runtime metrics recorded.",
);
