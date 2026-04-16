import { useEffect, useState } from "react";

const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

const StatCard = ({ icon, label, value, color, prefix = "", suffix = "" }) => {
  const animated = useCountUp(value);

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          Bulan ini
        </span>
      </div>
      <div className="text-3xl font-bold text-gray-800">
        {prefix}
        {animated.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
};

const StatsWidget = () => {
  const stats = [
    {
      icon: "👥",
      label: "Total Pengguna",
      value: 12480,
      color: "border-blue-500",
    },
    {
      icon: "📦",
      label: "Total Produk",
      value: 348,
      color: "border-purple-500",
    },
    {
      icon: "💰",
      label: "Pendapatan",
      value: 98500000,
      color: "border-green-500",
      prefix: "Rp ",
    },
    {
      icon: "📈",
      label: "Tingkat Konversi",
      value: 74,
      color: "border-orange-500",
      suffix: "%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
};

export default StatsWidget;