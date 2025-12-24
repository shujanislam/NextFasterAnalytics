import {
  fetchTotalUsers,
  fetchTotalActiveUsers,
  fetchTotalLoggedOutUsers,
  fetchTotalProductsAddedToday,
  fetchAddsOverLast24Hours,
  fetchTopProductViews,
  fetchTopCategoriesFromCart,
  fetchAverageCategoryProductPrice,
  fetchProductsPerCategory,
  fetchProductsPerCollection
} from "@/lib/queries";

import AddBars from "@/components/AddBars";
import CategoryHistogram from "@/components/CategoryHistogram";
import ProductsPerCategoryPie from "@/components/ProductsPerCategoryPie";
import ProductsPerCollectionPie from "@/components/ProductsPerCollectionPie";

export default async function Home() {
  const totalUsers = await fetchTotalUsers();
  const totalActiveUsers = await fetchTotalActiveUsers();
  const totalLoggedOutUsers = await fetchTotalLoggedOutUsers();
  const totalProductsAddedToday = await fetchTotalProductsAddedToday();
  const totalProductViews = await fetchTopProductViews();
  const avgCategoryPrices = await fetchAverageCategoryProductPrice();

  const addsSeries = await fetchAddsOverLast24Hours();

  const topCategories = await fetchTopCategoriesFromCart();
  
  const productsPerCategory = await fetchProductsPerCategory();
  const productsPerCollection = await fetchProductsPerCollection();
  
  const points = addsSeries.map((d: any) => ({
    label: new Date(d.hour).toLocaleTimeString([], { hour: "2-digit" }),
    value: Number(d.adds) || 0,
  }));

  return (
    <main className="p-6 space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border border-black p-4">
          <div className="text-sm">Total users</div>
          <div className="mt-2 text-4xl font-bold tabular-nums">
            {totalUsers}
          </div>
        </div>

        <div className="border border-black p-4">
          <div className="text-sm">Total Active users (in 24 hours)</div>
          <div className="mt-2 text-4xl font-bold tabular-nums">
            {totalActiveUsers}
          </div>
        </div>

        <div className="border border-black p-4">
          <div className="text-sm">Total Logged Out users (in 30 days)</div>
          <div className="mt-2 text-4xl font-bold tabular-nums">
            {totalLoggedOutUsers}
          </div>
        </div>

        <div className="border border-black p-4">
          <div className="text-sm">
            Products added to cart (last 24 hours)
          </div>
          <div className="mt-2 text-4xl font-bold tabular-nums">
            {totalProductsAddedToday}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddBars points={points} />
        <CategoryHistogram rows={topCategories} />

<div className="border border-black p-4">
  <div className="text-sm mb-3">Top viewed products</div>

  {(!totalProductViews || totalProductViews.length === 0) ? (
    <div className="text-sm text-gray-600">No data yet.</div>
  ) : (
    <div className="space-y-2">
      {totalProductViews.map((p: any, idx: number) => (
        <div key={p.product_slug ?? `${p.product_name}-${idx}`} className="flex justify-between">
          <div className="text-sm">
            <span className="mr-2 font-semibold">{idx + 1}.</span>
            {p.product_name}
          </div>
          <div className="text-sm tabular-nums font-bold">{p.views}</div>
        </div>
      ))}
    </div>
  )}
</div>

<div className="border border-black p-4">
  <div className="text-sm mb-3">Average price by subcategory</div>

  {(!avgCategoryPrices || avgCategoryPrices.length === 0) ? (
    <div className="text-sm text-gray-600">No data yet.</div>
  ) : (
    <div className="space-y-2">
      {avgCategoryPrices.map((r: any, idx: number) => (
        <div key={r.subcategory_slug ?? idx} className="flex justify-between">
          <div className="text-sm">{r.subcategory_slug}</div>
          <div className="text-sm tabular-nums font-bold">
            {Number(r.avg_price).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      </div>

<ProductsPerCategoryPie rows={productsPerCategory} topN={2000} />
<ProductsPerCollectionPie rows={productsPerCollection} topN={8} />
    </main>
  );
}
