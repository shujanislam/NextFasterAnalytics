"use client"

type ErrorLog = {
  route: string;
  status: number | string;
};

export default function ErrorLogs({
  logs,
  topN = 10,
}: {
  logs: ErrorLog[];
  topN?: number;
}) {
  const displayLogs = (logs ?? []).slice(0, topN);

  return (
    <div className="border border-black/60 p-4">
      <div className="text-sm mb-1 text-black/80">Error Logs</div>
      <div className="text-xs text-black/45 mb-3">
        {logs.length > 0 ? `Latest ${displayLogs.length} errors` : "No errors"}
      </div>

      {!logs || logs.length === 0 ? (
        <div className="text-sm text-gray-600">No error logs found.</div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-black/50">
            Total errors:{" "}
            <span className="font-semibold text-black/80">{logs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/20">
                  <th className="text-left py-2 px-2 text-black/60 font-normal">
                    Route
                  </th>
                  <th className="text-left py-2 px-2 text-black/60 font-normal">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayLogs.map((log, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-black/10 hover:bg-black/2 transition-colors"
                  >
                    <td className="py-2 px-2 text-black/75 font-mono">
                      {log.route || "N/A"}
                    </td>
                    <td className="py-2 px-2 text-black/75">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          String(log.status).startsWith("5")
                            ? "bg-red-100 text-red-700"
                            : String(log.status).startsWith("4")
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
