"use client";

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function AddBars({
  points,
}: {
  points: { label: string; value: number }[];
}) {
  const { labels, values } = useMemo(() => {
    const safe = (points ?? []).map((p) => ({
      label: String(p.label ?? ""),
      value: Number(p.value) || 0,
    }));

    return {
      labels: safe.map((p) => p.label),
      values: safe.map((p) => p.value),
    };
  }, [points]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Adds",
          data: values,

          // smooth + minimal
          tension: 0.45,          // ✅ curvy
          borderWidth: 2,
          pointRadius: 0,         // ✅ no chunky dots
          pointHoverRadius: 3,

          // minimal colors (not distracting)
          borderColor: "rgba(20, 20, 20, 0.70)",
          backgroundColor: "rgba(20, 20, 20, 0.08)",

          fill: true,             // ✅ soft area fill (turn off if you want)
        },
      ],
    }),
    [labels, values]
  );

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 220 },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: "rgba(20,20,20,0.92)",
          padding: 10,
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (ctx) => `Adds: ${ctx.parsed.y ?? 0}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "rgba(0,0,0,0.45)",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6, // ✅ keep it clean
          },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.08)" },
          ticks: {
            color: "rgba(0,0,0,0.45)",
            precision: 0,
            maxTicksLimit: 5,
          },
          border: { display: false },
        },
      },
      elements: {
        line: { capBezierPoints: true },
      },
    }),
    []
  );

  return (
    <div className="border border-black/60 p-4">
      <div className="text-sm mb-1 text-black/80">Adds to cart</div>
      <div className="text-xs text-black/45 mb-3">Hourly (last 24h)</div>

      {!points || points.length === 0 ? (
        <div className="text-sm text-gray-600">No data yet.</div>
      ) : (
        <div className="relative w-full" style={{ height: 220 }}>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}
