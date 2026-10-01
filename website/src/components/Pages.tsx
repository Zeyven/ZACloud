import {
  contactEmail,
  legalOperator,
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
  const privacy = route === "privacy";
  return (
    <section className="reading page-hero">
      <Label>{privacy ? "PRIVACY" : "TERMS"}</Label>
      <h1>
        {copy(
          locale,
          privacy ? "Privacy." : "Terms.",
          privacy ? "隐私。" : "条款。",
        )}
      </h1>
      <p className="lead">
        {copy(locale, "Local preview notice", "本地预览说明")}
      </p>
      <p>
        {copy(
          locale,
          "This is a development preview of the ZAITHE website. Production policies have not yet been finalized. This notice is limited to the behavior of this build.",
          "这是 ZAITHE 网站的开发预览。正式政策尚待完善。本说明仅描述当前构建的实际行为。",
        )}
      </p>
      <p>
        {copy(locale, "Website operator: ", "网站运营主体：")}
        {legalOperator}
        <br />
        {copy(locale, "Contact: ", "联系邮箱：")}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </p>
      {privacy ? (
        <>
          <h2>{copy(locale, "Data in this preview", "此预览中的数据")}</h2>
          <p>
            {copy(
              locale,
              "No analytics, advertising scripts, tracking cookies or third-party forms are installed. Contact fields stay in the current page and are not submitted or persisted. The local server may record technical request information in its process logs.",
              "未安装分析、广告脚本、跟踪 Cookie 或第三方表单。联系字段仅停留在当前页面，不提交、不持久化。本地服务器可能在进程日志中记录技术请求信息。",
            )}
          </p>
          <h2>{copy(locale, "Before public launch", "公开上线前")}</h2>
          <p>
            {copy(
              locale,
              "The operator, contact channel, hosting logs, retention periods and any future processors must be documented before collecting personal information.",
              "采集个人信息前，须明确运营主体、联系渠道、托管日志、保存期限及未来的数据处理方。",
            )}
          </p>
        </>
      ) : (
        <>
          <h2>
            {copy(locale, "Demonstrations and availability", "演示与开放状态")}
          </h2>
          <p>
            {copy(
              locale,
              "Interfaces and workflows marked DEMO are illustrative. They do not run live inference, establish product availability or promise specific outcomes. Scientific diagrams are not research results.",
              "标记 DEMO 的界面与工作流为示意，不执行实时推理，不代表产品已开放，也不承诺特定结果。科学图示不是研究成果。",
            )}
          </p>
          <h2>{copy(locale, "Publication pending", "发布条件待确认")}</h2>
          <p>
            {copy(
              locale,
              "Formal service terms and intellectual property notices must be finalized before public release.",
              "正式服务条款与知识产权声明须在公开发布前完善。",
            )}
          </p>
        </>
      )}
    </section>
  );
}
