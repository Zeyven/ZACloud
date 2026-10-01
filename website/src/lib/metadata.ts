import type { Metadata } from "next";
import { copy, localPath, products, type Locale } from "./site";
export function pageMetadata(locale: Locale, route: string): Metadata {
  const product = products.find((p) => route === `products/${p.slug}`);
  const title =
    product?.name ||
    (
      {
        products: copy(locale, "Products", "产品"),
        studio: "ZAITHE Studio",
        company: copy(locale, "Company", "公司"),
        contact: copy(locale, "Contact", "联系"),
        privacy: copy(locale, "Privacy", "隐私"),
        terms: copy(locale, "Terms", "条款"),
      } as Record<string, string>
    )[route] ||
    copy(locale, "Intelligence for what’s possible.", "智能，通向可能。");
  const description = copy(
    locale,
    "ZAITHE builds intelligent systems at the intersection of software, creation and scientific exploration.",
    "智行通心：构建智能软件，探索影像创作与科学知识中的可能。",
  );
  return {
    title: `${title} — ZAITHE / 智行通心`,
    description,
    alternates: {
      canonical: localPath(locale, route),
      languages: {
        en: localPath("en", route),
        "zh-CN": localPath("zh-cn", route),
        "x-default": localPath("en", route),
      },
    },
    openGraph: {
      title: `${title} — ZAITHE`,
      description,
      url: localPath(locale, route),
      siteName: "ZAITHE / 智行通心",
      locale: locale === "en" ? "en_US" : "zh_CN",
      type: "website",
    },
  };
}
