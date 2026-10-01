import type { QualityTier } from "@/lib/quality";
export interface SpatialRenderer {
  init(): Promise<void>;
  resize(): void;
  render(): void;
  pause(): void;
  resume(): void;
  dispose(): void;
}
export type SpatialStats = {
  tier: QualityTier;
  running: boolean;
  frames: number;
  frameMs: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  dpr: number;
  progress: number;
};
