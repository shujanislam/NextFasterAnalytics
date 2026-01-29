import { fetchApiLatencyTime, fetchErrorRate, fetchErrorLogs, analyzeError, fetchTraffic } from '../../lib/performance-metrics/queries';

import DashboardCard from "@/components/DashboardCard";
import ErrorLogs from "@/components/ErrorLogs";
import ErrorAnalysisLink from "@/components/performance/ErrorAnalysisLink";

export default async function Performance() {
  const api_latency_ms = await fetchApiLatencyTime();
  const error_rate = await fetchErrorRate();
  
  const error_logs = await fetchErrorLogs();

  const analyzeErrorAction = async () => {
    "use server";
    const summary = await analyzeError();
    return summary ?? "No analysis available.";
  };

  await fetchTraffic();

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

        <ErrorAnalysisLink analyzeAction={analyzeErrorAction} />
    </>
  );
}
