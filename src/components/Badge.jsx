const typeStyles = {
  primary:   "bg-[#8C1007]/10 text-[#8C1007] border border-[#8C1007]/20",
  secondary: "bg-gray-100 text-gray-600 border border-gray-200",
  success:   "bg-green-50 text-green-700 border border-green-200",
  danger:    "bg-red-50 text-red-700 border border-red-200",
  warning:   "bg-amber-50 text-amber-700 border border-amber-200",
  gold:      "bg-amber-50 text-amber-700 border border-amber-200",
  silver:    "bg-slate-100 text-slate-600 border border-slate-200",
  bronze:    "bg-orange-50 text-orange-700 border border-orange-200",
  info:      "bg-blue-50 text-blue-700 border border-blue-200",
};

const dotColors = {
  primary:   "bg-[#8C1007]",
  secondary: "bg-gray-400",
  success:   "bg-green-400",
  danger:    "bg-red-400",
  warning:   "bg-amber-400",
  gold:      "bg-amber-400",
  silver:    "bg-slate-400",
  bronze:    "bg-orange-400",
  info:      "bg-blue-400",
};

export default function Badge({ children, type = "primary", dot = false }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
        text-[11px] font-semibold
        ${typeStyles[type] || typeStyles.primary}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[type] || dotColors.primary}`} />
      )}
      {children}
    </span>
  );
}