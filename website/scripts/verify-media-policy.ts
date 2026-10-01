import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import approved from "./approved-brand-assets.json";
export const approvedAssets: Readonly<Record<string, string>> = approved;
const banned =
  /\.(?:jpe?g|png|webp|avif|gif|bmp|tiff?|mp4|webm|mov|m4v|glb|gltf|obj|fbx|hdr|exr|svg|ico|lottie|riv|mp3|wav)$/i;
export async function verifyPolicy(root: string): Promise<string[]> {
  const errors: string[] = [];
  async function walk(dir: string): Promise<string[]> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return [];
    }
    return (
      await Promise.all(
        entries.map(async (e) =>
          e.isDirectory()
            ? walk(path.join(dir, e.name))
            : [path.join(dir, e.name)],
        ),
      )
    ).flat();
  }
  for (const file of [
    ...(await walk(path.join(root, "public"))),
    ...(await walk(path.join(root, "src"))),
  ]) {
    const relative = path.relative(root, file).replaceAll("\\", "/");
    if (approvedAssets[relative] && createHash("sha256").update(await readFile(file)).digest("hex") !== approvedAssets[relative]) errors.push(`Approved asset hash mismatch: ${relative}`);
    if (banned.test(file) && !approvedAssets[relative])
      errors.push(`Unapproved runtime asset: ${relative}`);
  }
  for (const base of ["src"])
    for (const file of await walk(path.join(root, base))) {
      if (!/\.(?:tsx?|jsx?|css|mjs)$/.test(file)) continue;
      let source = await readFile(file, "utf8");
      // Only the dedicated logo component may use an image, and only its exact approved sources.
      if (path.relative(root, file).replaceAll("\\", "/") === "src/components/brand/Logo.tsx") {
        source = source.replace(/<img className=\{`brand-logo \$\{className\}`\} src=\{tone === "light" \? "\/brand\/zaithe-nav-white.svg" : "\/brand\/zaithe-nav-charcoal.svg"\} width="64" height="64" alt="" aria-hidden="true" \/>/, "");
      }
      source = source.replace(/url\(#[a-zA-Z][\w-]*\)/g, "");
      const prohibited = [
        /<\s*(?:img|picture|video|iframe|object|embed)\b/i,
        /\b(?:TextureLoader|GLTFLoader|RGBELoader)\b/,
        /\burl\s*\(/,
        /\bbackground-image\s*:/i,
        /from\s*['"]next\/image['"]/,
        /\bZENTRA\b/i,
      ];
      for (const rule of prohibited)
        if (rule.test(source))
          errors.push(
            `Forbidden runtime source ${rule.source}: ${path.relative(root, file)}`,
          );
    }
  return errors;
}
if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  const errors = await verifyPolicy(process.cwd());
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      "PASS: zero unapproved media assets, external decorative SVGs, image/video elements, URL assets, loaders or historical runtime branding.",
    );
    const exists = await stat("public").catch(() => null);
    console.log(
      `Approved asset count: ${Object.keys(approvedAssets).length}; public directory: ${exists ? "present" : "absent"}`,
    );
  }
}
