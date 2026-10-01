/* eslint-disable @next/next/no-img-element -- approved, small SVG; no image transformation */
export function Logo({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  return <img className={`brand-logo ${className}`} src={tone === "light" ? "/brand/zaithe-nav-white.svg" : "/brand/zaithe-nav-charcoal.svg"} width="64" height="64" alt="" aria-hidden="true" />;
}
