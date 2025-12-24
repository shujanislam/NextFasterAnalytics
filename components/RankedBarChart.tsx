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

export default function RankedBarChart({
  labels,
  values,
  title,
  subtitle,
  valueLabel = "Value",
  valuePrefix = "",
  valueSuffix = "",
  decimals = 0,
  topN = 10,
  height = 280,
  barColor = "rgba(20,20,20,0.18)",
}: {
  labels: string[];
  values: number[];
  title: string;
  subtitle?: string;
  valueLabel?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  decimals?: number;
  topN?: number;
  height?: number;
  barColor?: string;
}) {
  const sliced = useMemo(() => {
    const arr = labels.map((l, i) => ({ label: l, value: values[i] ?? 0 }));
    arr.sort((a, b) => b.value - a.value);
    return arr.slice(0, topN);
  }, [labels, values, topN]);

  const chartLabels = sliced.map((d) => d.label);
  const chartValues = sliced.map((d) => d.value);

  const data = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          data: chartValues,
          backgroundColor: barColor,
          borderWidth: 0,
          barThickness: 10,
          borderRadius: 999,
        },
      ],
    }),
    [chartLabels, chartValues, barColor]
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
            label: (ctx) => {
              const x = Number(ctx.parsed.x || 0);
              return `${valueLabel}: ${valuePrefix}${x.toFixed(decimals)}${valueSuffix}`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { color: "rgba(0,0,0,0.45)", maxTicksLimit: 5 },
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
    [valueLabel, valuePrefix, valueSuffix, decimals]
  );

  return (
    <div className="border border-black/60 p-4">
      <div className="text-sm mb-1 text-black/80">{title}</div>
      <div className="text-xs text-black/45 mb-3">
        {subtitle ?? `Top ${topN}`}
      </div>

      {chartLabels.length === 0 ? (
        <div className="text-sm text-gray-600">No data yet.</div>
      ) : (
        <div className="relative w-full" style={{ height }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
