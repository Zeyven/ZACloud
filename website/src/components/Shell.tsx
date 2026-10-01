import { Logo } from "./brand/Logo";
import { MotionControl } from "./motion/MotionControl";
import { copy, localPath, siteFeatures, type Locale } from "@/lib/site";
export function Header({ locale, route }: { locale: Locale; route: string }) {
  const links = [
    ...(siteFeatures.products
      ? [["products", copy(locale, "Products", "产品")]]
      : []),
    ...(siteFeatures.studio ? [["studio", "Studio"]] : []),
    ["company", copy(locale, "Company", "公司")],
    ["contact", copy(locale, "Contact", "联系")],
  ];
  return (
    <>
      <a className="skip" href="#main">
        {copy(locale, "Skip to content", "跳到正文")}
      </a>
      <header className="header shell">
        <a
          className="wordmark"
          href={localPath(locale)}
          aria-label="ZAITHE · 智行通心"
        >
          <Logo />ZAITHE<span>智行通心</span>
        </a>
        <nav
          className="desktop-nav"
          aria-label={copy(locale, "Main navigation", "主导航")}
        >
          {links.map(([path, label]) => (
            <a
              key={path}
              aria-current={route === path ? "page" : undefined}
              href={localPath(locale, path)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-end">
          <a
            className="language"
            lang={locale === "en" ? "zh-CN" : "en"}
            href={localPath(locale === "en" ? "zh-cn" : "en", route)}
          >
            {locale === "en" ? "中" : "EN"}
            <span aria-hidden="true"> ↗</span>
          </a>
          <details className="mobile-menu">
            <summary>{copy(locale, "Menu", "菜单")}</summary>
            <nav aria-label={copy(locale, "Mobile navigation", "移动导航")}>
              {links.map(([path, label]) => (
                <a key={path} href={localPath(locale, path)}>
                  {label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="footer shell">
      <div className="footer-top">
        <a className="wordmark" href={localPath(locale)}>
          <Logo />ZAITHE
        </a>
        <p>
          {copy(
            locale,
            "Intelligence for what’s possible.",
            "智驭万象，行通于心。",
          )}
        </p>
        <a href={localPath(locale, "contact")}>
          {copy(locale, "Start a conversation", "开启对话")} ↗
        </a>
      </div>
      <MotionControl locale={locale} />
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ZAITHE / 智行通心</span>
        <div>
          <a href={localPath(locale, "privacy")}>
            {copy(locale, "Privacy", "隐私")}
          </a>
          <a href={localPath(locale, "terms")}>
            {copy(locale, "Terms", "条款")}
          </a>
          <a href="#top">{copy(locale, "Back to top", "返回顶部")} ↑</a>
        </div>
      </div>
    </footer>
  );
}
export function Label({
  children,
  n,
}: {
  children: React.ReactNode;
  n?: string;
}) {
  return (
    <div className="eyebrow">
      {n && <span className="index">{n}</span>}
      {children}
    </div>
  );
}
