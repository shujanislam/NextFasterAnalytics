export default function DashboardCard({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="border border-black p-4">
      <div className="text-sm">{title}</div>
      <div className="mt-2 text-4xl font-bold tabular-nums">{content}</div>
    </div>
  );
}
