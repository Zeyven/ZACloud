import { inter, noto } from "@/lib/fonts";
import Link from "next/link";
export default function NotFound() {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${noto.variable}`}>
      <body>
        <main className="not-found shell">
          <span className="eyebrow">ZAITHE / 404</span>
          <h1>此处尚无路径。</h1>
          <p>No path here. Yet.</p>
          <Link className="text-link" href="/">
            Return →
          </Link>
        </main>
      </body>
    </html>
  );
}
