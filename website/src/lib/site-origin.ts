const configured = process.env.SITE_ORIGIN || "https://zaithe.com";
const url = new URL(configured);
if (
  url.protocol !== "https:" ||
  url.username ||
  url.password ||
  url.pathname !== "/" ||
  url.search ||
  url.hash
)
  throw new Error("SITE_ORIGIN must be an HTTPS origin");
export const siteOrigin = url.origin;
