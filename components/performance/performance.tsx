import { fetchApiLatencyTime, fetchErrorRate } from '../../lib/performance-metrics/queries';

import DashboardCard from "@/components/DashboardCard";

export default async function Performance() {
  const api_latency_ms = await fetchApiLatencyTime();
  const error_rate = await fetchErrorRate();
  return (
    <>
        <DashboardCard
          title="Average API latency [Product View] (in ms)"
          content={api_latency_ms}
        />

        <DashboardCard
          title="Error Rate (in %)"
          content={error_rate}
        />
    </>
  );
}
