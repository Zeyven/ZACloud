# Launch readiness — 2026-10-01

## Implemented

- User-confirmed operator: 智行通心（湖北）科技有限公司; public email: zaithe@zaithe.com.
- User selected visitor-owned mail drafts. Contact fields are percent-encoded into a fixed-recipient mailto URI; the UI states that a draft is not a sent message. No SMTP sender, automated response or website form upload is required. The guarded old POST API remains fail-closed.
- Bilingual privacy and terms now explain actual form behavior, selected infrastructure/mail providers, purpose, purpose-based retention, choices, rights requests, demonstration limits and IP/license boundaries. These texts do not certify unknown server logging or mailbox administration. Source reference: https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm (personal-information disclosure and necessary retention principles).
- Standalone Next runtime, Dockerfile, non-root app, loopback-only port3090, read-only filesystem, bounded Docker logs, Caddy HTTPS configuration, `/api/health`, and configurable build-time canonical origin.
- Deployment host supplied by user: zaithe.com. The user also identified www.zaithe.com; redirect configuration awaits DNS/entry-point inspection. Domain/DNS changes have not been made.

## Verified locally

- lint / typecheck / production build / media scan passed.
- 10 unit tests passed, including mailto query injection and Unicode round-trip.
- 34 Chromium + actual Microsoft Edge tests passed. Edge Linux version 154.0.4258.48, official Microsoft package hash verified. Covered all12 widths, all Chinese routes at375px, keyboard, reflow, JS-off, reduced motion, product demos, renderer lifecycle, contact draft and WCAG automated checks including legal pages.
- Fresh server enforced in Playwright. An earlier local run was invalid because an unrelated old preview at3000 was reused; it was discarded and rerun on3005 against a fresh build. No failures were hidden by changing product behavior.
- Separate standalone health200 and contact/privacy mobile screenshots inspected. Screenshots are QA-only assets.
- Compose configuration validated. Full container build blocked by task-container DNS and then the proxy certificate chain; runtime/container result is recorded separately below and must not be inferred from the Next build.

## Blocked / unverified

- SSH connection to the provided server on port22 returned Connection refused, including an explicit network-permitted read-only retry. No server configuration, existing sites, runtime logs, network ports or resources were inspected or changed. The actual SSH port, service availability and firewall route must be resolved.
- The user provided server-side evidence that ssh.service is active and port22 is listening; a new task-side retry was still refused. Existing Nginx owns80/443 and several Next/DB services exist. Default Compose startup therefore only starts the app on an independent loopback port; no existing entrypoint may be replaced without inspecting its site configuration.
- DNS lookups from this task environment failed for the website and mailbox host. This is not proof the public DNS is wrong. Verify authoritative DNS from an independent resolver before deployment.
- ICP filing status is not provided. No filing number is fabricated or displayed.
- No HTTPS certificate, public deployment, mail-client send or inbox receipt is certified.
- No native macOS Safari or iOS device was available; Playwright WebKit is an engine test, not an Apple-device certificate. Edge coverage is Linux, not Windows.
- No production RUM samples exist. Lab results cannot establish75th-percentile CWV.

## Native Safari / iOS acceptance

Record device model, OS/browser version, date, final origin and screenshot/result for each check. Use real Mac Safari and real iPhone Safari at375/393/430 widths where devices permit; browser emulation does not replace this record.

1. Navigate both languages and semantic switches; check menu keyboard/touch focus, headings, reading and horizontal overflow.
2. Test portrait/landscape, Safari back/forward, 200% zoom and text enlargement.
3. Verify default static content, reduced motion and disabled-JS paths without blank sections.
4. Start/pause/leave/revisit Passage and Studio, background the tab, confirm bounded playback and static fallback on graphics failure.
5. Fill a harmless test contact, confirm the chosen mail app opens with the exact fixed recipient and intact Unicode text, edit/cancel, then explicitly send a test message and confirm receipt in the company mailbox. Try missing/default mail-app cases and maximum-length text; the fallback email address remains visible.
6. Inspect console/network for hydration errors and missing fonts/assets. Check HTTPS and final canonical/hreflang.

Any observed failure needs an issue and correction before calling native acceptance complete. Infrastructure and native-device results can be appended without inventing evidence.

## Container build correction

The first remote container job failed because Docker's dependency-install layer copied package.json and lockfile but omitted the existing pnpm-workspace.yaml policy. The Dockerfile now copies that policy before installation. It preserves the repository's already pinned package exceptions and build allowlist; no package-age policy was disabled or expanded. Final result is the latest matching workflow.
