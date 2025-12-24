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

type Row = {
  product_name: string;
  views: number | string;
  product_slug?: string | null;
};

export default function TopViewedProductsChart({
  rows,
  title = "Top viewed products",
  topN = 10,
}: {
  rows: Row[];
  title?: string;
  topN?: number;
}) {
  const { labels, values } = useMemo(() => {
    const clean = (rows ?? [])
      .map((r) => ({
        name: String(r.product_name ?? "").trim(),
        views: Number(r.views) || 0,
      }))
      .filter((r) => r.name.length > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, topN);

    return {
      labels: clean.map((r) => r.name),
      values: clean.map((r) => r.views),
    };
  }, [rows, topN]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: "rgba(20,20,20,0.18)", // minimal
          borderWidth: 0, // smooth
          barThickness: 10,
          borderRadius: 999,
        },
      ],
    }),
    [labels, values]
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: "rgba(20,20,20,0.92)",
          padding: 10,
          callbacks: {
            label: (ctx) => `Views: ${ctx.parsed.x}`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: {
            color: "rgba(0,0,0,0.45)",
            precision: 0,
            maxTicksLimit: 5,
          },
          border: { display: false },
        },
        y: {
          grid: { display: false },
          ticks: {
            color: "rgba(0,0,0,0.55)",
            callback: function (value) {
              const label = this.getLabelForValue(Number(value));
              return label.length > 26 ? label.slice(0, 26) + "…" : label;
            },
          },
          border: { display: false },
        },
      },
    }),
    []
  );

  return (
    <div className="border border-black/60 p-4">
      <div className="text-sm mb-1 text-black/80">{title}</div>
      <div className="text-xs text-black/45 mb-3">Top {topN} by views</div>

      {!rows || rows.length === 0 ? (
        <div className="text-sm text-gray-600">No data yet.</div>
      ) : (
        <div className="relative w-full" style={{ height: 280 }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
