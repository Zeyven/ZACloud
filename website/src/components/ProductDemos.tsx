"use client";
import { useState } from "react";
import { copy, type Locale } from "@/lib/site";
const sources = [
  {
    id: "S01",
    titleEn: "Project brief",
    titleZh: "项目简报",
    quoteEn: "The release needs a keyboard review.",
    quoteZh: "发布前需要进行键盘操作检查。",
    relationEn: "Defines the requirement",
    relationZh: "定义需求",
  },
  {
    id: "S02",
    titleEn: "Review note",
    titleZh: "审阅记录",
    quoteEn: "The menu can be reached using the Tab key.",
    quoteZh: "使用 Tab 键可以到达菜单。",
    relationEn: "Provides a check to verify",
    relationZh: "提供待核验检查项",
  },
  {
    id: "S03",
    titleEn: "Decision log",
    titleZh: "决策记录",
    quoteEn: "Keep human approval before publication.",
    quoteZh: "发布之前保留人工确认。",
    relationEn: "Sets the decision boundary",
    relationZh: "设置决策边界",
  },
];
export function NexusDemo({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const source = sources[selected];
  return (
    <div className="nexus-demo interactive-demo">
      <div className="ui-bar">
        <span>ZA NEXUS / CONTEXT</span>
        <span>DEMO</span>
      </div>
      <div className="context-workspace">
        <div className="source-list">
          <span className="eyebrow">SOURCES / 03</span>
          {sources.map((s, i) => (
            <button
              key={s.id}
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
            >
              <span>{s.id}</span>
              {copy(locale, s.titleEn, s.titleZh)}
            </button>
          ))}
        </div>
        <div className="citation-panel" aria-live="polite">
          <span className="eyebrow">
            {source.id} / {copy(locale, "CITATION", "引用")}
          </span>
          <blockquote>
            “{copy(locale, source.quoteEn, source.quoteZh)}”
          </blockquote>
          <div className="citation-relation">
            <span>{source.id}</span>
            <svg viewBox="0 0 150 20" aria-hidden="true">
              <path
                d="M0 10H148M138 3L148 10L138 17"
                fill="none"
                stroke="currentColor"
              />
            </svg>
            <span>CONTEXT</span>
          </div>
          <p>{copy(locale, source.relationEn, source.relationZh)}</p>
          <p className="caption">
            {copy(
              locale,
              "Question: what remains before release?",
              "问题：发布前还有哪些步骤？",
            )}
          </p>
        </div>
      </div>
      <p className="demo-disclosure">
        {copy(
          locale,
          "Fictional source excerpts for this deterministic walkthrough. No retrieval or model inference occurs.",
          "此确定性演示使用虚构示例来源，不执行检索或模型推理。",
        )}
      </p>
    </div>
  );
}
export function SpaceDemo({ locale }: { locale: Locale }) {
  const [density, setDensity] = useState(7),
    [format, setFormat] = useState<"wide" | "portrait">("wide");
  const [approved, setApproved] = useState(false);
  return (
    <div className="space-demo interactive-demo">
      <div className="ui-bar">
        <span>ZA SPACE / COMPOSITION</span>
        <span>DEMO</span>
      </div>
      <div className="space-workspace">
        <div
          className={`space-preview ${format}`}
          role="img"
          aria-label={copy(
            locale,
            "Procedural geometric composition preview",
            "程序化几何构图预览",
          )}
        >
          <svg viewBox="0 0 600 420" aria-hidden="true">
            {Array.from({ length: density }, (_, i) => (
              <rect
                key={i}
                x={140 + i * 7}
                y={65 + i * 9}
                width={260 - i * 7}
                height={260 - i * 5}
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.25 + (i / density) * 0.65}
                transform={`rotate(${i * 7 - 21} 300 210)`}
              />
            ))}
          </svg>
        </div>
        <div className="space-settings">
          <span className="eyebrow">INTENT → STRUCTURE → VARIATION</span>
          <h3>{copy(locale, "Shape a quiet rhythm.", "构成安静的节奏。")}</h3>
          <label>
            {copy(locale, "Layers", "层次")}
            <input
              aria-label={copy(locale, "Composition layers", "构图层数")}
              type="range"
              min="3"
              max="13"
              value={density}
              onChange={(e) => {
                setDensity(Number(e.target.value));
                setApproved(false);
              }}
            />
            <output>{density}</output>
          </label>
          <div
            className="segmented"
            role="group"
            aria-label={copy(locale, "Output format", "画幅")}
          >
            <button
              aria-pressed={format === "wide"}
              onClick={() => {
                setFormat("wide");
                setApproved(false);
              }}
            >
              16:9
            </button>
            <button
              aria-pressed={format === "portrait"}
              onClick={() => {
                setFormat("portrait");
                setApproved(false);
              }}
            >
              4:5
            </button>
          </div>
          <button className="text-button" onClick={() => setApproved(true)}>
            {copy(locale, "Review composition", "确认构图")} →
          </button>
          <p role="status">
            {approved
              ? copy(
                  locale,
                  `Example specification: ${density} layers / ${format === "wide" ? "16:9" : "4:5"} / reviewed.`,
                  `示例规格：${density} 层 / ${format === "wide" ? "16:9" : "4:5"} / 已确认。`,
                )
              : copy(
                  locale,
                  "Adjust the structure, then review.",
                  "调整结构，再进行确认。",
                )}
          </p>
        </div>
      </div>
      <p className="demo-disclosure">
        {copy(
          locale,
          "Deterministic geometry study. No generated artwork, model inference or customer project.",
          "确定性几何研究，不是生成作品、模型推理或客户项目。",
        )}
      </p>
    </div>
  );
}
export function TheraDemo({ locale }: { locale: Locale }) {
  const [checked, setChecked] = useState(false),
    [done, setDone] = useState(false);
  return (
    <div className="thera-demo interactive-demo">
      <div className="ui-bar">
        <span>ZA THERA / OPERATIONS</span>
        <span>DEMO</span>
      </div>
      <div className="thera-workspace">
        <div className="room-ledger">
          {[
            ["01", "AVAILABLE"],
            ["02", "ACTIVE"],
            ["03", done ? "AVAILABLE" : "CLEANING"],
          ].map(([n, state]) => (
            <div key={n}>
              <span>
                ROOM <b>{n}</b>
              </span>
              <span>{state}</span>
            </div>
          ))}
        </div>
        <div className="room-action">
          <span className="eyebrow">ROOM 03 / HUMAN CONFIRMATION</span>
          <h3>{copy(locale, "State becomes action.", "状态，成为行动。")}</h3>
          <p>
            {copy(
              locale,
              "A room can become available after the cleaning check is confirmed.",
              "完成清洁检查并确认后，房间才能更新为可用。",
            )}
          </p>
          <label className="consent">
            <input
              type="checkbox"
              checked={checked}
              disabled={done}
              onChange={(e) => setChecked(e.target.checked)}
            />
            {copy(locale, "Cleaning check completed", "已完成清洁检查")}
          </label>
          <button
            className="text-button"
            disabled={!checked || done}
            onClick={() => setDone(true)}
          >
            {copy(locale, "Confirm room available", "确认房间可用")} →
          </button>
          <p role="status">
            {done
              ? copy(
                  locale,
                  "Example log: ROOM 03 · CLEANING → AVAILABLE · human approved.",
                  "示例记录：房间 03 · 清洁中 → 可用 · 人工确认。",
                )
              : copy(
                  locale,
                  "Waiting for a human check.",
                  "等待人工检查确认。",
                )}
          </p>
          <button
            className="reset-button"
            onClick={() => {
              setDone(false);
              setChecked(false);
            }}
          >
            {copy(locale, "Reset example", "重置示例")}
          </button>
        </div>
      </div>
      <p className="demo-disclosure">
        {copy(
          locale,
          "Local example data only. No live rooms, orders, payments or business systems are connected.",
          "仅使用本地示例数据，不连接真实房间、订单、支付或业务系统。",
        )}
      </p>
    </div>
  );
}
