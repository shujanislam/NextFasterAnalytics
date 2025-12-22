import pool from '@/db/index.ts';

export const fetchTotalUsers = async() => {
  try{
    const rows = await pool.query(`SELECT COUNT(id) FROM users_metrics`);
   
    const count = rows.rows[0].count;

    return count || 0;
  }
  catch(err){
    console.log(err.message);
  }
}

export const fetchTotalActiveUsers = async () => {
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
};

export const fetchTotalLoggedOutUsers = async () => {
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
};

export const fetchTotalProductsAddedToday = async() =>{
  try{
    const res = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM cart_metrics
      WHERE added_at >= NOW() - INTERVAL '24 hours';
    `);

    return res.rows[0]?.total ?? 0;
  }
  catch(err){
    console.log(err.message);
  }
}

export const fetchTopProductsFromCart = async() => {
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
  }
  catch(err){
    console.log(err.message);
  }
}

export const fetchTopCategoriesFromCart = async () => {
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
};

export const fetchAddsOverLast24Hours = async () => {
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
};

export const fetchTopProductViews= async() => {
  try{
    const res = await pool.query(`SELECT product_slug, product_name, COUNT(*)::int AS views FROM product_view_events GROUP BY product_slug, product_name ORDER BY views DESC LIMIT 5 `);
    
    return res.rows;
  }
  catch(err){
    console.log(err.message);
  }
}
