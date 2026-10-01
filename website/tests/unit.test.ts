import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { verifyPolicy } from "../scripts/verify-media-policy";
import {
  routes,
  localPath,
  parsePath,
  products,
  brandAssets,
} from "../src/lib/site";
import { pageMetadata } from "../src/lib/metadata";
test("every route preserves meaning through language switch", () => {
  for (const route of routes) {
    for (const locale of ["en", "zh-cn"] as const) {
      const path = localPath(locale, route);
      assert.deepEqual(parsePath(path.split("/").filter(Boolean)), {
        locale,
        route,
      });
      const metadata = pageMetadata(locale, route);
      assert.equal(metadata.alternates?.canonical, path);
    }
  }
});
test("unverified status never becomes an availability claim", () => {
  for (const p of products) {
    assert.equal(p.status.verification, "pending");
    assert.equal(p.status.status, null);
  }
  assert(brandAssets.passageAngle > 39 && brandAssets.passageAngle < 41);
  assert.equal(brandAssets.heroFilm, null);
  assert(!routes.includes("research"));
});
test("media guard rejects nested assets and dangerous source pathways", async () => {
  const root = await mkdtemp(join(tmpdir(), "za-policy-"));
  try {
    await mkdir(join(root, "public/brand"), { recursive: true });
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(join(root, "public/brand/unapproved.svg"), "<svg/>");
    await writeFile(join(root, "src/bad.tsx"), '<img src="/fake.png"/>');
    await writeFile(
      join(root, "src/bad.css"),
      'a{background:url("https://example.test/a.png")}',
    );
    assert.equal((await verifyPolicy(root)).length, 3);
    await rm(join(root, "public/brand/unapproved.svg"));
    await writeFile(
      join(root, "src/bad.tsx"),
      '<svg><path d="M0 0L1 1"/></svg>',
    );
    await writeFile(
      join(root, "src/bad.css"),
      "a{background:linear-gradient(black,white)}",
    );
    assert.deepEqual(await verifyPolicy(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
import { createRateLimiter, validateContact } from "../src/lib/contact";
test("contact rejects missing consent, invalid addresses, unknown topics and excessive input", () => {
  const valid = {
    name: "Test",
    email: "a@example.test",
    message: "Hello",
    topic: "General",
    consent: true,
  };
  assert(validateContact(valid));
  for (const fields of [
    { consent: false },
    { email: "not-email" },
    { message: "x".repeat(5001) },
    { topic: "Unknown" },
  ])
    assert.equal(validateContact({ ...valid, ...fields }), null);
});
test("rate limit is bounded and resets", () => {
  const allow = createRateLimiter(2, 100);
  assert(allow(1));
  assert(allow(2));
  assert(!allow(3));
  assert(allow(102));
});

import {
  chooseQuality,
  lowerQuality,
  qualityBudgets,
} from "../src/lib/quality";
test("quality policy respects motion, data, CPU, DPR and rendering capability", () => {
  const base = {
    width: 1920,
    dpr: 1,
    cores: 8,
    reducedMotion: false,
    saveData: false,
    canvas: true,
  };
  assert.equal(chooseQuality(base), "ultra");
  assert.equal(chooseQuality({ ...base, cores: 2 }), "low");
  assert.equal(chooseQuality({ ...base, dpr: 3 }), "medium");
  for (const override of [
    { reducedMotion: true },
    { saveData: true },
    { canvas: false },
  ])
    assert.equal(chooseQuality({ ...base, ...override }), "safe");
  assert.equal(lowerQuality("low"), "safe");
  assert.equal(lowerQuality("safe"), "safe");
  assert.equal(qualityBudgets.safe.fps, 0);
});
import { readBoundedBody, BodyReadError } from "../src/lib/read-body";
test("body reader rejects oversized and stalled streams without buffering an unlimited request", async () => {
  assert.equal(
    await readBoundedBody(
      new Request("http://localhost", { method: "POST", body: "hello" }),
      5,
    ),
    "hello",
  );
  await assert.rejects(
    readBoundedBody(
      new Request("http://localhost", { method: "POST", body: "too big" }),
      3,
    ),
    (e) => e instanceof BodyReadError && e.code === "PAYLOAD_TOO_LARGE",
  );
  const body = new ReadableStream<Uint8Array>({ start() {} });
  const request = new Request("http://localhost", {
    method: "POST",
    body,
    duplex: "half",
  } as RequestInit);
  await assert.rejects(
    readBoundedBody(request, 20, 10),
    (e) => e instanceof BodyReadError && e.code === "REQUEST_TIMEOUT",
  );
});

import { passage } from "../src/lib/passage";
import { chooseSpatialQuality, spatialBudgets } from "../src/spatial/quality";
test("Passage derives from four measured long edges and spatial safety overrides enhancements", () => {
  assert.equal(passage.edges.length, 4);
  assert(passage.angleDegrees >= passage.rangeDegrees[0]);
  assert(passage.angleDegrees <= passage.rangeDegrees[1]);
  assert.notEqual(passage.rangeDegrees[0], passage.rangeDegrees[1]);
  const signals = {
    width: 1920,
    dpr: 1,
    cores: 8,
    reducedMotion: false,
    saveData: false,
    canvas: true,
    webgl2: true,
  };
  assert.equal(chooseSpatialQuality({ ...signals, webgl2: false }), "safe");
  assert.equal(
    chooseSpatialQuality({ ...signals, reducedMotion: true }),
    "safe",
  );
  assert.equal(chooseSpatialQuality({ ...signals, saveData: true }), "safe");
  assert.equal(chooseSpatialQuality({ ...signals, cores: 2 }), "low");
  assert.equal(spatialBudgets.low.fps, 0);
});
test("media guard rejects tampered approved Logo bytes", async () => {
  const root = await mkdtemp(join(tmpdir(), "za-logo-"));
  try {
    await mkdir(join(root, "public/brand"), { recursive: true });
    await writeFile(join(root, "public/brand/zaithe-nav-white.svg"), "<svg/>");
    assert.match((await verifyPolicy(root)).join("\n"), /hash mismatch/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

import { contactMailto } from "../src/lib/contact-mailto";
test("contact draft encodes user text without changing destination or query fields", () => {
  const fields = {
    name: "测试 & Name",
    email: "visitor@example.test",
    company: "",
    topic: "General",
    message: "Line one\n&bcc=attacker@example.test\n中文",
  };
  const url = new URL(contactMailto(fields));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "zaithe@zaithe.com");
  assert.equal(url.searchParams.get("subject"), "ZAITHE / General");
  assert.equal(url.searchParams.has("bcc"), false);
  assert(url.searchParams.get("body")?.endsWith(fields.message));
});
