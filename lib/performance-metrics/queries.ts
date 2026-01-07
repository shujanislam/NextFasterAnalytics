import pool from '@/db/index';
import { unstable_cache } from "../unstable-cache";

export const fetchApiLatencyTime = unstable_cache(async() => {
  try{
    const res = await pool.query(`SELECT AVG(api_latency_ms) AS avg_api_latency_ms FROM product_view_events WHERE api_latency_ms IS NOT NULL`);
    
    const api_latency_ms = res.rows[0].avg_api_latency_ms;

    return api_latency_ms ?? 0;
  }
  catch(err: any){
    console.log(err.message);
  }
},
  ["fetchApiLatencyTime"],
  { revalidate: 60 }
);
