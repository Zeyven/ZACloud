# ZAITHE review evidence

These screenshots and JSON observations were produced with the task’s cloud Chromium browser. They are QA artifacts, never imported into production runtime.

- [Desktop homepage](home-desktop-full.png)
- [Mobile homepage](home-mobile-full.png)
- [Desktop Passage](passage-spatial-desktop.png)
- [Mobile Passage](passage-spatial-mobile.png)
- [No-JavaScript composition](passage-nojs-mobile.png)
- [Reduced-motion composition](passage-reduced-mobile.png)

Engineering validation and visual review are separate. Native Safari/iOS, production RUM, and a verified contact delivery backend remain outstanding. Video is intentionally excluded.

Reproduce from `website/` using `pnpm exec tsx scripts/visual-qa.ts` and `pnpm exec tsx scripts/spatial-qa.ts`, with the local production server running. Generated artifacts remain ignored under `website/artifacts/`.

## Contact and privacy update

- [Contact, mobile](contact-mobile.png)
- [Privacy, mobile](privacy-mobile.png)

These were inspected separately after the email-app draft implementation. Chromium and actual Edge Linux local tests passed; native Safari/iOS remain unverified. See website/docs/LAUNCH_READINESS.md.
