export default function CategoryHistogram({
  rows,
  title = "Top categories (last 7 days)",
}: {
  rows: { category: string; adds: number }[];
  title?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.adds));

  return (
    <div className="border border-black p-4">
      <div className="text-sm mb-3">{title}</div>

      <div className="space-y-2">
        {rows.map((r) => {
          const pct = Math.round((r.adds / max) * 100);

          return (
            <div key={r.category} className="flex items-center gap-3">
              <div className="w-48 text-xs truncate" title={r.category}>
                {r.category}
              </div>

              <div className="flex-1">
                <div className="h-4 border border-black">
                  <div
                    className="bg-blue-700 h-full "
                    style={{ width: `${pct}%` }}
                    title={`${r.adds} adds`}
                  />
                </div>
              </div>

              <div className="w-10 text-xs tabular-nums text-right">{r.adds}</div>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <div className="text-xs mt-2">No data in the last 7 days.</div>
      )}
    </div>
  );
}
