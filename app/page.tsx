import { fetchTotalUsers } from "@/lib/queries";
import { fetchTotalActiveUsers } from "@/lib/queries";
import { fetchTotalLoggedOutUsers } from "@/lib/queries";

export default async function Home() {
  const totalUsers = await fetchTotalUsers();
  const totalActiveUsers = await fetchTotalActiveUsers();
  const totalLoggedOutUsers = await fetchTotalLoggedOutUsers();
  return (
    <main className="p-6">
      <div className="max-w-xl">
        <div className="border border-black p-4">
          <div className="text-sm">Total users</div>

          <div className="mt-2 text-4xl font-bold tabular-nums">
            {totalUsers}
          </div>
        </div>
      </div>
      <div className="max-w-xl">
        <div className="border border-black p-4">
          <div className="text-sm">Total Active users (in 24 hours)</div>

          <div className="mt-2 text-4xl font-bold tabular-nums">
            {totalActiveUsers}
          </div>
        </div>
      </div>
      <div className="max-w-xl">
        <div className="border border-black p-4">
          <div className="text-sm">Total Logged Out users (in 30 days)</div>

          <div className="mt-2 text-4xl font-bold tabular-nums">
            {totalLoggedOutUsers}
          </div>
        </div>
      </div>
    </main>
  );
}
