'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PriceData {
  date: string;
  buyPure: number;
  sellPure: number;
  sell18K: number;
  sell14K: number;
}

interface Props {
  data: PriceData[];
}

type Period = '1M' | '3M' | '6M' | '1Y' | '3Y' | 'ALL';

export default function PriceChart({ data }: Props) {
  const [period, setPeriod] = useState<Period>('3M');

  // 기간별 데이터 개수 계산
  const getPeriodData = () => {
    const periodMap: Record<Period, number> = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '3Y': 1095,
      'ALL': data.length
    };
    
    return data.slice(0, periodMap[period]).reverse();
  };

  const chartData = getPeriodData();

  const periods: { label: string; value: Period }[] = [
    { label: '1개월', value: '1M' },
    { label: '3개월', value: '3M' },
    { label: '6개월', value: '6M' },
    { label: '1년', value: '1Y' },
    { label: '3년', value: '3Y' },
    { label: '전체', value: 'ALL' }
  ];

  return (
    <div className="space-y-4">
      {/* 기간 선택 버튼 */}
      <div className="flex gap-2 flex-wrap">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              period === p.value
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          interval={Math.floor(chartData.length / 10)}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()}원`, '']}
          labelStyle={{ color: '#000' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="sellPure"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="매도가 (순금)"
        />
        <Line
          type="monotone"
          dataKey="buyPure"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="매수가 (순금)"
        />
        <Line
          type="monotone"
          dataKey="sell18K"
          stroke="#f59e0b"
          strokeWidth={1.5}
          dot={false}
          name="매도가 (18K)"
        />
        <Line
          type="monotone"
          dataKey="sell14K"
          stroke="#d97706"
          strokeWidth={1.5}
          dot={false}
          name="매도가 (14K)"
        />
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
}
