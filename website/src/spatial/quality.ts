import {
  chooseQuality,
  type QualitySignals,
  type QualityTier,
} from "@/lib/quality";
export function chooseSpatialQuality(
  signals: QualitySignals & { webgl2: boolean },
): QualityTier {
  if (!signals.webgl2) return "safe";
  return chooseQuality(signals);
}
export const spatialBudgets = {
  ultra: { dpr: 1.75, fps: 30 },
  high: { dpr: 1.5, fps: 30 },
  medium: { dpr: 1, fps: 24 },
  low: { dpr: 1, fps: 0 },
  safe: { dpr: 1, fps: 0 },
} as const;
