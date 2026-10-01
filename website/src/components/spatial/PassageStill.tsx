import { passage } from "@/lib/passage";
export function PassageStill() {
  return (
    <svg
      className="passage-still"
      viewBox="0 0 1200 850"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="monument-face" x1="0" y1="0" x2="0.7" y2="1">
          <stop stopColor="#202123" />
          <stop offset=".7" stopColor="#090a0b" />
          <stop offset="1" stopColor="#111214" />
        </linearGradient>
        <linearGradient id="monument-edge" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#766e5e" />
          <stop offset="1" stopColor="#171818" />
        </linearGradient>
        <linearGradient id="monument-light">
          <stop stopColor="#9b9280" stopOpacity="0" />
          <stop offset=".48" stopColor="#e9e2d6" />
          <stop offset="1" stopColor="#9b9280" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="850" fill="#050506" />
      <g transform={`translate(600 400) rotate(${passage.angleDegrees})`}>
        <rect
          x="-1100"
          y="-12"
          width="2200"
          height="24"
          fill="url(#monument-light)"
        />
        <path d="M-1100-800H1100V-20H-1100Z" fill="url(#monument-face)" />
        <path d="M-1100-20H1100L1080-4H-1120Z" fill="url(#monument-edge)" />
        <path d="M-1100 28H1100V900H-1100Z" fill="url(#monument-face)" />
        <path d="M-1100 28L-1080 11H1120L1100 28Z" fill="url(#monument-edge)" />
      </g>
    </svg>
  );
}
