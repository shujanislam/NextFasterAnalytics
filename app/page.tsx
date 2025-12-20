import {
  fetchTotalUsers,
  fetchTotalActiveUsers,
  fetchTotalLoggedOutUsers,
  fetchTotalProductsAddedToday,
  fetchAddsOverLast24Hours,
  fetchTopCategoriesFromCart,
} from "@/lib/queries";

import AddBars from "@/components/AddBars";
import CategoryHistogram from "@/components/CategoryHistogram";

export default async function Home() {
  const totalUsers = await fetchTotalUsers();
  const totalActiveUsers = await fetchTotalActiveUsers();
  const totalLoggedOutUsers = await fetchTotalLoggedOutUsers();
  const totalProductsAddedToday = await fetchTotalProductsAddedToday();

  const addsSeries = await fetchAddsOverLast24Hours();

  const topCategories = await fetchTopCategoriesFromCart();
  
  const points = addsSeries.map((d: any) => ({
    label: new Date(d.hour).toLocaleTimeString([], { hour: "2-digit" }),
    value: Number(d.adds) || 0,
  }));

  return (
    <main className="p-6 space-y-4">
      <div className="max-w-xl border border-black p-4">
        <div className="text-sm">Total users</div>
        <div className="mt-2 text-4xl font-bold tabular-nums">{totalUsers}</div>
      </div>

      <div className="max-w-xl border border-black p-4">
        <div className="text-sm">Total Active users (in 24 hours)</div>
        <div className="mt-2 text-4xl font-bold tabular-nums">
          {totalActiveUsers}
        </div>
      </div>

      <div className="max-w-xl border border-black p-4">
        <div className="text-sm">Total Logged Out users (in 30 days)</div>
        <div className="mt-2 text-4xl font-bold tabular-nums">
          {totalLoggedOutUsers}
        </div>
      </div>

      <div className="max-w-xl border border-black p-4">
        <div className="text-sm">Products added to cart (last 24 hours)</div>
        <div className="mt-2 text-4xl font-bold tabular-nums">
          {totalProductsAddedToday}
        </div>
      </div>

      <div className="max-w-2xl">
        <AddBars points={points} />
      </div>
<div className="max-w-3xl">
        <CategoryHistogram rows={topCategories} />
      </div>
    </main>
  );
}
