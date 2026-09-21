import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Original line illustrations for the five services on the "how we help"
 * page. Drawn in-house as inline SVG (no stock photo, no licence to track,
 * no fabricated person), in the site's own paper / pine / gold palette and
 * echoing the topographic-ring language of EditorialPhoto and WorldMap.
 * Decorative: the surrounding heading already names the service.
 */

const INK = "var(--color-ink)";
const PINE = "var(--color-accent)";
const GOLD = "var(--color-gold)";
const PAPER = "var(--color-paper)";
const LINE = "var(--color-line)";

function Backdrop({ id, cx, cy }: { id: string; cx: number; cy: number }) {
  return (
    <>
      <defs>
        <pattern id={`${id}-dots`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={LINE} opacity="0.55" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-dots)`} />
      {[46, 78, 110, 142, 174].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth="1" opacity={0.28 - r / 1000} />
      ))}
    </>
  );
}

/** Three routes fan out from one start point; one is chosen. */
function Guidance() {
  const cards = [
    { x: 268, y: 34, chosen: false },
    { x: 296, y: 124, chosen: true },
    { x: 262, y: 214, chosen: false },
  ];
  return (
    <>
      <path d="M62 186 C 140 186 170 62 262 62" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" opacity="0.5" />
      <path d="M62 186 C 150 186 200 152 292 152" fill="none" stroke={PINE} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M62 186 C 140 186 170 240 258 242" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" opacity="0.5" />
      <circle cx="62" cy="186" r="9" fill={INK} />
      <circle cx="62" cy="186" r="17" fill="none" stroke={INK} strokeWidth="1" opacity="0.35" />
      {cards.map((c) => (
        <g key={c.y} transform={`translate(${c.x} ${c.y})`}>
          <rect width="84" height="56" rx="3" fill={PAPER} stroke={c.chosen ? PINE : INK} strokeWidth={c.chosen ? 2 : 1.2} opacity={c.chosen ? 1 : 0.85} />
          <rect x="10" y="12" width="40" height="5" rx="2.5" fill={c.chosen ? PINE : INK} opacity={c.chosen ? 1 : 0.55} />
          <rect x="10" y="24" width="60" height="4" rx="2" fill={INK} opacity="0.2" />
          <rect x="10" y="34" width="48" height="4" rx="2" fill={INK} opacity="0.2" />
          {c.chosen ? <circle cx="72" cy="12" r="6" fill={GOLD} /> : null}
        </g>
      ))}
      <path d="M298 152 l7 -5 v10 z" fill={PINE} />
    </>
  );
}

/** A document checklist above an application timeline. */
function Application() {
  return (
    <>
      <g transform="rotate(-7 170 130)">
        <rect x="112" y="40" width="150" height="176" rx="4" fill={PAPER} stroke={INK} strokeWidth="1.2" opacity="0.55" />
      </g>
      <rect x="128" y="34" width="150" height="176" rx="4" fill={PAPER} stroke={INK} strokeWidth="1.6" />
      <rect x="146" y="54" width="70" height="7" rx="3.5" fill={INK} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(146 ${88 + i * 30})`}>
          <circle r="8.5" cx="8.5" cy="0" fill={i < 3 ? PINE : "none"} stroke={i < 3 ? PINE : INK} strokeWidth="1.4" opacity={i < 3 ? 1 : 0.5} />
          {i < 3 ? <path d="M4.5 0.5 l3 3 l5.5 -6" fill="none" stroke={PAPER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> : null}
          <rect x="26" y="-3" width={[84, 70, 92, 60][i]} height="6" rx="3" fill={INK} opacity="0.22" />
        </g>
      ))}
      <line x1="60" y1="250" x2="340" y2="250" stroke={INK} strokeWidth="1.4" opacity="0.45" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={78 + i * 82} cy="250" r={i === 2 ? 9 : 6} fill={i === 2 ? GOLD : PAPER} stroke={i === 2 ? GOLD : INK} strokeWidth="1.6" />
        </g>
      ))}
      <rect x="290" y="176" width="66" height="30" rx="15" fill={GOLD} opacity="0.95" />
      <path d="M306 191 l6 6 l11 -12" fill="none" stroke={PAPER} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="330" y="186" width="16" height="4" rx="2" fill={PAPER} opacity="0.9" />
    </>
  );
}

/** A passport beside an appointment card with a stamp. */
function Visa() {
  return (
    <>
      <rect x="66" y="62" width="130" height="176" rx="6" fill={PINE} />
      <rect x="66" y="62" width="14" height="176" rx="3" fill={INK} opacity="0.25" />
      <circle cx="136" cy="128" r="28" fill="none" stroke={GOLD} strokeWidth="2.2" />
      <circle cx="136" cy="128" r="18" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.7" />
      <path d="M124 128 h24 M136 116 v24" stroke={GOLD} strokeWidth="1.4" opacity="0.8" />
      <rect x="100" y="182" width="72" height="6" rx="3" fill={GOLD} opacity="0.9" />
      <rect x="112" y="196" width="48" height="4" rx="2" fill={GOLD} opacity="0.55" />
      <g transform="translate(206 84)">
        <rect width="138" height="118" rx="4" fill={PAPER} stroke={INK} strokeWidth="1.6" />
        <rect width="138" height="24" rx="4" fill={INK} />
        <rect x="12" y="9" width="50" height="6" rx="3" fill={PAPER} opacity="0.9" />
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const active = i === 6;
          return (
            <rect
              key={i}
              x={14 + col * 30}
              y={36 + row * 26}
              width="20"
              height="16"
              rx="2"
              fill={active ? GOLD : "none"}
              stroke={active ? GOLD : INK}
              strokeWidth="1.2"
              opacity={active ? 1 : 0.4}
            />
          );
        })}
      </g>
      <g transform="rotate(-14 318 212)">
        <circle cx="318" cy="212" r="30" fill="none" stroke={GOLD} strokeWidth="2.4" strokeDasharray="5 4" />
        <circle cx="318" cy="212" r="21" fill="none" stroke={GOLD} strokeWidth="1.4" />
        <path d="M306 212 l8 8 l14 -16" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

/** A suitcase travelling a dotted route to a new home. */
function Arrival() {
  return (
    <>
      <path d="M110 216 C 160 130 230 250 286 150" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" opacity="0.55" />
      <g transform="translate(58 176)">
        <rect x="0" y="16" width="86" height="64" rx="6" fill={PINE} />
        <path d="M26 16 v-8 a6 6 0 0 1 6 -6 h22 a6 6 0 0 1 6 6 v8" fill="none" stroke={INK} strokeWidth="3" />
        <rect x="0" y="40" width="86" height="4" fill={INK} opacity="0.25" />
        <rect x="36" y="36" width="14" height="12" rx="2" fill={GOLD} />
        <circle cx="16" cy="88" r="5" fill={INK} />
        <circle cx="70" cy="88" r="5" fill={INK} />
      </g>
      <g transform="translate(252 78)">
        <path d="M0 62 L64 8 L128 62 V138 H0 Z" fill={PAPER} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M-8 66 L64 4 L136 66" fill="none" stroke={PINE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="50" y="84" width="28" height="54" rx="3" fill={PINE} />
        <circle cx="72" cy="112" r="2.5" fill={GOLD} />
        <rect x="14" y="80" width="26" height="24" rx="2" fill="none" stroke={INK} strokeWidth="1.6" />
        <rect x="90" y="80" width="26" height="24" rx="2" fill="none" stroke={INK} strokeWidth="1.6" />
        <path d="M27 80 v24 M14 92 h26" stroke={INK} strokeWidth="1" opacity="0.5" />
        <path d="M103 80 v24 M90 92 h26" stroke={INK} strokeWidth="1" opacity="0.5" />
      </g>
      <g transform="translate(300 48)">
        <circle r="7" fill={GOLD} />
        <circle r="13" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.5" />
      </g>
    </>
  );
}

/** A mentor a few steps ahead of a student on the same staircase. */
function Mentoring() {
  const steps = [0, 1, 2, 3];
  const person = (x: number, y: number, fill: string) => (
    <g transform={`translate(${x} ${y})`}>
      <circle cy="-27" r="11" fill={fill} />
      <path d="M-15 0 a15 15 0 0 1 30 0 Z" fill={fill} />
    </g>
  );
  return (
    <>
      {steps.map((i) => (
        <rect key={i} x={62 + i * 66} y={220 - i * 40} width="66" height={40 + i * 40 + 12} fill={PAPER} stroke={INK} strokeWidth="1.6" opacity={0.9} />
      ))}
      <path d="M62 220 H128 V180 H194 V140 H260 V100 H326" fill="none" stroke={PINE} strokeWidth="2.6" strokeLinejoin="round" />
      {person(96, 218, PINE)}
      {person(228, 138, INK)}
      <path d="M118 174 C 150 150 176 132 208 112" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
      <g transform="translate(326 100)">
        <line y2="-42" stroke={INK} strokeWidth="2" />
        <path d="M0 -42 h32 l-9 9 l9 9 h-32 z" fill={GOLD} />
      </g>
      <g transform="translate(258 76)">
        <rect width="54" height="30" rx="15" fill={PAPER} stroke={INK} strokeWidth="1.4" />
        <circle cx="16" cy="15" r="3" fill={INK} />
        <circle cx="27" cy="15" r="3" fill={INK} />
        <circle cx="38" cy="15" r="3" fill={INK} />
        <path d="M14 30 l-2 9 l12 -9" fill={PAPER} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      </g>
    </>
  );
}

const illustrations: Record<string, { art: () => ReactNode; ring: [number, number] }> = {
  "egitim-yonlendirme": { art: Guidance, ring: [62, 186] },
  "basvuru-sureci": { art: Application, ring: [330, 60] },
  "vize-hazirlik": { art: Visa, ring: [320, 210] },
  "almanyaya-hazirlik": { art: Arrival, ring: [316, 110] },
  mentorluk: { art: Mentoring, ring: [326, 90] },
};

export function ServiceIllustration({ slug, label, className }: { slug: string; label: string; className?: string }) {
  const entry = illustrations[slug];
  if (!entry) return null;
  const { art: Art, ring } = entry;

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative overflow-hidden rounded-[3px] border border-line bg-paper-raised", className)}
      style={{ aspectRatio: "4 / 3" }}
    >
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <Backdrop id={`ill-${slug}`} cx={ring[0]} cy={ring[1]} />
        <Art />
      </svg>
      <div className="absolute left-0 top-0 h-full w-[3px] bg-accent" />
    </div>
  );
}
