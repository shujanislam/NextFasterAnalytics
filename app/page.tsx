import BusinessMetrics from '@/components/business/business';
import Performance from '@/components/performance/performance';
import TabNavigation from '@/components/TabNavigation';

export default async function Home() {
  return (
    <main className="p-6 space-y-6">
      <TabNavigation 
        businessMetrics={<BusinessMetrics />}
        performanceMetrics={<Performance />}
      />
    </main>
  );
}
