import pool from '@/db/index';
import { unstable_cache } from "../unstable-cache";
import { explainErrorLogs } from '@/model/model';

export const fetchApiLatencyTime = unstable_cache(async() => {
  try{
    const res = await pool.query(`
      SELECT AVG(api_latency_ms) AS avg_api_latency_ms
      FROM (
        SELECT api_latency_ms FROM product_view_events WHERE api_latency_ms IS NOT NULL
        UNION ALL
        SELECT api_latency_ms FROM cart_metrics       WHERE api_latency_ms IS NOT NULL
      ) t
    `);
    
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

export const fetchErrorRate = unstable_cache(async() => {
  try{
    const total = await pool.query(`SELECT COUNT(*)::int AS total_logs FROM request_logs`);

    const error_count = await pool.query(`SELECT COUNT(*)::int AS error_rate FROM request_logs WHERE ok = 'f'`);
 
    const error_rate = (error_count.rows[0].error_rate / total.rows[0].total_logs) * 100;

    return error_rate;
  }
  catch(err: any){
    console.log(err.message);
  }
}, 
  ["fetchErrorRate"],
  { revalidate: 60 }
);

export const fetchErrorLogs = unstable_cache(async() => {
  try{
    const res = await pool.query(`SELECT route, status FROM request_logs WHERE ok = 'f'`);

    return res.rows;
  }
  catch(err: any){
    console.log(err.message);
  }
},
  ["fetchErrorLogs"],
  { revalidate: 60 }
)

export const analyzeError = unstable_cache(async() => {
  try{
    const res = await pool.query(`SELECT route, status FROM request_logs WHERE ok = 'f'`);

    const errorLogs = res.rows;

		const serializedLogs = errorLogs
			.map((log) => `status: ${log.status}, route: ${log.route}`)
			.join("\n");

		const explained_error = await explainErrorLogs(serializedLogs);

		return explained_error;
	}
  catch(err: any){
    console.log(err.message);
  }
},
  ["analyzeError"],
  { revalidate: 60 }
);

export const fetchTraffic = unstable_cache(async() => {
  try{
    const res = await pool.query('SELECT route, COUNT(*) AS requests FROM request_logs GROUP BY route ORDER BY requests DESC');

    return res.rows;
  }
  catch(err: any){
    console.log(err.message);
  }
}, 
  ["fetchTraffic"],
  { revalidate: 60 },
)
