
const typeStyles = {
  primary:   "bg-[#8C1007] hover:bg-[#a01a0a] text-white shadow-md shadow-[#8C1007]/30",
  secondary: "bg-white hover:bg-[#f8f3ee] text-[#5a3030] border border-[#e8dfd6]",
  danger:    "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30",
  success:   "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20",
  warning:   "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20",
  ghost:     "bg-transparent hover:bg-[#f8f3ee] text-[#8C1007] border border-[#8C1007]/30",
};

const sizeStyles = {
  sm:  "px-3 py-1.5 text-xs rounded-lg",
  md:  "px-4 py-2.5 text-sm rounded-xl",
  lg:  "px-6 py-3 text-base rounded-xl",
};

export default function Button({
  children,
  type = "primary",
  size = "md",
  onClick,
  disabled = false,
  icon: Icon,
  fullWidth = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${typeStyles[type] || typeStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {Icon && <Icon size={size === "sm" ? 13 : size === "lg" ? 18 : 15} />}
      {children}
    </button>
  );
}