import { fetchApiLatencyTime } from '../../lib/performance-metrics/queries';

import DashboardCard from "@/components/DashboardCard";

export default async function Performance() {
  const api_latency_ms = await fetchApiLatencyTime();
  return (
    <>
        <DashboardCard
          title="Average API latency (in ms)"
          content={api_latency_ms}
        />
    </>
  );
}
