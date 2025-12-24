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
  day: string;          // from SQL: created_at::date => "2025-12-24"
  count: number | string; // default column name from COUNT(*)
};

export default function NewUsersLineChart({
  rows,
  title = "New users per day",
}: {
  rows: Row[];
  title?: string;
}) {
  const { labels, values } = useMemo(() => {
    // rows come ordered DESC from SQL; reverse so chart moves left->right by date
    const ordered = [...(rows ?? [])].reverse();

    const labels = ordered.map((r: any) => String(r.day));
    const values = ordered.map((r: any) => Number(r.count) || 0);

    return { labels, values };
  }, [rows]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "New users",
          data: values,

          // smooth + minimal
          tension: 0.45,          // ✅ curvy
          borderWidth: 2,
          borderColor: "rgba(20,20,20,0.65)",

          // subtle fill under the curve
          fill: true,
          backgroundColor: "rgba(20,20,20,0.08)",

          // bullet points
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: "rgba(20,20,20,0.75)",
          pointBorderWidth: 0,
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
            title: (items) => `Date: ${items?.[0]?.label ?? ""}`,
            label: (ctx) => `New users: ${Number(ctx.parsed.y || 0).toLocaleString()}`,
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
    []
  );

  return (
    <div className="border border-black/60 p-4">
      <div className="text-sm mb-1 text-black/80">{title}</div>
      <div className="text-xs text-black/45 mb-3">Users created per date</div>

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
