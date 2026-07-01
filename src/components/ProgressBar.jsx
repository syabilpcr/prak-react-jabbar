export default function ProgressBar({
  label,
  value = 0,
  max = 100,
  showPercent = true,
  color = "#8C1007",
}) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-[12px] text-[#1D1616] font-medium">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-[11px] font-bold text-[#1D1616] ml-auto">
              {pct}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
