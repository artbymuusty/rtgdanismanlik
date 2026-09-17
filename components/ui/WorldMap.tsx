"use client";

import { useMemo, useRef } from "react";
import DottedMap from "dotted-map";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface Named {
  lat: number;
  lng: number;
  label: string;
}

/**
 * Representative starting points spread across Turkey — not RTG offices or
 * local reps, purely a visual counterweight to a single Istanbul dot, so the
 * map reads as "wherever you are" rather than "Istanbul → Germany."
 */
const ORIGINS: Named[] = [
  { lat: 41.0082, lng: 28.9784, label: "İstanbul" },
  { lat: 39.9334, lng: 32.8597, label: "Ankara" },
  { lat: 38.4237, lng: 27.1428, label: "İzmir" },
  { lat: 36.8969, lng: 30.7133, label: "Antalya" },
  { lat: 41.0027, lng: 39.7168, label: "Trabzon" },
];

const DESTINATIONS: Named[] = [
  { lat: 52.52, lng: 13.405, label: "Berlin" },
  { lat: 48.1351, lng: 11.582, label: "München" },
  { lat: 53.5511, lng: 9.9937, label: "Hamburg" },
  { lat: 50.1109, lng: 8.6821, label: "Frankfurt" },
];

// A Southeast-Europe → Germany crop rather than the full world: at world
// scale this route is a few invisible pixels in the middle of an
// irrelevant planet. Cropped, the journey fills the frame and the
// surrounding dot texture still reads as recognizable coastline.
const REGION = { lat: { min: 34, max: 57 }, lng: { min: 3, max: 42 } };

function routePath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - 34;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

export function WorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const play = inView && !reduceMotion;
  const settled = inView && reduceMotion;

  const { dotsDataUri, originPoints, routeOrigin, destinations, width, height } = useMemo(() => {
    const map = new DottedMap({ height: 90, region: REGION, grid: "diagonal" });
    const originPins = ORIGINS.map((o) => ({
      ...o,
      ...map.addPin({ lat: o.lat, lng: o.lng, svgOptions: { color: "transparent", radius: 0 } }),
    }));
    const destPoints = DESTINATIONS.map((d) => ({
      ...d,
      ...map.addPin({ lat: d.lat, lng: d.lng, svgOptions: { color: "transparent", radius: 0 } }),
    }));

    const svg = map.getSVG({
      radius: 0.28,
      color: "#D8D0BC",
      shape: "circle",
      backgroundColor: "transparent",
    });

    const centroid = {
      x: originPins.reduce((sum, o) => sum + o.x, 0) / originPins.length,
      y: originPins.reduce((sum, o) => sum + o.y, 0) / originPins.length,
    };

    return {
      dotsDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      originPoints: originPins,
      routeOrigin: centroid,
      destinations: destPoints,
      width: map.image.width,
      height: map.image.height,
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-[3px] border border-line bg-paper-raised"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- generated data URI, not an optimizable asset */}
      <img src={dotsDataUri} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />

      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        {destinations.map((dest, index) => (
          <g key={dest.label}>
            <motion.path
              d={routePath(routeOrigin, dest)}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={1.1}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={play || settled ? { pathLength: 1, opacity: 1 } : {}}
              transition={play ? { duration: 1.6, delay: 0.3 + index * 0.3, ease: "easeInOut" } : { duration: 0 }}
            />
            <motion.circle
              cx={dest.x}
              cy={dest.y}
              r={2.6}
              fill="var(--color-gold)"
              initial={{ scale: 0, opacity: 0 }}
              animate={play || settled ? { scale: 1, opacity: 1 } : {}}
              transition={play ? { duration: 0.4, delay: 1.7 + index * 0.3 } : { duration: 0 }}
            />
            {play ? (
              <motion.circle
                cx={dest.x}
                cy={dest.y}
                r={2.6}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth={0.7}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                transition={{ duration: 2, delay: 1.9 + index * 0.3, repeat: Infinity, repeatDelay: 1.4 }}
              />
            ) : null}
          </g>
        ))}

        {originPoints.map((origin, index) => (
          <motion.circle
            key={origin.label}
            cx={origin.x}
            cy={origin.y}
            r={2}
            fill="var(--color-ink)"
            initial={{ opacity: 0 }}
            animate={play || settled ? { opacity: 1 } : {}}
            transition={play ? { duration: 0.5, delay: index * 0.08 } : { duration: 0 }}
          />
        ))}
      </svg>

      <span
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-full border border-line bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink"
        style={{
          left: `${(routeOrigin.x / width) * 100}%`,
          top: `${(Math.min(...originPoints.map((o) => o.y)) / height) * 100 - 3}%`,
        }}
      >
        Türkiye
      </span>
      <span
        className="pointer-events-none absolute -translate-x-1/2 translate-y-2 rounded-full border border-line bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink"
        style={{
          left: `${(destinations.reduce((sum, d) => sum + d.x, 0) / destinations.length / width) * 100}%`,
          top: `${(Math.min(...destinations.map((d) => d.y)) / height) * 100}%`,
        }}
      >
        Almanya
      </span>
    </div>
  );
}
