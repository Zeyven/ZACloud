import { siteOrigin } from "@/lib/site-origin";
import { inter, noto } from "@/lib/fonts";
import { notFound } from "next/navigation";
import { routes, parsePath, legalOperator, contactEmail } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { Header, Footer } from "@/components/Shell";
import { Home } from "@/components/Home";
import { InnerPage } from "@/components/Pages";
type Props = { params: Promise<{ path?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return routes.flatMap((route) => [
    { path: route ? route.split("/") : [] },
    { path: ["zh-cn", ...(route ? route.split("/") : [])] },
  ]);
}
export async function generateMetadata({ params }: Props) {
  const { locale, route } = parsePath((await params).path);
  return pageMetadata(locale, route);
}
export default async function Page({ params }: Props) {
  const { locale, route } = parsePath((await params).path);
  if (!routes.includes(route)) notFound();
  return (
    <html
      lang={locale === "en" ? "en" : "zh-CN"}
      className={`${inter.variable} ${noto.variable}`}
    >
      <body id="top">
        <Header locale={locale} route={route} />
        <main id="main">
          {route ? (
            <InnerPage locale={locale} route={route} />
          ) : (
            <Home locale={locale} />
          )}
        </main>
        <Footer locale={locale} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ZAITHE",
              legalName: legalOperator,
              email: contactEmail,
              alternateName: "智行通心",
              url: siteOrigin,
              logo: `${siteOrigin}/brand/zaithe-app-obsidian.svg`,
            }),
          }}
        />
      </body>
    </html>
  );
}
