import GoldPriceDashboard from '@/components/GoldPriceDashboard';

export const revalidate = 3600; // 1시간마다 재생성

export default function Home() {
  return <GoldPriceDashboard />;
}
