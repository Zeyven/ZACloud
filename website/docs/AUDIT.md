# Repository audit — 2026-10-01

## Observed checkout

- Repository: `ZENTRA` (historical repository name).
- Origin: `https://github.com/Zeyven/ZENTRA.git`.
- HEAD: `0a622ab55ef47bdf14e225f9ce84c76b0a9eb752`.
- Initial worktree: clean.
- Tracked files: README.md, LICENSE, NOTICE, ATTRIBUTION.md, docs/license.md.
- No AGENTS.md or checkout `.agents/skills` instructions were present.
- No application framework/version, package manifest, lockfile, routes, tests, Hero, logos, media, metadata or contact backend in this checkout.
- Original build state: NOT APPLICABLE (no application).
- Existing ZENTRA references occur only in historical documentation/legal notices, preserved unchanged.
- All new runtime files are isolated under `website/`; new CI definition under `.github/workflows/website-ci.yml`.

## Remote read-only checks

`git ls-remote --heads origin` returned ZENTRA, ZA-AYRA, ZA-ANIMA, ZACloud, ZANexus, ZASkills, ZASpace, ZAThera. No separate mother-brand website branch was identified by name. A shallow read-only clone of ZA-AYRA was inspected separately: it contains API, desktop and product website code. That product application was not treated as the mother-brand website, copied, modified or run.

Additional repository review reported: AYRA capabilities remain unverified for production; Nexus and Space branches have only a license; Thera has a controlled-trial codebase with explicit readiness boundaries. These are not runtime test results. This build conservatively retains pending product status and publishes directions and labeled examples only.

## Historical assets — NOT AUDITED

- ZAITHE-Web-App-Icons(1).zip, 514155 bytes.
- ZAITHE-Desktop-Source-20260929-153451.zip.
- ZAITHE-Design-v1.0.zip.
- ZAITHE_对话迁移交接包_2026-09-29.zip.

The icon archive download failed, including retries. No asset bytes, SVG geometry or approval provenance could be inspected. The historical source and design archive downloads also failed because of a network error. These archives were not accessible and are not claimed audited or migrated.

Two supplied images were identified only by metadata as JPEGs; no actual pixel inspection was possible because transfer failed. Neither was included in runtime. The latest instruction explicitly requests no video in this delivery.

## Dependency verification

Registry `npm view next version` returned 16.3.8; installed and locked Next.js 16.3.8 and React/React DOM 19.3.0. Node 24.19.0, pnpm 11.19.0. TypeScript latest 7.0.2 was tested but incompatible with typescript-eslint; pinned supported TypeScript 6.0.3. ESLint 10.11.0 was tested but incompatible with eslint-plugin-react's removed getFilename API; pinned 9.39.5. `pnpm peers check` then reported no peer issues. ESLint 9 is reported deprecated by the registry; this compatibility limitation is recorded for follow-up rather than hidden.

## Risks

- Original notices are unchanged; confirm rights/attribution for public brand distribution before release.
- The initial Logo blocker was resolved by eight separately supplied SVGs. Full source text was recovered after download failures, rendered and measured; production copies are hash-pinned. See PASSAGE.md.
- Contact receiver and legal entity unknown. No invented addresses or outbound delivery.
- CSP currently permits inline scripts/styles for static Next.js output; no user HTML is interpolated. A nonce/hash CSP is a production hardening follow-up.
- Preview contact rate limit is a bounded process-wide limiter; use an approved durable shared limiter before public multi-instance delivery.
- No paid infrastructure, deployment, DNS changes, email, repository publication or PR was performed.

## Attachment delivery — BLOCKED

Uploading the delivery ZIP and desktop/mobile screenshots failed because of a network error. No successful upload or public sharing URL was confirmed. The local delivery archive retains the source, test results and screenshots; attachment delivery remains pending. This was a technical transfer failure, not an authorization denial.

The attempted attachments were `ZAITHE-website-delivery.zip`, `artifacts/home-desktop-full.png` and `artifacts/home-mobile-full.png`. Test evidence paths are relative to `website/`.
