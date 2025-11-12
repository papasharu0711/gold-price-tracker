'use client';

import { useEffect, useState } from 'react';
import PriceChart from './PriceChart';
import StatisticsCard from './StatisticsCard';
import TrendIndicator from './TrendIndicator';

interface GoldPrice {
  date: string;
  buyPure: number;
  sellPure: number;
  sell18K: number;
  sell14K: number;
}

interface Statistics {
  lastUpdated: string;
  dataCount: number;
  currentPrice: {
    buyPure: number;
    sellPure: number;
    sell18K: number;
    sell14K: number;
  };
  statistics: {
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
    medianPrice: number;
    volatility: number;
    ma7: number;
    ma30: number;
  };
  trend: {
    direction: string;
    icon: string;
    slope: number;
    prediction30d: number;
    change30d: number;
  };
  signal: {
    message: string;
    icon: string;
    position: number;
  };
}

export default function GoldPriceDashboard() {
  const [prices, setPrices] = useState<GoldPrice[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pricesRes, statsRes] = await Promise.all([
          fetch('/data/gold-prices.json'),
          fetch('/data/statistics.json')
        ]);
        
        const pricesData = await pricesRes.json();
        const statsData = await statsRes.json();
        
        setPrices(pricesData);
        setStats(statsData);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-800 font-medium">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  const lastUpdate = stats?.lastUpdated 
    ? new Date(stats.lastUpdated).toLocaleString('ko-KR') 
    : '알 수 없음';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-2">
                <span className="text-4xl">💰</span>
                금 시세 추적기
              </h1>
              <p className="text-sm text-amber-700 mt-1">
                한국금거래소 실시간 금 시세 및 통계 분석
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-600">마지막 업데이트</p>
              <p className="text-sm font-medium text-amber-900">{lastUpdate}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <>
            {/* Current Price & Signal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Current Prices */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
                <h2 className="text-xl font-bold text-amber-900 mb-4">현재 시세</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-700 font-medium">매수가 (순금)</span>
                    <span className="text-2xl font-bold text-red-600">
                      {stats.currentPrice.buyPure.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-medium">매도가 (순금)</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.currentPrice.sellPure.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-gray-600">매도가 (18K)</span>
                    <span className="text-lg font-semibold text-amber-700">
                      {stats.currentPrice.sell18K.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-gray-600">매도가 (14K)</span>
                    <span className="text-lg font-semibold text-amber-700">
                      {stats.currentPrice.sell14K.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              {/* Trend & Signal */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
                <h2 className="text-xl font-bold text-amber-900 mb-4">추세 분석</h2>
                <TrendIndicator stats={stats} />
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatisticsCard
                title="최저가"
                value={stats.statistics.minPrice}
                icon="📉"
                color="green"
              />
              <StatisticsCard
                title="평균가"
                value={stats.statistics.avgPrice}
                icon="📊"
                color="blue"
              />
              <StatisticsCard
                title="최고가"
                value={stats.statistics.maxPrice}
                icon="📈"
                color="red"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 border border-amber-200">
                <p className="text-sm text-gray-600 mb-1">변동성</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.statistics.volatility}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-amber-200">
                <p className="text-sm text-gray-600 mb-1">7일 평균</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {stats.statistics.ma7.toLocaleString()}원
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-amber-200">
                <p className="text-sm text-gray-600 mb-1">30일 평균</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.statistics.ma30.toLocaleString()}원
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-amber-200">
                <p className="text-sm text-gray-600 mb-1">데이터 수</p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.dataCount}개
                </p>
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
              <h2 className="text-xl font-bold text-amber-900 mb-4">가격 추이</h2>
              <PriceChart data={prices} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-amber-700">
            데이터 출처: 한국금거래소 | 매일 오전 7시 자동 업데이트
          </p>
        </div>
      </footer>
    </div>
  );
}
