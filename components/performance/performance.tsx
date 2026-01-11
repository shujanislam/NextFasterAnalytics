import { fetchApiLatencyTime, fetchErrorRate, fetchErrorLogs } from '../../lib/performance-metrics/queries';

import DashboardCard from "@/components/DashboardCard";
import ErrorLogs from "@/components/ErrorLogs";

export default async function Performance() {
  const api_latency_ms = await fetchApiLatencyTime();
  const error_rate = await fetchErrorRate();
  
  const error_logs = await fetchErrorLogs();

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

        <ErrorLogs logs={error_logs ?? []} topN={10} />
    </>
  );
}
