import {
  contactEmail,
  copy,
  localPath,
  products,
  type Locale,
} from "@/lib/site";
import { Label } from "./Shell";
import { Walkthrough } from "./Walkthrough";
import { Composition } from "./Visuals";
import { NexusDemo, SpaceDemo, TheraDemo } from "./ProductDemos";
import { StudioExperience } from "./StudioExperience";
import { Contact } from "./Contact";
import { Legal } from "./Legal";
export function InnerPage({
  locale,
  route,
}: {
  locale: Locale;
  route: string;
}) {
  const product = products.find((p) => route === `products/${p.slug}`);
  if (product)
    return (
      <>
        <section className="page-hero shell">
          <Label>{product.domain.toUpperCase()}</Label>
          <h1>{product.name}</h1>
          <p className="lead">{copy(locale, product.en, product.zh)}</p>
          <p className="intro-copy">
            {copy(locale, product.descriptionEn, product.descriptionZh)}
          </p>
        </section>
        <section
          className={`product-detail ${product.slug === "ayra" ? "pearl" : "graphite"}`}
        >
          <div className="shell">
            {product.slug === "ayra" ? (
              <Walkthrough locale={locale} />
            ) : product.slug === "za-nexus" ? (
              <NexusDemo locale={locale} />
            ) : product.slug === "za-space" ? (
              <SpaceDemo locale={locale} />
            ) : (
              <TheraDemo locale={locale} />
            )}
            <p className="caption">
              {copy(
                locale,
                "Illustrative workflow · Product availability and implemented capabilities are being verified.",
                "工作流示意 · 产品开放状态与已实现能力尚待核实。",
              )}
            </p>
          </div>
        </section>
        <section className="shell detail-notes">
          <Label>DESIGN DIRECTION</Label>
          <h2>
            {copy(locale, "A clear relationship", "让每一步，")}
            <br />
            {copy(locale, "between intent and outcome.", "都有来处。")}
          </h2>
          <div className="principle-list">
            {(product.slug === "ayra"
              ? ["Goal → Plan", "Tasks → Tools", "Artifact → Approval"]
              : product.slug === "za-nexus"
                ? [
                    "Source → Reference",
                    "Relation → Context",
                    "Question → Traceability",
                  ]
                : product.slug === "za-space"
                  ? [
                      "Intent → Structure",
                      "Variation → Composition",
                      "Review → Output",
                    ]
                  : [
                      "Business state → Context",
                      "Context → Decision",
                      "Human confirmation → Action",
                    ]
            ).map((s, i) => (
              <div key={s}>
                <span>0{i + 1}</span>
                <h3>{s}</h3>
              </div>
            ))}
          </div>
          <a className="text-link" href={localPath(locale, "contact")}>
            {copy(locale, "Ask about this direction", "了解这一方向")} ↗
          </a>
        </section>
      </>
    );
  if (route === "products")
    return (
      <section className="shell page-hero">
        <Label>BUILD / AI SOFTWARE & INTELLIGENT SYSTEMS</Label>
        <h1>
          {copy(locale, "Intelligence,", "智能，")}
          <br />
          {copy(locale, "in different forms.", "以不同形态抵达。")}
        </h1>
        <div className="product-index">
          {products.map((p, i) => (
            <a href={localPath(locale, `products/${p.slug}`)} key={p.slug}>
              <span>
                0{i + 1} / {p.word}
              </span>
              <h2>{p.name}</h2>
              <p>{copy(locale, p.en, p.zh)}</p>
              <span className="arrow">↗</span>
            </a>
          ))}
        </div>
      </section>
    );
  if (route === "studio")
    return (
      <>
        <section className="page-hero shell">
          <Label>CREATE / AI × IMAGE × MOTION</Label>
          <h1>
            ZAITHE
            <br />
            <em>Studio.</em>
          </h1>
          <p className="lead">
            {copy(
              locale,
              "Create what hasn’t existed.",
              "以智能，创造未曾存在的影像。",
            )}
          </p>
          <StudioExperience locale={locale}>
            <Composition />
          </StudioExperience>
        </section>
        <section className="paper">
          <div className="shell detail-notes">
            <Label>THE CREATIVE SYSTEM</Label>
            <h2>
              {copy(locale, "From a brief.", "从意图，")}
              <br />
              {copy(locale, "To a frame.", "到影像。")}
            </h2>
            <div className="principle-list">
              {[
                [
                  "01",
                  "Brief & Direction",
                  copy(
                    locale,
                    "People define the intention, references and creative judgment.",
                    "人定义意图、参考与创作判断。",
                  ),
                ],
                [
                  "02",
                  "AI & Exploration",
                  copy(
                    locale,
                    "AI becomes part of image, motion and composition exploration.",
                    "AI 参与图像、运动与构图的探索。",
                  ),
                ],
                [
                  "03",
                  "Production & Review",
                  copy(
                    locale,
                    "Human review shapes the final cut and delivery.",
                    "以人工审阅完成剪辑与交付。",
                  ),
                ],
              ].map(([n, title, description]) => (
                <div key={n}>
                  <span>{n}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
            <p className="service-line">
              Creative Direction / AI Image / AI Film / TVC / Fashion Film /
              Product Visual / Brand Film / Campaign / Post Production /
              Creative R&D
            </p>
            <a className="text-link" href={localPath(locale, "contact")}>
              {copy(locale, "Discuss a project", "探讨创作项目")} ↗
            </a>
          </div>
        </section>
      </>
    );
  if (route === "company")
    return (
      <>
        <section className="page-hero shell">
          <Label>ZAITHE / 智行通心</Label>
          <h1>
            {copy(locale, "Intelligence.", "智能，")}
            <br />
            {copy(locale, "With purpose.", "通向可能。")}
          </h1>
          <p className="lead">
            {copy(
              locale,
              "We build intelligence to expand what people can act on, create and discover.",
              "我们构建智能，以拓展人能够行动、创造与发现的边界。",
            )}
          </p>
        </section>
        <section className="paper">
          <div className="shell detail-notes">
            <Label>WHAT WE BUILD</Label>
            <div className="principle-list">
              {[
                ["BUILD", "AI Software & Intelligent Systems"],
                ["CREATE", "ZAITHE Studio"],
                ["DISCOVER", "ZAITHE Science / Life Sciences"],
              ].map(([a, b]) => (
                <div key={a}>
                  <span>{a}</span>
                  <h2>{b}</h2>
                </div>
              ))}
            </div>
            <Label>HOW WE WORK</Label>
            <h2>Proof before claims.</h2>
            <p className="intro-copy">
              {copy(
                locale,
                "Clarity before complexity. Human judgment throughout. We distinguish directions from demonstrated capabilities, and demonstrations from real outcomes.",
                "清晰先于复杂，人的判断贯穿始终。区分探索方向与已验证能力，区分示例演示与真实成果。",
              )}
            </p>
            <a className="text-link" href={localPath(locale, "contact")}>
              {copy(locale, "Contact ZAITHE", "联系智行通心")} ↗
            </a>
          </div>
        </section>
      </>
    );
  if (route === "contact")
    return (
      <section className="shell page-hero contact-page">
        <Label>CONTACT</Label>
        <h1>{copy(locale, "Let’s begin.", "从对话开始。")}</h1>
        <p>
          <a className="text-link" href={`mailto:${contactEmail}`}>
            {contactEmail} ↗
          </a>
        </p>
        <Contact locale={locale} />
      </section>
    );
  return <Legal locale={locale} privacy={route === "privacy"} />;
}
