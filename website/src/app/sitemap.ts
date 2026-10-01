import type { MetadataRoute } from "next";
import { routes, localPath } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    (["en", "zh-cn"] as const).map((locale) => ({
      url: `https://zaithe.com${localPath(locale, route)}`,
      alternates: {
        languages: {
          en: `https://zaithe.com${localPath("en", route)}`,
          "zh-CN": `https://zaithe.com${localPath("zh-cn", route)}`,
          "x-default": `https://zaithe.com${localPath("en", route)}`,
        },
      },
    })),
  );
}
