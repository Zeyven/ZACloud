# ZAITHE / 智行通心 — Website

The ZAITHE website lives in this independent directory. The ZACloud repository’s existing root LICENSE and .gitignore are preserved unchanged. No historical application or Git history was imported. Font license notices are retained in src/fonts/.

## Run locally

```sh
cd website
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Open `http://localhost:3000` or `http://localhost:3000/zh-cn` **inside the task environment**. No public deployment was created. `pnpm dev` is available for development.

## Verify

```sh
pnpm media-policy
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
pnpm exec tsx scripts/visual-qa.ts
pnpm exec tsx scripts/spatial-qa.ts
```

The task environment uses `/usr/bin/chromium`. CI uses downloaded Playwright browsers. Browser projects other than Chromium require their binaries. All screenshots stay in ignored `artifacts/` and are never runtime assets.

## Implementation

- Next.js App Router, React, strict TypeScript, pnpm lockfile.
- Statically generated bilingual pages, server-rendered brand content.
- Client boundaries for the four deterministic product demos, optional Studio and Passage renderer controls, motion preference, and local contact editor.
- Native scrolling and HTML details mobile navigation; both remain usable without JavaScript.
- Self-hosted Inter Latin variable font and Noto Sans CJK SC subset, with licenses.
- `src/lib/site.ts` controls routes, feature flags, locale links, status verification and brand assets.
- `src/lib/metadata.ts` provides canonical URLs and language alternates. Organization schema has no invented offices, legal entity or employees.
- A fail-closed contact API validates requests, limits request size and frequency, checks origin and honeypot, and returns 503 until a verified delivery destination is configured. It does not send email or persist personal data. The UI only checks a local draft and clearly says it is not sent.

## Boundaries

This is a local, reviewable website implementation, not a production deployment. The supplied official SVGs are integrated unchanged as approved runtime copies. Their original downloads failed; complete source text was recovered and rendered, with original identity retained. The measured Passage axis is 39.821659983867036°, fitted from four slightly differing edges. See [geometry and source provenance](docs/PASSAGE.md).

Video is intentionally absent following the latest user instruction. No empty player, skip button or visible asset-required notice is shown. The private content model retains `TVC_ASSET_REQUIRED` for future work.

Product status is `verification: pending, status: null`, not a guessed lifecycle stage. Public diagrams are labeled illustrative. The AYRA walkthrough never calls a model. Science is a research direction, not a claim of experimental results.

## Progressive experiences

- Passage has one lazy WebGL2 runtime with two procedural solids and a recessed light. It starts only on request, stops after a 12-second pass, and preserves an inline SVG composition under low/safe quality, reduced motion or renderer failure. No 3D library, model or texture is loaded.

- Native scroll-driven typography/section translation where supported; no opacity hiding. Reduced motion and a global motion control preserve the static composition.
- Studio has one optional, dynamically imported Canvas renderer. It renders semantic motion trajectories only after a user request; no autoplay or media file. Frame scrubbing and Brief/Direction/Production/Review controls are deterministic.
- The Canvas pauses offscreen, on page visibility changes, on user pause and when motion preferences change. Cleanup cancels RAF and releases the canvas buffer.
- `src/lib/quality.ts` selects ultra/high/medium/low/safe from motion, Save-Data, CPU cores, DPR, viewport and Canvas availability. Draws cap at 12–24 fps and DPR 1–1.75, with measured degradation when draw cost repeatedly exceeds 12ms.
- Nexus supports source/citation selection; Space supports layers, output format and review; Thera requires a human check before changing an example room state. No demo calls a model or business backend.
- `pnpm exec tsx scripts/runtime-qa.ts` records lazy loading, local Canvas draw timing, and interactive screenshots. It does not certify production CWV.

See [delivery report](docs/DELIVERY.md), [audit](docs/AUDIT.md), and [scene decisions](docs/SCENES.md).
