"use client";

import React, { useMemo } from "react";

type Row = {
  subcategory_slug: string | null;
  product_count: number | string;
};

type Slice = {
  label: string;
  value: number;
  color: string;
};

function stableColorFromString(s: string) {
  // deterministic color per label (no randomness)
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `hsl(${hue} 70% 50%)`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export default function ProductsPerCategoryPie({
  rows,
  topN = 8,
  size = 220,
}: {
  rows: Row[];
  topN?: number;
  size?: number;
}) {
  const slices: Slice[] = useMemo(() => {
    const clean = (rows ?? [])
      .filter((r) => r?.subcategory_slug)
      .map((r) => ({
        label: String(r.subcategory_slug),
        value: Number(r.product_count) || 0,
      }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);

    if (clean.length === 0) return [];

    const top = clean.slice(0, topN);
    const rest = clean.slice(topN);
    const othersValue = rest.reduce((sum, r) => sum + r.value, 0);

    const final = othersValue > 0 ? [...top, { label: "Others", value: othersValue }] : top;

    return final.map((d) => ({
      label: d.label,
      value: d.value,
      color: stableColorFromString(d.label),
    }));
  }, [rows, topN]);

  const total = useMemo(() => slices.reduce((sum, s) => sum + s.value, 0), [slices]);

  const radius = Math.floor(size / 2) - 8;
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);

  let currentAngle = 0; // 0..360

  return (
    <div className="border border-black p-4">
      <div className="text-sm mb-3">Products per subcategory (Pie)</div>

      {(!slices || slices.length === 0 || total === 0) ? (
        <div className="text-sm text-gray-600">No data yet.</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
            {/* background ring (optional) */}
            <circle cx={cx} cy={cy} r={radius} fill="transparent" stroke="black" strokeWidth="1" />

            {slices.map((s) => {
              const angle = (s.value / total) * 360;
              const start = currentAngle;
              const end = currentAngle + angle;

              // advance for next slice
              currentAngle = end;

              const d = describeArc(cx, cy, radius, start, end);

              return (
                <path
                  key={s.label}
                  d={d}
                  fill={s.color}
                  stroke="black"
                  strokeWidth="1"
                >
                  <title>
                    {s.label}: {s.value} ({((s.value / total) * 100).toFixed(1)}%)
                  </title>
                </path>
              );
            })}
          </svg>

          <div className="w-full">
            <div className="text-xs text-gray-600 mb-2">
              Total products counted: <span className="font-semibold text-black">{total}</span>
            </div>

            <div className="space-y-2">
              {slices.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="inline-block h-3 w-3 border border-black"
                      style={{ background: s.color }}
                    />
                    <div className="text-sm truncate">{s.label}</div>
                  </div>

                  <div className="text-sm tabular-nums font-bold">
                    {s.value}{" "}
                    <span className="text-gray-600 font-normal">
                      ({((s.value / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs text-gray-600">
              Tip: hover slices to see tooltip (native SVG title).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
