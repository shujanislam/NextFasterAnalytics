"use client";

import { useState } from "react";

type Tab = "business" | "performance";

export default function TabNavigation({
  businessMetrics,
  performanceMetrics,
}: {
  businessMetrics: React.ReactNode;
  performanceMetrics: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("business");

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-1 text-xs">
        <button
          onClick={() => setActiveTab("business")}
          className={`hover:underline ${
            activeTab === "business"
              ? "text-blue-600 font-normal"
              : "text-gray-500"
          }`}
        >
          Business Metrics
        </button>
        <span className="text-gray-400">&gt;&gt;</span>
        <button
          onClick={() => setActiveTab("performance")}
          className={`hover:underline ${
            activeTab === "performance"
              ? "text-blue-600 font-normal"
              : "text-gray-500"
          }`}
        >
          Performance Metrics
        </button>
      </nav>

      <div>
        {activeTab === "business" && businessMetrics}
        {activeTab === "performance" && performanceMetrics}
      </div>
    </div>
  );
}
