import BusinessMetrics from '@/components/business/business';
import Performance from '@/components/performance/performance';

export default async function Home() {
  return (
    <main className="p-6 space-y-6">
      <Performance />
      <BusinessMetrics />
    </main>
  );
}
