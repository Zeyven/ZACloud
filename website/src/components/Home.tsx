import { Logo } from "./brand/Logo";
import { PassageMonument } from "./spatial/PassageMonument";
import { PassageStill } from "./spatial/PassageStill";
import { passage } from "@/lib/passage";
import type { CSSProperties } from "react";
import { StudioExperience } from "./StudioExperience";
import {
  copy,
  localPath,
  products,
  siteFeatures,
  type Locale,
} from "@/lib/site";
import { Label } from "./Shell";
import { Business, Composition, Knowledge, ScienceGraph } from "./Visuals";
import { Walkthrough } from "./Walkthrough";
export function Home({ locale }: { locale: Locale }) {
  return (
    <>
      <section className="hero shell" data-hero-state="TVC_ASSET_REQUIRED">
        <div className="hero-topline">
          <span>ARTIFICIAL INTELLIGENCE</span>
          <span>SOFTWARE / CREATION / DISCOVERY</span>
        </div>
        <div className="hero-title">
          <p className="hero-chinese" lang="zh-CN">
            智行通心
          </p>
          <h1>
            ZAITHE<span className="hero-dot">.</span>
          </h1>
          <div className="hero-baseline">
            <p>
              {copy(
                locale,
                "Intelligence for what’s possible.",
                "智能，通向可能。",
              )}
            </p>
            <span>智驭万象，行通于心。</span>
          </div>
        </div>
        <div className="hero-bottom">
          <span>
            {copy(
              locale,
              "An intelligence company.",
              "一家面向智能未来的人工智能公司。",
            )}
          </span>
          <a href="#identity">{copy(locale, "Explore", "向下探索")} ↓</a>
        </div>
      </section>
      <section id="identity" className="identity shell">
        <Label n="01">ZAITHE / 智行通心</Label>
        <Logo className="identity-mark" />
        <p>
          {copy(locale, "Built on intelligence.", "以智能为原点。")}
          <br />
          <span className="dim">
            {copy(locale, "Open to possibility.", "通向更多可能。")}
          </span>
        </p>
        <div className="identity-axis" aria-hidden="true">
          <span>UNDERSTAND</span>
          <i />
          <span>ACT</span>
        </div>
      </section>
      <section className="paper manifesto">
        <div className="shell">
          <Label n="02">INTELLIGENCE FOR WHAT’S POSSIBLE</Label>
          <div className="manifesto-layout">
            <h2 lang="zh-CN">
              智能，
              <br />
              通向可能<span className="punctuation">。</span>
            </h2>
            <div className="manifesto-aside">
              <span className="fine-rule" />
              <p>
                {copy(
                  locale,
                  "We build intelligent systems that connect understanding with action.",
                  "构建智能系统，让理解抵达行动。",
                )}
              </p>
              <span className="eyebrow">REASONING / CONTEXT / ACTION</span>
            </div>
          </div>
        </div>
      </section>
      <section className="passage" style={{ "--za-passage-angle": `${passage.angleDegrees}deg` } as CSSProperties}>
        <PassageMonument locale={locale}><PassageStill /></PassageMonument>
        <div className="shell passage-content">
          <Label n="03">CONNECTION BECOMES POSSIBILITY</Label>
          <div className="passage-character" lang="zh-CN" aria-hidden="true">
            通
          </div>
          <div className="passage-bottom">
            <h2>
              {copy(locale, "Beyond understanding.", "理解之外，")}
              <br />
              {copy(locale, "Towards action.", "走向行动。")}
            </h2>
            <p>
              {copy(
                locale,
                "Understanding. Reasoning. Creating. Connecting.",
                "理解 · 推理 · 创造 · 连接",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="pillars shell">
        <Label n="04">ONE INTELLIGENCE. THREE DIRECTIONS.</Label>
        {[
          [
            "BUILD",
            "构建。",
            "AI Software & Intelligent Systems",
            "products",
            "01",
          ],
          ["CREATE", "创造。", "ZAITHE Studio", "studio", "02"],
          [
            "DISCOVER",
            "发现。",
            "ZAITHE Science / Life Sciences",
            "#science",
            "03",
          ],
        ].map(([en, zh, desc, path, n]) => (
          <a
            className="pillar"
            key={en}
            href={path.startsWith("#") ? path : localPath(locale, path)}
          >
            <span className="pillar-no">{n}</span>
            <div>
              <span className="eyebrow">{en}</span>
              <h2 lang="zh-CN">{zh}</h2>
            </div>
            <p>{desc}</p>
            <span className="pillar-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </section>
      {siteFeatures.products && (
        <>
          <section className="software pearl">
            <div className="shell">
              <div className="section-intro">
                <div>
                  <Label n="05">BUILD / SOFTWARE PROOF</Label>
                  <h2>
                    {copy(locale, "From a goal.", "从目标，")}
                    <br />
                    {copy(locale, "To a result.", "到完成。")}
                  </h2>
                </div>
                <p>
                  {copy(
                    locale,
                    "A closer look at an action-oriented workflow. Every step is visible. Every decision has a place.",
                    "一个面向行动的工作流示意。让步骤可见，让确认有据。",
                  )}
                </p>
              </div>
              <Walkthrough locale={locale} />
            </div>
          </section>
          <section className="products shell">
            <div className="section-intro">
              <div>
                <Label n="06">THE PRODUCT SYSTEM</Label>
                <h2>
                  {copy(locale, "Different forms.", "智能，")}
                  <br />
                  {copy(locale, "Shared intelligence.", "以不同形态抵达。")}
                </h2>
              </div>
              <a className="text-link" href={localPath(locale, "products")}>
                {copy(locale, "Explore products", "探索产品")} ↗
              </a>
            </div>
            <div className="product-feature">
              <div className="product-copy">
                <span className="eyebrow">02 / KNOWLEDGE & CONTEXT</span>
                <h3>ZA Nexus</h3>
                <p>{copy(locale, products[1].en, products[1].zh)}</p>
                <a
                  className="text-link"
                  href={localPath(locale, "products/za-nexus")}
                >
                  {copy(locale, "Explore context", "探索上下文")} ↗
                </a>
              </div>
              <Knowledge locale={locale} />
            </div>
            <div className="product-feature reverse">
              <div className="product-copy">
                <span className="eyebrow">03 / MULTIMODAL CREATION</span>
                <h3>ZA Space</h3>
                <p>{copy(locale, products[2].en, products[2].zh)}</p>
                <a
                  className="text-link"
                  href={localPath(locale, "products/za-space")}
                >
                  {copy(locale, "Explore creation", "探索创作")} ↗
                </a>
              </div>
              <Composition variant="space" />
            </div>
            <div className="product-feature">
              <div className="product-copy">
                <span className="eyebrow">04 / APPLIED INTELLIGENCE</span>
                <h3>ZA Thera</h3>
                <p>{copy(locale, products[3].en, products[3].zh)}</p>
                <a
                  className="text-link"
                  href={localPath(locale, "products/za-thera")}
                >
                  {copy(locale, "Explore real workflows", "探索业务流程")} ↗
                </a>
              </div>
              <Business locale={locale} />
            </div>
          </section>
        </>
      )}
      {siteFeatures.studio && (
        <section className="studio-section">
          <div className="shell">
            <Label n="07">CREATE / ZAITHE STUDIO</Label>
            <div className="studio-title">
              <h2>
                Beyond
                <br />
                <em>the frame.</em>
              </h2>
              <p>AI × IMAGE × MOTION</p>
            </div>
            <StudioExperience locale={locale}>
              <Composition />
            </StudioExperience>
            <div className="studio-caption">
              <h3>
                {locale === "zh-cn" ? (
                  <>
                    以智能，
                    <br className="mobile-only" />
                    创造未曾存在的影像。
                  </>
                ) : (
                  "Imagine what hasn’t existed."
                )}
              </h3>
              <a className="text-link" href={localPath(locale, "studio")}>
                {copy(locale, "Enter the Studio", "进入 Studio")} ↗
              </a>
            </div>
          </div>
        </section>
      )}
      {siteFeatures.scienceDirection && (
        <section id="science" className="science paper">
          <div className="shell">
            <Label n="08">DISCOVER / ZAITHE SCIENCE</Label>
            <div className="science-layout">
              <div>
                <span className="eyebrow">
                  LIFE SCIENCES / RESEARCH DIRECTION
                </span>
                <h2>
                  {copy(locale, "Discovery begins", "探索生命，")}
                  <br />
                  {copy(locale, "with understanding.", "从理解开始。")}
                </h2>
                <p>
                  {copy(
                    locale,
                    "Exploring how AI can connect scientific knowledge, help ask questions and support research workflows.",
                    "探索 AI 如何帮助连接科学知识、提出问题并推进研究。",
                  )}
                </p>
                <p className="caption">
                  {copy(
                    locale,
                    "A long-term direction. The diagram illustrates knowledge relationships, not experimental results.",
                    "长期探索方向。图示表达知识关系，不代表实验结果。",
                  )}
                </p>
              </div>
              <ScienceGraph />
            </div>
          </div>
        </section>
      )}
      <section className="company-section paper">
        <div className="shell">
          <Label n="09">THE COMPANY</Label>
          <h2>
            {copy(locale, "We build intelligence", "我们构建智能，")}
            <br />
            {copy(locale, "to expand human possibility.", "以拓展人的可能。")}
          </h2>
          <div className="company-bottom">
            <p>
              {copy(
                locale,
                "Through software, creation and discovery.",
                "以软件，以创作，以发现。",
              )}
            </p>
            <a className="text-link" href={localPath(locale, "company")}>
              {copy(locale, "About ZAITHE", "关于智行通心")} ↗
            </a>
          </div>
        </div>
      </section>
      <section className="closing shell">
        <span className="eyebrow">INTELLIGENCE. POSSIBILITY.</span>
        <Logo className="closing-mark" />
        <h2>ZAITHE</h2>
        <p lang="zh-CN">智驭万象，行通于心。</p>
      </section>
    </>
  );
}
