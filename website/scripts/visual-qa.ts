import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
});
const page = await browser.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(e.message));
await mkdir("artifacts", { recursive: true });
const widths = [
  2560, 1920, 1728, 1512, 1440, 1280, 1024, 834, 768, 430, 393, 375,
];
const results = [];
for (const width of widths) {
  await page.setViewportSize({ width, height: width < 768 ? 812 : 1000 });
  await page.goto("http://127.0.0.1:3000/zh-cn");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/viewport-${width}.png` });
  results.push({
    width,
    ...(await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }))),
  });
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://127.0.0.1:3000/zh-cn");
for (const [name, selector] of Object.entries({
  hero: ".hero",
  manifesto: ".manifesto",
  passage: ".passage",
  pillars: ".pillars",
  software: ".software",
  products: ".products",
  studio: ".studio-section",
  science: ".science",
  company: ".company-section",
})) {
  await page
    .locator(selector)
    .screenshot({ path: `artifacts/${name}-desktop.png` });
}
await page.screenshot({
  path: "artifacts/home-desktop-full.png",
  fullPage: true,
});
const resources = await page.evaluate(() =>
  performance.getEntriesByType("resource").map((e) => {
    const r = e as PerformanceResourceTiming;
    return {
      name: new URL(r.name).pathname,
      bytes: r.transferSize,
      encodedBytes: r.encodedBodySize,
      decodedBytes: r.decodedBodySize,
      type: r.initiatorType,
    };
  }),
);
await page.setViewportSize({ width: 375, height: 812 });
await page.goto("http://127.0.0.1:3000/zh-cn");
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: "artifacts/home-mobile-full.png",
  fullPage: true,
});
await page.screenshot({ path: "artifacts/hero-mobile.png" });
for (const name of ["manifesto", "software", "studio-section", "science"])
  await page
    .locator("." + name)
    .screenshot({ path: `artifacts/${name}-mobile.png` });
const session = await page.context().newCDPSession(page);
await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await session.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: 200000,
  uploadThroughput: 90000,
});
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
const slow = await page.evaluate(() => ({
  title: document.title,
  overflow: document.documentElement.scrollWidth > innerWidth,
  media: document.querySelectorAll("img,video,canvas").length,
}));
await writeFile(
  "artifacts/visual-qa.json",
  JSON.stringify(
    {
      browser: await browser.version(),
      widths: results,
      pageErrors: errors,
      resources,
      slowNetworkCpu4x: slow,
      notes: [
        "Task cloud Chromium, not native Safari or iOS.",
        "720 CSS-pixel reflow used for 1440px at 200% equivalent; not a native browser zoom certification.",
        "No production RUM or INP percentile claim.",
      ],
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  "Saved 12 viewport screenshots, section screenshots, full-page desktop/mobile and QA JSON.",
);
