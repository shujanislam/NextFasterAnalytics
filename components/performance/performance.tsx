import { fetchApiLatencyTime, fetchErrorRate, fetchErrorLogs, analyzeError, fetchTraffic, fetchHydrationTime } from '../../lib/performance-metrics/queries';

import DashboardCard from "@/components/DashboardCard";
import ErrorLogs from "@/components/ErrorLogs";
import ErrorAnalysisLink from "@/components/performance/ErrorAnalysisLink";
import SpiderMetric from "@/components/performance/SpiderMetric";

export default async function Performance() {
  const api_latency_ms = await fetchApiLatencyTime();
  const error_rate = await fetchErrorRate();

  const error_logs = await fetchErrorLogs();
  const traffic = await fetchTraffic();

  const hydration_time = await fetchHydrationTime();

  const trafficLabels = (traffic ?? []).map((row: any) =>
    String(row.route ?? "N/A")
  );
  const trafficValues = (traffic ?? []).map((row: any) =>
    Number(row.requests) || 0
  );

  const analyzeErrorAction = async () => {
    "use server";
    const summary = await analyzeError();
    return summary ?? "No analysis available.";
  };

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

      <DashboardCard
        title="Average Hydration Time (in ms)"
        content={hydration_time}
      />

      <SpiderMetric
        labels={trafficLabels}
        values={trafficValues}
        title="Traffic by route"
        subtitle="Relative request volume per route (top 8)"
        valueLabel="Requests"
        topN={8}
      />

      <ErrorLogs logs={error_logs ?? []} topN={10} />

      <ErrorAnalysisLink analyzeAction={analyzeErrorAction} />
    </>
  );
}
