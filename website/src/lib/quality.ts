export type QualityTier = "ultra" | "high" | "medium" | "low" | "safe";
export type QualitySignals = {
  width: number;
  dpr: number;
  cores: number;
  reducedMotion: boolean;
  saveData: boolean;
  canvas: boolean;
};
export function chooseQuality(s: QualitySignals): QualityTier {
  if (s.reducedMotion || s.saveData || !s.canvas) return "safe";
  if (s.cores <= 2) return "low";
  if (s.cores <= 4 || s.width < 768 || s.dpr > 2) return "medium";
  return s.width >= 1728 && s.cores >= 8 ? "ultra" : "high";
}
export const qualityBudgets = {
  ultra: { dpr: 1.75, lines: 40, fps: 24 },
  high: { dpr: 1.5, lines: 32, fps: 24 },
  medium: { dpr: 1, lines: 20, fps: 20 },
  low: { dpr: 1, lines: 12, fps: 12 },
  safe: { dpr: 1, lines: 0, fps: 0 },
} as const;
export function lowerQuality(tier: QualityTier): QualityTier {
  const tiers: QualityTier[] = ["ultra", "high", "medium", "low", "safe"];
  return tiers[Math.min(tiers.indexOf(tier) + 1, 4)];
}
