"use client";
import { useEffect, useRef, useState } from "react";
import { copy, type Locale } from "@/lib/site";
import { chooseQuality } from "@/lib/quality";
import type { ComputationalRenderer } from "@/computational/studio-renderer";
export function StudioExperience({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    renderer = useRef<ComputationalRenderer | null>(null);
  const [enabled, setEnabled] = useState(false),
    [playing, setPlaying] = useState(false),
    [frame, setFrame] = useState(0),
    [stage, setStage] = useState(0),
    [status, setStatus] = useState("static"),
    [policyVersion, setPolicyVersion] = useState(0);
  const playingRef = useRef(false),
    frameRef = useRef(0);
  const stages = [
    copy(locale, "Brief", "意图"),
    copy(locale, "Direction", "方向"),
    copy(locale, "Production", "制作"),
    copy(locale, "Review", "审阅"),
  ];
  const notes = [
    copy(
      locale,
      "Example brief: translate a quiet rhythm into a sequence of light trajectories.",
      "示例意图：将安静的节奏转化为光线轨迹序列。",
    ),
    copy(
      locale,
      "Human direction sets framing, density and pace. Choose a frame to inspect its composition.",
      "由人设定取景、密度与节奏。选择一个帧，检查构图。",
    ),
    copy(
      locale,
      "The browser calculates each strand. This study contains no image, video or client work.",
      "浏览器逐条计算轨迹。此研究不包含图片、影片或客户作品。",
    ),
    copy(
      locale,
      "Review the composition before delivery. This local study does not generate a production deliverable.",
      "交付前由人审阅构图。此本地研究不生成正式制作交付物。",
    ),
  ];
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      setPlaying(false);
      setPolicyVersion((value) => value + 1);
    };
    const observer = new MutationObserver(changed);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    media.addEventListener("change", changed);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", changed);
    };
  }, []);
  useEffect(() => {
    if (!enabled || !canvas.current || !host.current) return;
    let cancelled = false,
      visible = true;
    let instance: ComputationalRenderer | null = null;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    let canvasAvailable = false;
    try {
      canvasAvailable = !!canvas.current.getContext("2d");
    } catch {
      /* Preserve the CSS fallback. */
    }
    const tier = chooseQuality({
      width: innerWidth,
      dpr: devicePixelRatio,
      cores: navigator.hardwareConcurrency || 4,
      reducedMotion:
        media.matches || document.documentElement.dataset.motion === "off",
      saveData: !!connection?.saveData,
      canvas: canvasAvailable,
    });
    const sync = () => {
      if (!instance) return;
      const allowed =
        visible &&
        !document.hidden &&
        !media.matches &&
        document.documentElement.dataset.motion !== "off" &&
        playingRef.current;
      if (allowed) instance.resume();
      else instance.pause();
    };
    if (tier === "safe") {
      queueMicrotask(() => {
        if (!cancelled) setStatus("safe");
      });
      return () => {
        cancelled = true;
      };
    }
    const element = host.current;
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(element);
    const resize = new ResizeObserver(() => {
      if (visible) instance?.resize();
    });
    resize.observe(element);
    const mutation = new MutationObserver(sync);
    mutation.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    window.addEventListener("za:playback", sync);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    import("@/computational/studio-renderer")
      .then(({ createStudioRenderer }) => {
        if (cancelled || !canvas.current) return;
        instance = createStudioRenderer(canvas.current, tier, (s) => {
          element.dataset.frames = String(s.frames);
          element.dataset.frameMs = s.frameMs.toFixed(3);
          element.dataset.quality = s.tier;
          element.dataset.running = String(s.running);
          if (s.tier === "safe") {
            setStatus("safe");
          }
        });
        renderer.current = instance;
        instance.resize();
        instance.setFrame(frameRef.current);
        setStatus("ready");
        sync();
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });
    return () => {
      cancelled = true;
      observer.disconnect();
      resize.disconnect();
      mutation.disconnect();
      window.removeEventListener("za:playback", sync);
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      instance?.dispose();
      renderer.current = null;
    };
  }, [enabled, policyVersion]);
  useEffect(() => {
    playingRef.current = playing;
    window.dispatchEvent(new Event("za:playback"));
  }, [playing]);
  const canPlay = status !== "safe" && status !== "failed";
  return (
    <div className="studio-experience" ref={host} data-running="false">
      <div className="studio-stage">
        <div
          className={
            status === "ready"
              ? "composition-fallback enhanced"
              : "composition-fallback"
          }
        >
          {children}
        </div>
        {enabled && (
          <canvas
            className={status === "ready" ? "flow-canvas ready" : "flow-canvas"}
            ref={canvas}
            aria-hidden="true"
          />
        )}
        <span className="live-label">
          {copy(locale, "COMPUTATIONAL STUDY / DEMO", "计算构图研究 / DEMO")}
        </span>
      </div>
      <div className="studio-controls">
        <button
          className="text-button"
          disabled={!canPlay}
          aria-pressed={playing && canPlay}
          onClick={() => {
            setEnabled(true);
            setPlaying(!playing);
          }}
        >
          {!canPlay
            ? copy(locale, "Static view", "静态视图")
            : playing
              ? copy(locale, "Pause motion", "暂停运动")
              : copy(locale, "Explore motion", "探索运动")}{" "}
          <span aria-hidden="true">{playing ? "Ⅱ" : "→"}</span>
        </button>
        <label>
          {copy(locale, "Frame", "帧")}{" "}
          <input
            aria-label={copy(locale, "Composition frame", "构图帧")}
            disabled={!canPlay}
            type="range"
            min="0"
            max="240"
            value={frame}
            onChange={(e) => {
              const value = Number(e.target.value);
              setFrame(value);
              frameRef.current = value;
              setEnabled(true);
              setPlaying(false);
              renderer.current?.setFrame(value);
            }}
          />
          <output>{String(frame).padStart(3, "0")}</output>
        </label>
      </div>
      <p className="caption" role="status">
        {status === "safe"
          ? copy(
              locale,
              "Static composition follows your motion or data preference.",
              "根据你的运动或数据偏好，保留静态构图。",
            )
          : status === "failed"
            ? copy(
                locale,
                "Static composition is available on this device.",
                "此设备使用静态构图。",
              )
            : copy(
                locale,
                "Code-generated trajectories. Play is optional; motion pauses outside the viewport.",
                "代码生成的轨迹。运动由你开启，离开可视区域即暂停。",
              )}
      </p>
      <div
        className="production-stages"
        role="group"
        aria-label={copy(locale, "Production stages", "制作阶段")}
      >
        {stages.map((s, i) => (
          <button
            key={s}
            aria-pressed={stage === i}
            onClick={() => setStage(i)}
          >
            <span>0{i + 1}</span>
            {s}
          </button>
        ))}
      </div>
      <p className="production-note" aria-live="polite">
        {notes[stage]}
      </p>
      <noscript>
        {copy(
          locale,
          "Static composition and production stages remain available. Motion requires JavaScript.",
          "静态构图与制作阶段仍可查看。运动控制需要 JavaScript。",
        )}
      </noscript>
    </div>
  );
}
