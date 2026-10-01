"use client";
import { useState } from "react";
import { copy, type Locale } from "@/lib/site";
export function Walkthrough({ locale }: { locale: Locale }) {
  const [step, setStep] = useState(0);
  const steps = [
    copy(locale, "Understand the goal", "理解目标"),
    copy(locale, "Define the plan", "制定计划"),
    copy(locale, "Prepare the artifact", "准备交付物"),
    copy(locale, "Human approval", "人工确认"),
  ];
  const descriptions = [
    copy(
      locale,
      "Brief: prepare a website launch checklist. Identify the scope and the information still needed.",
      "任务：准备网站上线检查清单，明确范围与尚待确认的信息。",
    ),
    copy(
      locale,
      "Break the task into content, accessibility and release checks. Assign a clear output to each step.",
      "将任务拆分为内容、无障碍与发布检查，为每一步定义交付物。",
    ),
    copy(
      locale,
      "A sample checklist is ready to review: brand assets, page metadata, keyboard navigation and release approval.",
      "示例清单已准备：品牌资产、页面元数据、键盘导航与发布授权。",
    ),
    copy(
      locale,
      "Review before action. This demonstration never publishes, sends messages or calls an AI model.",
      "行动前由人确认。此演示不会发布网站、发送信息或调用 AI 模型。",
    ),
  ];
  return (
    <div className="walkthrough">
      <div className="ui-bar">
        <span>
          AYRA <span className="dim">/ WORKSPACE</span>
        </span>
        <span className="demo-badge">DEMO</span>
      </div>
      <div className="demo-body">
        <aside>
          <span className="eyebrow">TASK / 001</span>
          <p>
            {copy(
              locale,
              "Prepare a website launch checklist.",
              "准备一份网站上线检查清单。",
            )}
          </p>
          <ol>
            {steps.map((s, i) => (
              <li key={s} className={i === step ? "current" : ""}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
        </aside>
        <div className="demo-detail">
          <div className="detail-top">
            <span className="eyebrow">
              {String(step + 1).padStart(2, "0")} / 04
            </span>
            <span className="demo-symbol" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 32 32">
                <path
                  d={
                    [
                      "M5 5V23H26M18 15L26 23L18 31",
                      "M5 8H27M5 16H27M5 24H20",
                      "M7 3H25V29H7ZM11 10H21M11 16H21M11 22H18",
                      "M5 16L13 24L27 7",
                    ][step]
                  }
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </div>
          <h3>{steps[step]}</h3>
          <p aria-live="polite">{descriptions[step]}</p>
          <div className="artifact">
            <span>launch-checklist.md</span>
            <span>{copy(locale, "SAMPLE ARTIFACT", "示例交付物")}</span>
            <ul>
              <li>
                {copy(
                  locale,
                  "Confirm approved brand assets",
                  "确认已批准品牌资产",
                )}
              </li>
              <li>
                {copy(locale, "Review content and sources", "审阅内容与来源")}
              </li>
              <li>
                {copy(locale, "Verify keyboard navigation", "验证键盘导航")}
              </li>
            </ul>
          </div>
          <button
            className="text-button"
            onClick={() => setStep((step + 1) % 4)}
          >
            {step === 3
              ? copy(locale, "Restart walkthrough", "重新查看")
              : copy(locale, "Next step", "下一步")}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div className="demo-disclosure">
        {copy(
          locale,
          "Deterministic walkthrough · Illustrative interface, not live inference or a product capability claim.",
          "确定性示例演示 · 界面示意，不代表实时推理或已验证产品能力。",
        )}
      </div>
    </div>
  );
}
