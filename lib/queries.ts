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

    console.log(res.rows[0]?.total);
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

    console.log(res.rows[0]?.total);
    return res.rows[0]?.total ?? 0;
  } catch (err: any) {
    console.log(err?.message ?? err);
    return 0;
  }
};
