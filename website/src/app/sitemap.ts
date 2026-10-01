import { siteOrigin } from "@/lib/site-origin";
import type { MetadataRoute } from "next";
import { routes, localPath } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    (["en", "zh-cn"] as const).map((locale) => ({
      url: `${siteOrigin}${localPath(locale, route)}`,
      alternates: {
        languages: {
          en: `${siteOrigin}${localPath("en", route)}`,
          "zh-CN": `${siteOrigin}${localPath("zh-cn", route)}`,
          "x-default": `${siteOrigin}${localPath("en", route)}`,
        },
      },
    })),
  );
}
