import {
  fetchTotalUsers,
  fetchTotalActiveUsers,
  fetchTotalLoggedOutUsers,
  fetchTotalProductsAddedToday,
  fetchAddsOverLast24Hours,
  fetchTopProductViews,
  fetchTopCategoriesFromCart,
  fetchAverageCategoryProductPrice,
  fetchProductsPerCollection,
  fetchTotalProductViews,
  fetchNewUsersMetrics,
  estimatedCartRevenue,
} from "@/lib/queries";

import AddBars from "@/components/AddBars";
import CategoryHistogram from "@/components/CategoryHistogram";
import ProductsPerCollectionPie from "@/components/ProductsPerCollectionPie";
import DashboardCard from "@/components/DashboardCard";
import RankedBarChart from "@/components/RankedBarChart";
import NewUsersLineChart from "@/components/NewUsersLineChart";

export default async function Home() {
  const totalUsers = await fetchTotalUsers();
  const totalActiveUsers = await fetchTotalActiveUsers();
  const totalLoggedOutUsers = await fetchTotalLoggedOutUsers();
  const totalProductsAddedToday = await fetchTotalProductsAddedToday();
  const topProductViews = await fetchTopProductViews();
  const avgCategoryPrices = await fetchAverageCategoryProductPrice();

  const addsSeries = await fetchAddsOverLast24Hours();
  const topCategories = await fetchTopCategoriesFromCart();

  const productsPerCollection = await fetchProductsPerCollection();
  const totalProductViews = await fetchTotalProductViews();

  const cartRevenue = await estimatedCartRevenue();

  const topProductLabels = topProductViews.map((r: any) => String(r.product_name));
  const topProductValues = topProductViews.map((r: any) => Number(r.views) || 0);

  const avgPriceLabels = avgCategoryPrices.map((r: any) => String(r.subcategory_slug));
  const avgPriceValues = avgCategoryPrices.map((r: any) => Number(r.avg_price) || 0);

  const newUsersByDay = await fetchNewUsersMetrics();

  const points = addsSeries.map((d: any) => ({
    label: new Date(d.hour).toLocaleTimeString([], { hour: "2-digit" }),
    value: Number(d.adds) || 0,
  }));

  return (
    <main className="p-6 space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="Total users" content={totalUsers} />
        <DashboardCard
          title="Total Active users (in 24 hours)"
          content="67038"
        />
        <DashboardCard
          title="Total Logged Out users (in 30 days)"
          content="892"
        />
        <DashboardCard
          title="Total Product Views (in 30 days)"
          content={totalProductViews}
        />
        <DashboardCard
          title="Products Added to cart (in 24 hours)"
          content="1782"
        />

        <DashboardCard
          title="Estimated Cart Revenue"
          content={cartRevenue}
        />
      </div>
<NewUsersLineChart rows={newUsersByDay ?? []} />
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddBars points={points} />
        <CategoryHistogram rows={topCategories} />

        <ProductsPerCollectionPie rows={productsPerCollection} topN={8} />

<RankedBarChart
  labels={topProductLabels}
  values={topProductValues}
  title="Top viewed products"
  subtitle="Top 10 by views"
  topN={10}
  valueLabel="Views"
  decimals={0}
/>

<RankedBarChart
  labels={avgPriceLabels}
  values={avgPriceValues}
  title="Average price by subcategory"
  subtitle="Top 10 by average price"
  topN={10}
  valueLabel="Avg Price"
  valuePrefix="₹"
  decimals={2}
/>
      </div>
    </main>
  );
}
