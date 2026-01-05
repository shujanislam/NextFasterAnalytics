import pool from '@/db/index';
import { unstable_cache } from "./unstable-cache";

export const fetchTotalUsers = unstable_cache(async() => {
  try{
    const rows = await pool.query(`SELECT COUNT(*) FROM users`);

    const count = rows.rows[0].count;

    return count || 0;
  }
  catch(err: any){
    console.log(err.message);
  }
},
  ["fetchTotalUsers"],
  { revalidate: 60 * 60 }
);

export const fetchTotalActiveUsers = unstable_cache(async () => {
  try {
    const res = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM users_metrics
      WHERE last_login_at >= NOW() - INTERVAL '24 hours';
    `);

    return res.rows[0]?.total ?? 0;
  } catch (err: any) {
    console.log(err?.message ?? err);
    return 0;
  }
},
  ["fetchTotalActiveUsers"],
  { revalidate: 60 * 60 }
);

export const fetchTotalLoggedOutUsers = unstable_cache(async () => {
  try {
    const res = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM users_metrics
      WHERE last_logout_at >= NOW() - INTERVAL '30 days';
    `);

    return res.rows[0]?.total ?? 0;
  } catch (err: any) {
    console.log(err?.message ?? err);
    return 0;
  }
},
  ["fetchTotalLoggedOutUsers"],
  { revalidate: 60 * 60}
);

export const fetchNewUsersMetrics = unstable_cache(async() => {
  try{
    const res = await pool.query(`
      SELECT created_at::date AS day, COUNT(*) 
      FROM users
      GROUP BY 1
      ORDER BY 1 DESC
    `);

    return res.rows;
  }
  catch(err: any){
    console.log(err.message);
    return [];
  }
},
  ["fetchNewUsersMetrics"],
  { revalidate: 60 * 60 }
);

export const fetchTotalProductsAddedToday = unstable_cache(async() =>{
  try{
    const res = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM cart_metrics
      WHERE added_at >= NOW() - INTERVAL '24 hours';
    `);

    return res.rows[0]?.total ?? 0;
  }
  catch(err: any){
    console.log(err.message);
    return 0;
  }
},
  ["fetchTotalProductsAddedToday"],
  { revalidate: 60 * 60 }
);

export const fetchTopProductsFromCart = unstable_cache(async() => {
  try{
    const res = await pool.query(`
      SELECT product, COUNT(*) as adds
      FROM cart_metrics
      WHERE added_at >= NOW() - INTERVAL '7 days'
      GROUP BY product
      GROUP BY adds DESC
      LIMIT 10;
    `);

    console.log(res);
    return res;
  }
  catch(err: any){
    console.log(err.message);
  }
},
  ["fetchTopProductsFromCart"],
  { revalidate: 60 * 60 }
);

export const fetchTopCategoriesFromCart = unstable_cache(async () => {
  try {
    const res = await pool.query(`
      SELECT category, COUNT(*)::int AS adds
      FROM cart_metrics
      WHERE added_at >= NOW() - INTERVAL '7 days'
      GROUP BY category
      ORDER BY adds DESC
      LIMIT 10;
    `);

    return res.rows as { category: string; adds: number }[];
  } catch (err: any) {
    console.log(err?.message ?? err);
    return [];
  }
},
  ["fetchTopCategoriesFromCart"],
  { revalidate: 60 * 60 }
);

export const fetchAddsOverLast24Hours = unstable_cache(async () => {
  try {
    const res = await pool.query(`
      SELECT
        hrs.hour AS hour,
        COALESCE(COUNT(cm.*), 0)::int AS adds
      FROM (
        SELECT generate_series(
          date_trunc('hour', now()) - interval '23 hours',
          date_trunc('hour', now()),
          interval '1 hour'
        ) AS hour
      ) hrs
      LEFT JOIN cart_metrics cm
        ON cm.added_at >= hrs.hour
       AND cm.added_at <  hrs.hour + interval '1 hour'
      GROUP BY 1
      ORDER BY 1;
    `);

    return res.rows.map((r: any) => ({
      hour: r.hour,   // Date
      adds: r.adds,   // number
    }));
  } catch (err: any) {
    console.log(err?.message ?? err);
    return [];
  }
},
  ["fetchAddsOverLast24Hours"],
  { revalidate: 60 * 60 }
);

export const fetchTotalProductViews = unstable_cache(async() => {
  try{
    const res = await pool.query(`SELECT COUNT(*)::int FROM product_view_events `);

    return res.rows[0].count;
  }
  catch(err: any){
    console.log(err.message);
    return [];
  }
},
  ["fetchTotalProductViews"],
  { revalidate: 60 * 60 }
);

export const fetchTopProductViews= unstable_cache(async() => {
  try{
    const res = await pool.query(`SELECT product_slug, product_name, COUNT(*)::int AS views FROM product_view_events GROUP BY product_slug, product_name ORDER BY views DESC LIMIT 5 `);
    
    return res.rows;
  }
  catch(err: any){
    console.log(err.message);
    return [];
  }
},
  ["fetchTopProductViews"],
  { revalidate: 60 * 60 * 24 }
);

// export const fetchAverageCategoryProductPrice = unstable_cache(
//   async (offset: number) => {
//     const res = await pool.query(
//       `
//       SELECT
//         subcategory_slug,
//         COUNT(*)::int AS n,
//         (SUM(price) / COUNT(*)::numeric) AS avg_price
//       FROM products
//       GROUP BY subcategory_slug
//       ORDER BY subcategory_slug
//       LIMIT 10
//       OFFSET $1
//       `,
//       [offset]
//     );
//
//     return res.rows;
//   },
//   // ✅ key builder MUST include offset
//   (offset: number) => ["avg-category-product-price", String(offset)],
//   { revalidate: 60 * 10 }
// );
//

export const fetchAverageCategoryProductPrice = async() => {
  try{
    const res = await pool.query(`SELECT subcategory_slug, COUNT(*)::int as n, (SUM(price) / COUNT(*)::numeric) as avg_price FROM products GROUP BY subcategory_slug ORDER BY subcategory_slug`);

    return res.rows;
  }
  catch(err: any){
    console.log(err.message);

    return [];
  }
};

export const fetchProductsPerCollection = unstable_cache(async() => {
  try{
    const res = await pool.query(`
      SELECT
        col.name AS collection_name,
        COUNT(p.*)::int AS product_count
      FROM products p
      JOIN subcategories s
        ON s.slug = p.subcategory_slug
      JOIN subcollections subc
        ON subc.id = s.subcollection_id
      JOIN categories c
        ON c.slug = subc.category_slug
      JOIN collections col
        ON col.id = c.collection_id
      GROUP BY col.name
      ORDER BY product_count DESC;
    `);

    return res.rows as { collection_name: string, product_count: number }[];
  }
  catch(err: any){
    console.log(err.message);
    return [];
  }
},
  ["fetchProductsPerCollection"],
  { revalidate: 60 * 60 * 24 }
);

export const estimatedCartRevenue = unstable_cache(async() => {
  try{
    const res = await pool.query(`
      SELECT 
        SUM(products.price)::numeric as estimated_cart_revenue
      FROM cart_metrics 
      JOIN products
        ON products.name = cart_metrics.product
        AND products.subcategory_slug = cart_metrics.category
    `);

    return res.rows[0].estimated_cart_revenue;
  }
  catch(err: any){
    console.log(err.message);

    return [];
  }
},
  ["estimatedCartRevenue"],
  { revalidate: 60 * 60 }
);
