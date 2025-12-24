"use client";

import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type Row = {
  collection_name: string | null;
  product_count: number | string;
};

// Visible-but-soft palette (muted, not neon, still clearly distinguishable)
const SOFT_VISIBLE = [
  "#7FA9D6", // soft blue
  "#B69AD8", // soft purple
  "#7FC7B2", // soft mint
  "#E1B073", // soft amber
  "#D88FA8", // soft rose
  "#89B8C9", // soft teal
  "#C6C27A", // soft olive
  "#A7B2C8", // soft slate
  "#D4A6A6", // dusty pink
];

export default function ProductsPerCollectionPie({
  rows,
  topN = 8,
  showLegend = true,
}: {
  rows: Row[];
  topN?: number;
  showLegend?: boolean;
}) {
  const { labels, values, colors, total } = useMemo(() => {
    const clean = (rows ?? [])
      .filter((r) => r?.collection_name)
      .map((r) => ({
        label: String(r.collection_name),
        value: Number(r.product_count) || 0,
      }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);

    if (clean.length === 0) {
      return { labels: [], values: [], colors: [], total: 0 };
    }

    const top = clean.slice(0, topN);
    const rest = clean.slice(topN);
    const othersValue = rest.reduce((sum, r) => sum + r.value, 0);

    const final =
      othersValue > 0 ? [...top, { label: "Others", value: othersValue }] : top;

    const labels = final.map((d) => d.label);
    const values = final.map((d) => d.value);
    const total = values.reduce((a, b) => a + b, 0);

    // Give "Others" a neutral but still visible color
    const colors = labels.map((lab, i) =>
      lab === "Others" ? "#C9CED8" : SOFT_VISIBLE[i % SOFT_VISIBLE.length]
    );

    return { labels, values, colors, total };
  }, [rows, topN]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,

          // ✅ smooth look: no borders between slices
          borderWidth: 0,

          // ✅ subtle hover
          hoverOffset: 4,
        },
      ],
    }),
    [labels, values, colors]
  );

  const options: ChartOptions<"pie"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 220 },
      plugins: {
        legend: {
          display: showLegend,
          position: "right",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            padding: 10,
            color: "rgba(0,0,0,0.55)",
            font: { size: 11 },
          },
        },
        tooltip: {
          backgroundColor: "rgba(25,25,25,0.92)",
          titleColor: "#fff",
          bodyColor: "#fff",
          displayColors: false,
          padding: 10,
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.parsed) || 0;
              const pct = total ? ((v / total) * 100).toFixed(1) : "0.0";
              return `${ctx.label}: ${v} (${pct}%)`;
            },
          },
        },
      },
    }),
    [total, showLegend]
  );

  return (
    <div className="border border-black/60 p-4">
      <div className="text-sm mb-1 text-black/80">Products per Collection</div>
      <div className="text-xs text-black/45 mb-3">
        Top {topN} collections + Others
      </div>

      {labels.length === 0 || total === 0 ? (
        <div className="text-sm text-gray-600">No data yet.</div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-black/50">
            Total products counted:{" "}
            <span className="font-semibold text-black/80">{total}</span>
          </div>

          <div className="relative w-full" style={{ height: 240 }}>
            <Pie data={data} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
