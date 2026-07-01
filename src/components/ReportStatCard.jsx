const ReportStatCard = ({
  title,
  value,
  change,
  isPositive,
  prefix = "",
  suffix = "",
}) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
    <p className="text-xs text-gray-400">{title}</p>
    <p className="text-2xl font-bold text-[#1D1616] mt-1">
      {prefix}
      {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      {suffix}
    </p>
    <div className="flex items-center gap-1 mt-2">
      <span
        className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? "↑" : "↓"} {Math.abs(change)}%
      </span>
      <span className="text-xs text-gray-400">dari periode sebelumnya</span>
    </div>
  </div>
);

export default ReportStatCard;
