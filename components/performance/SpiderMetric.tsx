"use client";

import React, { useMemo } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type SpiderMetricProps = {
  labels: string[];
  values: number[];
  title?: string;
  subtitle?: string;
  valueLabel?: string;
  topN?: number;
};

export default function SpiderMetric({
  labels,
  values,
  title = "Spider metric",
  subtitle = "Relative distribution",
  valueLabel = "Value",
  topN = 8,
}: SpiderMetricProps) {
  const { chartLabels, chartValues } = useMemo(() => {
    const pairs = labels.map((l, i) => ({
      label: l,
      value: values[i] ?? 0,
    }));

    pairs.sort((a, b) => b.value - a.value);
    const sliced = pairs.slice(0, topN);

    return {
      chartLabels: sliced.map((p) => p.label),
      chartValues: sliced.map((p) => p.value),
    };
  }, [labels, values, topN]);

  const data = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          label: valueLabel,
          data: chartValues,
          borderColor: "rgba(20,20,20,0.75)",
          backgroundColor: "rgba(20,20,20,0.08)",
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: "rgba(20,20,20,0.85)",
          pointBorderWidth: 0,
        },
      ],
    }),
    [chartLabels, chartValues, valueLabel]
  );

  const options: ChartOptions<"radar"> = useMemo(
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
            label: (ctx) => {
              const v = Number(ctx.parsed.r || 0);
              return `${valueLabel}: ${v.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          angleLines: {
            color: "rgba(0,0,0,0.07)",
          },
          grid: {
            color: "rgba(0,0,0,0.08)",
          },
          pointLabels: {
            color: "rgba(0,0,0,0.6)",
            font: { size: 11 },
          },
          ticks: {
            backdropColor: "transparent",
            color: "rgba(0,0,0,0.45)",
            showLabelBackdrop: false,
            maxTicksLimit: 4,
          },
        },
      },
    }),
    [valueLabel]
  );

  const hasData =
    chartLabels.length > 0 && chartValues.some((value) => value > 0);

  return (
    <div className="border border-black/60 p-4 mb-4 ">
      <div className="text-sm mb-1 text-black/80">{title}</div>
      <div className="text-xs text-black/45 mb-3">{subtitle}</div>

      {!hasData ? (
        <div className="text-sm text-gray-600">No data yet.</div>
      ) : (
        <div className="relative w-full" style={{ height: 260 }}>
          <Radar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
