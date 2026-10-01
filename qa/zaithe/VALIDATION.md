# Delivery validation

The copied application was freshly installed with its frozen lockfile in the target checkout and checked again.

| Check | Result |
|---|---|
| ESLint | PASS |
| TypeScript | PASS |
| Unit tests | PASS — 9 tests |
| Production build | PASS |
| Approved-media hashes and Passage measurement | PASS |
| Chromium Playwright | PASS — 17 tests |
| Secret/internal-information source scan | PASS |
| Target LICENSE and .gitignore | Unchanged |

The browser suite includes all 12 requested widths, mobile routes, keyboard navigation, JavaScript disabled, reduced motion, deterministic product interactions, spatial lifecycle, failure fallback and sustained slow-frame degradation. Visual screenshots were separately inspected; test success is not a substitute for visual review.

Firefox/WebKit browser downloads were blocked in the task environment. Native Safari/iOS and Edge were not certified. There is no production RUM measurement, verified contact receiver or deployment in this delivery.

## Remote browser matrix

GitHub Actions installed Chromium, Firefox and WebKit successfully. The first run passed 48 of 51 browser tests; its three failures exposed assumptions in the spatial tests: Firefox's headless runner lacked WebGL2, and a measured WebKit performance fallback was mistaken for completed playback. The revised checks probe actual WebGL2 availability and distinguish pause, finite completion and measured low-tier fallback. Shader failures on a capable runner still fail the normal playback test. GPU-specific coverage is annotated when the runner cannot provide a context.

Native Safari/iOS remains a separate device acceptance requirement; Playwright WebKit does not certify it. See the branch's latest Website checks run for the current matrix result.

## Email draft and launch configuration update

The user selected visitor-owned email drafts. New local Chromium + Microsoft Edge Linux checks passed34 tests; unit tests passed10. The mobile contact and privacy screenshots were inspected separately. Standalone health returned200, and Compose configuration was validated. Native Safari/iOS and public deployment remain blocked, not passed. Current container/CI results must be read from the latest branch workflow; earlier reports describe earlier commits.
