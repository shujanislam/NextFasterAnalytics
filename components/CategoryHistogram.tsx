"use client";

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CategoryHistogram({
  rows,
  title = "Top categories (last 7 days)",
  topN = 12,
}: {
  rows: { category: string; adds: number }[];
  title?: string;
  topN?: number;
}) {
  const { labels, values } = useMemo(() => {
    const clean = (rows ?? [])
      .map((r) => ({
        category: String(r.category ?? "").trim(),
        adds: Number(r.adds) || 0,
      }))
      .filter((r) => r.category.length > 0)
      .sort((a, b) => b.adds - a.adds)
      .slice(0, topN);

    return {
      labels: clean.map((r) => r.category),
      values: clean.map((r) => r.adds),
    };
  }, [rows, topN]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Adds",
          data: values,
          borderWidth: 1,
        },
      ],
    }),
    [labels, values]
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", // ✅ horizontal bars
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.x} adds`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: { color: "rgba(0,0,0,0.15)" },
        },
        y: {
          ticks: {
            // keep labels readable; chartjs doesn’t auto-wrap
            callback: function (value) {
              const label = this.getLabelForValue(Number(value));
              return label.length > 22 ? label.slice(0, 22) + "…" : label;
            },
          },
          grid: { display: false },
        },
      },
    }),
    []
  );

  return (
    <div className="border border-black p-4">
      <div className="text-sm mb-3">{title}</div>

      {!rows || rows.length === 0 ? (
        <div className="text-xs mt-2">No data in the last 7 days.</div>
      ) : (
        <div className="relative w-full" style={{ height: 320 }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
