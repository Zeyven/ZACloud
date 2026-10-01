"use client";
import { useState } from "react";
import { copy, type Locale } from "@/lib/site";
export function MotionControl({ locale }: { locale: Locale }) {
  const [off, setOff] = useState(false);
  return (
    <button
      className="motion-switch"
      aria-pressed={off}
      onClick={() => {
        document.documentElement.dataset.motion = off ? "on" : "off";
        setOff(!off);
      }}
    >
      {copy(
        locale,
        off ? "Motion reduced" : "Reduce motion",
        off ? "已减少运动" : "减少运动",
      )}
    </button>
  );
}
