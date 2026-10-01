import { copy, type Locale } from "@/lib/site";
export function Knowledge({ locale }: { locale: Locale }) {
  return (
    <div
      className="knowledge visual"
      role="img"
      aria-label={copy(
        locale,
        "Illustrative relationships between sources, context and a question.",
        "来源、上下文与问题之间的示意关系。",
      )}
    >
      <svg viewBox="0 0 600 400" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M85 90L300 195L510 80M85 305L300 195L495 310M300 195L300 50M300 195L330 355" />
          <circle cx="300" cy="195" r="68" />
          <circle cx="300" cy="195" r="115" strokeDasharray="2 8" />
          {[
            [85, 90],
            [510, 80],
            [85, 305],
            [495, 310],
            [300, 50],
            [330, 355],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="6" />
          ))}
        </g>
      </svg>
      <span className="node node-center">CONTEXT</span>
      <span className="node node-one">SOURCE 01</span>
      <span className="node node-two">SOURCE 02</span>
      <span className="node node-three">RELATION</span>
      <span className="node node-four">QUESTION</span>
    </div>
  );
}
export function Composition({
  variant = "studio",
}: {
  variant?: "studio" | "space";
}) {
  return (
    <div className={`composition visual ${variant}`} aria-hidden="true">
      <div className="frame-mark tl" />
      <div className="frame-mark tr" />
      <div className="frame-mark bl" />
      <div className="frame-mark br" />
      <div className="sculpture">
        {Array.from({ length: 13 }, (_, i) => (
          <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <span className="frame-note">
        {variant === "studio"
          ? "COMPOSITION STUDY / 001"
          : "INTENT → STRUCTURE → FORM"}
      </span>
      <span className="frame-ratio">16:9</span>
    </div>
  );
}
export function Business({ locale }: { locale: Locale }) {
  return (
    <div className="business visual">
      <div className="ui-bar">
        <span>ZA THERA</span>
        <span>{copy(locale, "ILLUSTRATIVE STATE", "示例状态")}</span>
      </div>
      <div className="business-rows">
        {[
          ["01", "AVAILABLE", "available"],
          ["02", "ACTIVE", "active"],
          ["03", "CLEANING", "cleaning"],
        ].map(([id, state, cls]) => (
          <div key={id}>
            <span>
              ROOM <b>{id}</b>
            </span>
            <span className={`state ${cls}`}>{state}</span>
          </div>
        ))}
      </div>
      <div className="business-action">
        <span>CONTEXT → ACTION</span>
        <p>
          {copy(
            locale,
            "Room 03 · Confirm cleaning before making available.",
            "房间 03 · 确认清洁后，再更新为可用。",
          )}
        </p>
      </div>
    </div>
  );
}
export function ScienceGraph() {
  return (
    <div className="science-graph" aria-hidden="true">
      <svg viewBox="0 0 700 480">
        <g stroke="currentColor" fill="none">
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M60 ${70 + i * 39} C220 ${20 + i * 48}, 390 ${430 - i * 42}, 640 ${65 + i * 40}`}
              opacity={0.15 + i * 0.06}
            />
          ))}
          {[
            [60, 70],
            [60, 226],
            [60, 382],
            [350, 218],
            [640, 65],
            [640, 225],
            [640, 385],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill="currentColor" />
              <circle cx={x} cy={y} r="14" opacity=".3" />
            </g>
          ))}
        </g>
      </svg>
      <div className="graph-note">LITERATURE → RELATIONS → QUESTIONS</div>
    </div>
  );
}
