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

const SOFT_VISIBLE = [
  "#7FA9D6", // soft blue
  "#B69AD8", // soft purple
  "#7FC7B2", // soft mint
  "#E1B073", // soft amber
  "#D88FA8", // soft rose
];

export default function DeviceTypePie({
  devicePercentages,
  showLegend = true,
}: {
  devicePercentages: { mobilePercent: number; tabletPercent: number; desktopPercent: number };
  showLegend?: boolean;
}) {
  const { labels, values, colors, total } = useMemo(() => {
    const labels = ["Mobile", "Tablet", "Desktop"];
    const values = [
      devicePercentages.mobilePercent || 0,
      devicePercentages.tabletPercent || 0,
      devicePercentages.desktopPercent || 0,
    ];
    const total = values.reduce((a, b) => a + b, 0);
    const colors = SOFT_VISIBLE.slice(0, 3);
    return { labels, values, colors, total };
  }, [devicePercentages]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
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
              return `${ctx.label}: ${v.toFixed(1)}%`;
            },
          },
        },
      },
    }),
    [showLegend]
  );

  return (
    <div className="border border-black/60 p-4">
      <div className="text-sm mb-1 text-black/80">Device Type Percentage</div>
      <div className="text-xs text-black/45 mb-3">Mobile, Tablet, Desktop</div>
      {total === 0 ? (
        <div className="text-sm text-gray-600">No data yet.</div>
      ) : (
        <div className="space-y-2">
          <div className="relative w-full" style={{ height: 240 }}>
            <Pie data={data} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
