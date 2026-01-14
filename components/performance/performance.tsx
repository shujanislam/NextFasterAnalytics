import { fetchApiLatencyTime, fetchErrorRate, fetchErrorLogs, analyzeError } from '../../lib/performance-metrics/queries';

import DashboardCard from "@/components/DashboardCard";
import ErrorLogs from "@/components/ErrorLogs";

export default async function Performance() {
  const api_latency_ms = await fetchApiLatencyTime();
  const error_rate = await fetchErrorRate();
  
  const error_logs = await fetchErrorLogs();

  const error_analyzed_text = await analyzeError();

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
        <p>{ error_analyzed_text }</p>
    </>
  );
}
