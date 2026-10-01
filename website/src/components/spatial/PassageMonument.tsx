"use client";
import { useEffect, useRef, useState } from "react";
import { copy, type Locale } from "@/lib/site";
import { chooseSpatialQuality } from "@/spatial/quality";
import type { SpatialRenderer } from "@/spatial/types";
export function PassageMonument({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const runtime = useRef<SpatialRenderer | null>(null),
    wantsPlay = useRef(false);
  const [enabled, setEnabled] = useState(false),
    [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<
    "static" | "loading" | "ready" | "fallback"
  >("static");
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!enabled || !canvas.current || !host.current) return;
    let cancelled = false,
      visible = false;
    let instance: SpatialRenderer | null = null;
    const element = host.current;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & { saveData?: boolean };
      }
    ).connection;
    const policyBlocked = () =>
      media.matches ||
      document.documentElement.dataset.motion === "off" ||
      !!connection?.saveData;
    const fallback = () => {
      wantsPlay.current = false;
      instance?.dispose();
      runtime.current = null;
      element.dataset.running = "false";
      element.dataset.mode = "static";
      if (!cancelled) {
        setStatus("fallback");
        setPlaying(false);
        setStep(0);
      }
    };
    // CPU/motion/data are checked before requesting a context or downloading the renderer.
    const quality = chooseSpatialQuality({
      width: innerWidth,
      dpr: devicePixelRatio,
      cores: navigator.hardwareConcurrency || 4,
      reducedMotion: policyBlocked(),
      saveData: !!connection?.saveData,
      canvas: true,
      webgl2: true,
    });
    if (quality === "safe" || quality === "low") {
      queueMicrotask(fallback);
      return () => {
        cancelled = true;
      };
    }
    const sync = () => {
      if (policyBlocked()) {
        fallback();
        return;
      }
      if (visible && !document.hidden && wantsPlay.current) instance?.resume();
      else instance?.pause();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    const resize = new ResizeObserver(() => {
      if (visible) {
        instance?.resize();
        instance?.render();
      }
    });
    resize.observe(element);
    const mutation = new MutationObserver(sync);
    mutation.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("za:spatial-playback", sync);
    media.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    import("@/spatial/runtime")
      .then(async ({ createSpatialRuntime }) => {
        if (cancelled || !canvas.current || policyBlocked()) return;
        instance = createSpatialRuntime(
          canvas.current,
          quality,
          (stats) => {
            if (cancelled) return;
            element.dataset.running = String(stats.running);
            element.dataset.frames = String(stats.frames);
            element.dataset.stats = JSON.stringify(stats);
            setStep(Math.min(4, Math.floor(stats.progress * 5)));
          },
          fallback,
          () => {
            wantsPlay.current = false;
            setPlaying(false);
          },
        );
        runtime.current = instance;
        await instance.init();
        if (cancelled) {
          instance.dispose();
          return;
        }
        element.dataset.mode = "webgl2";
        setStatus("ready");
        sync();
      })
      .catch(() => {
        if (!cancelled) fallback();
      });
    return () => {
      cancelled = true;
      observer.disconnect();
      resize.disconnect();
      mutation.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("za:spatial-playback", sync);
      media.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
      instance?.dispose();
      runtime.current = null;
    };
  }, [enabled]);
  const words =
    locale === "zh-cn"
      ? ["理解", "推理", "创造", "连接", "行动"]
      : ["Understand", "Reason", "Create", "Connect", "Act"];
  return (
    <div
      ref={host}
      className="monument"
      data-mode="static"
      data-running="false"
    >
      <div
        className={`monument-fallback ${status === "ready" ? "enhanced" : ""}`}
      >
        {children}
      </div>
      {enabled && (
        <canvas
          className={`monument-canvas ${status === "ready" ? "ready" : ""}`}
          ref={canvas}
          aria-hidden="true"
        />
      )}
      <div className="monument-controls">
        <button
          className="text-button"
          disabled={status === "fallback"}
          aria-pressed={playing}
          onClick={() => {
            const play = !playing;
            wantsPlay.current = play;
            setPlaying(play);
            if (!enabled) {
              setStatus("loading");
              setEnabled(true);
            } else window.dispatchEvent(new Event("za:spatial-playback"));
          }}
        >
          {status === "fallback"
            ? copy(locale, "Static view", "静态视图")
            : playing
              ? copy(locale, "Pause passage", "暂停空间")
              : enabled
                ? copy(locale, "Continue passage", "继续空间")
                : copy(locale, "Enter the passage", "进入空间")}{" "}
          <span aria-hidden="true">{playing ? "Ⅱ" : "↗"}</span>
        </button>
        <span className="monument-word" aria-hidden="true">
          {words[step]}
        </span>
      </div>
      <noscript>
        <span className="monument-nojs">
          {copy(locale, "Passage / still composition", "通 / 静态构图")}
        </span>
      </noscript>
    </div>
  );
}
