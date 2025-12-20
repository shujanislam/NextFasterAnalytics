export default function AddBars({
  points,
}: {
  points: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...points.map((p) => p.value));

  return (
    <div className="border border-black p-4">
      <div className="text-sm mb-3">Adds to cart (hourly, last 24h)</div>

      <div className="flex items-end gap-1 h-28 overflow-x-auto">
        {points.map((p, i) => {
          const h = Math.round((p.value / max) * 100);
          return (
            <div key={i} className="w-3 flex flex-col items-center">
              <div
                className="w-full border border-black"
                style={{ height: `${h}%` }}
                title={`${p.label}: ${p.value}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between text-xs">
        <span>{points[0]?.label ?? ""}</span>
        <span>{points.at(-1)?.label ?? ""}</span>
      </div>
    </div>
  );
}
