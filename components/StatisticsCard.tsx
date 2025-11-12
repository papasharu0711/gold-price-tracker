interface Props {
  title: string;
  value: number;
  icon: string;
  color: 'red' | 'green' | 'blue';
}

export default function StatisticsCard({ title, value, icon, color }: Props) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">
        {value.toLocaleString()}원
      </p>
    </div>
  );
}
