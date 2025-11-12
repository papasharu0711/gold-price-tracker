interface Statistics {
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

interface Props {
  stats: Statistics;
}

export default function TrendIndicator({ stats }: Props) {
  const { trend, signal } = stats;

  const signalColor = signal.message.includes('매수')
    ? 'bg-green-100 border-green-300 text-green-800'
    : signal.message.includes('매도')
    ? 'bg-red-100 border-red-300 text-red-800'
    : signal.message.includes('주의')
    ? 'bg-orange-100 border-orange-300 text-orange-800'
    : 'bg-gray-100 border-gray-300 text-gray-800';

  return (
    <div className="space-y-4">
      {/* Trend */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">현재 추세</span>
          <span className="text-3xl">{trend.icon}</span>
        </div>
        <p className="text-xl font-bold text-gray-900">{trend.direction}</p>
        <p className="text-sm text-gray-600 mt-1">
          일일 변화: {trend.slope > 0 ? '+' : ''}{trend.slope.toFixed(0)}원
        </p>
      </div>

      {/* 30-day Prediction */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">30일 후 예상</span>
          <span className="text-2xl">🔮</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {trend.prediction30d.toLocaleString()}원
        </p>
        <p className={`text-sm mt-1 font-medium ${
          trend.change30d > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.change30d > 0 ? '▲' : '▼'} {Math.abs(trend.change30d).toFixed(2)}%
        </p>
      </div>

      {/* Signal */}
      <div className={`p-4 rounded-lg border-2 ${signalColor}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">투자 신호</span>
          <span className="text-3xl">{signal.icon}</span>
        </div>
        <p className="text-xl font-bold">{signal.message}</p>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{ width: `${signal.position}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            현재 가격 위치: 최저가 대비 {signal.position.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
