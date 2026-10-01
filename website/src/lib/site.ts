import { passage } from "./passage";
export const legalOperator = "智行通心（湖北）科技有限公司";
export const contactEmail = "zaithe@zaithe.com";
export type Locale = "en" | "zh-cn";
export const siteFeatures = {
  products: true,
  studio: true,
  scienceDirection: true,
  research: false,
  models: false,
  developers: false,
  enterprise: false,
  careers: false,
  newsroom: false,
  studioWork: false,
} as const;
export const brandAssets = {
  logo: "/brand/zaithe-nav-white.svg",
  heroPoster: null,
  heroFilm: null,
  heroState: "TVC_ASSET_REQUIRED",
  passageAngle: passage.angleDegrees,
} as const;
export type ProductStatus =
  "concept" | "prototype" | "alpha" | "beta" | "available";
export type VerifiedStatus =
  | { verification: "pending"; status: null }
  | { verification: "verified"; status: ProductStatus; evidence: string };
export const productStatus: VerifiedStatus = {
  verification: "pending",
  status: null,
};
export const products = [
  {
    slug: "ayra",
    name: "AYRA",
    domain: "Agents & Action",
    word: "ACTION",
    zh: "从目标，到行动。",
    en: "From intent to action.",
    descriptionZh: "围绕目标、计划与人工确认，探索智能软件的行动方式。",
    descriptionEn:
      "Exploring how intelligent software connects goals, plans and human approval.",
  },
  {
    slug: "za-nexus",
    name: "ZA Nexus",
    domain: "Knowledge & Context",
    word: "CONTEXT",
    zh: "让知识，彼此连接。",
    en: "Knowledge, connected.",
    descriptionZh: "让知识成为持续可用、可连接、可追溯的上下文。",
    descriptionEn: "Knowledge as usable, connected and traceable context.",
  },
  {
    slug: "za-space",
    name: "ZA Space",
    domain: "Multimodal Creation",
    word: "CREATION",
    zh: "让想法，拥有形态。",
    en: "Give ideas a form.",
    descriptionZh: "探索文字、图像与影像之间的创作工作流。",
    descriptionEn:
      "Exploring creative workflows across text, image and motion.",
  },
  {
    slug: "za-thera",
    name: "ZA Thera",
    domain: "Applied Intelligence",
    word: "REALITY",
    zh: "智能，进入日常。",
    en: "Intelligence meets reality.",
    descriptionZh: "聚焦 KTV、足浴与 SPA 等服务业中的业务状态、上下文与行动。",
    descriptionEn:
      "Business state, context and action for service businesses, including KTV, foot care and spas.",
  },
].map((p) => ({ ...p, status: productStatus }));
export const routes = [
  "",
  ...(siteFeatures.products
    ? ["products", ...products.map((p) => `products/${p.slug}`)]
    : []),
  ...(siteFeatures.studio ? ["studio"] : []),
  "company",
  "contact",
  "privacy",
  "terms",
];
export function localPath(locale: Locale, path = "") {
  return (
    `${locale === "zh-cn" ? "/zh-cn" : ""}/${path}`.replace(/\/$/, "") || "/"
  );
}
export function parsePath(path: string[] = []) {
  const locale: Locale = path[0] === "zh-cn" ? "zh-cn" : "en";
  return {
    locale,
    route: (locale === "zh-cn" ? path.slice(1) : path).join("/"),
  };
}
export function copy(locale: Locale, en: string, zh: string) {
  return locale === "zh-cn" ? zh : en;
}
