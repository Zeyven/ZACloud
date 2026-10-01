import { lowerQuality, qualityBudgets, type QualityTier } from "@/lib/quality";
export interface ComputationalRenderer {
  resize(): void;
  setFrame(frame: number): void;
  pause(): void;
  resume(): void;
  dispose(): void;
}
export type RenderStats = {
  frames: number;
  frameMs: number;
  tier: QualityTier;
  running: boolean;
};
export function createStudioRenderer(
  canvas: HTMLCanvasElement,
  initialTier: QualityTier,
  onStats: (stats: RenderStats) => void,
): ComputationalRenderer {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("CANVAS_UNAVAILABLE");
  let tier = initialTier,
    width = 0,
    height = 0,
    frame = 0,
    frames = 0,
    raf = 0,
    previous = 0,
    active = false,
    disposed = false,
    slow = 0;
  const report = (ms = 0) =>
    onStats({ frames, frameMs: ms, tier, running: active });
  function draw() {
    if (disposed || !width || !height) return;
    const start = performance.now();
    const budget = qualityBudgets[tier];
    ctx!.fillStyle = "#0b0c0d";
    ctx!.fillRect(0, 0, width, height);
    // Each strand is a motion trajectory within a composed film frame, not a particle or client work.
    const phase = frame * 0.008;
    const lines = budget.lines;
    for (let i = 0; i < lines; i++) {
      const band = i / Math.max(lines - 1, 1);
      ctx!.beginPath();
      for (let j = 0; j <= 80; j++) {
        const t = j / 80;
        const x = width * (0.1 + t * 0.8);
        const envelope = Math.sin(t * Math.PI);
        const y =
          height *
          (0.5 +
            (band - 0.5) * 0.54 +
            Math.sin(t * 6.5 + phase + band * 2.2) * envelope * 0.19);
        if (j === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = `rgba(221,210,183,${0.2 + Math.sin(band * Math.PI) * 0.5})`;
      ctx!.lineWidth = 0.7;
      ctx!.stroke();
    }
    frames++;
    const ms = performance.now() - start;
    if (ms > 12) slow++;
    else slow = Math.max(0, slow - 1);
    if (slow >= 8) {
      tier = lowerQuality(tier);
      slow = 0;
      if (tier === "safe") {
        active = false;
        report(ms);
        return;
      }
      resize();
    }
    report(ms);
  }
  function tick(now: number) {
    if (!active || disposed) return;
    const gap = 1000 / qualityBudgets[tier].fps;
    if (now - previous >= gap) {
      previous = now;
      frame++;
      draw();
    }
    if (active) raf = requestAnimationFrame(tick);
  }
  function resize() {
    if (disposed) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, qualityBudgets[tier].dpr);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  return {
    resize,
    setFrame(value) {
      frame = value;
      draw();
    },
    pause() {
      active = false;
      cancelAnimationFrame(raf);
      report();
    },
    resume() {
      if (active || disposed || tier === "safe") return;
      active = true;
      previous = 0;
      raf = requestAnimationFrame(tick);
      report();
    },
    dispose() {
      disposed = true;
      active = false;
      cancelAnimationFrame(raf);
      canvas.width = 1;
      canvas.height = 1;
      report();
    },
  };
}
