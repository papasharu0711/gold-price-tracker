'use client';

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

export default function PriceChart({ data }: Props) {
  // 최근 60개 데이터만 표시 (너무 많으면 차트가 복잡함)
  const chartData = data.slice(0, 60).reverse();

  return (
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
  );
}
