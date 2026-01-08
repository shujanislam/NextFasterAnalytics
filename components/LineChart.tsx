"use client";

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

type Row = {
  [key: string]: any;
};

export default function LineChart({
  rows,
  title = "Chart",
  subtitle = "Data over time",
  labelKey = "label",
  valueKey = "value",
  valueLabel = "Value",
  reverse = true,
}: {
  rows: Row[];
  title?: string;
  subtitle?: string;
  labelKey?: string;
  valueKey?: string;
  valueLabel?: string;
  reverse?: boolean;
}) {
  const { labels, values } = useMemo(() => {
    const ordered = reverse ? [...(rows ?? [])].reverse() : [...(rows ?? [])];

    const labels = ordered.map((r: any) => String(r[labelKey] ?? "N/A"));
    const values = ordered.map((r: any) => Number(r[valueKey]) || 0);

    return { labels, values };
  }, [rows, labelKey, valueKey, reverse]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: valueLabel,
          data: values,
          tension: 0.45,
          borderWidth: 2,
          borderColor: "rgba(20,20,20,0.65)",
          fill: true,
          backgroundColor: "rgba(20,20,20,0.08)",
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: "rgba(20,20,20,0.75)",
          pointBorderWidth: 0,
        },
      ],
    }),
    [labels, values, valueLabel]
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
            title: (items) => `${items?.[0]?.label ?? ""}`,
            label: (ctx) => `${valueLabel}: ${Number(ctx.parsed.y || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "rgba(0,0,0,0.45)",
            autoSkip: true,
            maxTicksLimit: 7,
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
    }),
    [valueLabel]
  );

  return (
    <div className="border border-black/60 p-4 mb-5">
      <div className="text-sm mb-1 text-black/80">{title}</div>
      <div className="text-xs text-black/45 mb-3">{subtitle}</div>

      {!rows || rows.length === 0 ? (
        <div className="text-sm text-gray-600">No data yet.</div>
      ) : (
        <div className="relative w-full" style={{ height: 240 }}>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}
