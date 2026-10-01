# Official identity and Passage geometry

The eight SVGs supplied on 2026-10-01 were read in full. Their transfer downloads failed. Local source copies were therefore recovered from the complete original SVG text returned by the file reader, not from a successful binary download. All eight recovered byte counts match the reported ASCII source sizes (691, 739 or 745 bytes), source identity was retained, and the SVGs were actually rendered for inspection. Original filenames and files remain unchanged in the source archive outside this delivery.

Production copies use the original bytes of `zentra-nav-white.svg`, `zentra-nav-charcoal.svg` and `zentra-app-obsidian.svg`, under `public/brand/zaithe-*.svg`. The paths, transforms and colors are unchanged. Jade/navy variants are not used. SHA-256 values in `scripts/approved-brand-assets.json` pin the three approved runtime files. `artifacts/approved-logo-review.png` records the eight supplied variants as a test artifact, not runtime media.

## Reproducible axis measurement

Run from `website/`:

```sh
pnpm exec tsx scripts/measure-passage.ts
pnpm exec tsx scripts/measure-passage.ts --check
```

The script parses the two approved path strings and selects the four explicit diagonal `L` edges longer than 400 source units. Curves, short transitions, vertical/horizontal outer edges and closing segments do not define the principal Passage direction. The uniform scale and translation in the SVG preserve angle.

For each edge, compute `atan2(dy, dx)`, normalized to the same unoriented axis. Fit the common axis with a length-weighted axial circular mean: `0.5 × atan2(Σ length × sin(2θ), Σ length × cos(2θ))`.

- Individual edge range: **39.749055249958104°–39.90188955498894°**.
- Fitted axis: **39.821659983867036°**, clockwise from the horizontal in screen coordinates.
- This is a measured representative axis, not a claim that all SVG segments are parallel or exactly 40°.
- `src/lib/passage.ts` is generated from the approved white SVG and contains all endpoints, individual measurements and source hash. It is the single source for the CSS variable `--za-passage-angle`, inline SVG rotation and shader uniform. Build validation rejects stale geometry.

## Spatial implementation

`src/spatial/types.ts` defines renderer operations; the React component calls this abstraction rather than WebGL commands. `src/spatial/runtime.ts` owns one WebGL2 context, camera projection, shared procedural box geometry, material shaders, recessed light, lifecycle and performance observations. No renderer package, external model, texture, postprocessing or WebGPU requirement is introduced.

The scene is a spatial interpretation of the measured negative-space direction, not an extruded redraw of the logo. Two large graphite solids frame a recessed pearl light. A 12-second, user-started pass gently opens the gap and moves the camera. It stops itself, supports pause, and retains all semantic text in DOM. Native scrolling remains in control.

The renderer issues 3 draw calls for 36 triangles, using 1 geometry buffer, 1 program and 0 textures. Ultra/high/medium tiers cap DPR at 1.75/1.5/1 and FPS at 30/30/24; the framebuffer is also capped at 3 million pixels. Low/safe use the static composition. Reduced motion, Save-Data, a disabled motion preference, context/shader failure or unavailable WebGL preserve the same diagonal composition. Sustained main-thread submission or callback pacing overruns lower quality until static fallback.

Leaving the viewport or hiding the page pauses work. Preference changes dispose the scene. Context loss falls back rather than repeatedly trying to restore. Component cleanup cancels animation callbacks and frees GL buffers, programs and vertex arrays. The runtime is fetched only after the visitor requests it; there is no default animation loop.

Submission timings are CPU-side observations, not GPU elapsed time or production Core Web Vitals. Cloud Chromium may use software rendering. Physical Safari/iOS, battery, thermal and long-term memory measurements remain separate release checks.
