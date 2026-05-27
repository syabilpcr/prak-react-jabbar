export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  icon: Icon,
  error,
  disabled = false,
}) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-[#9e7a6e] mb-1.5 uppercase tracking-wide">
          {label}
          {required && <span className="text-[#8C1007] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e7a6e]">
            <Icon size={14} />
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full border bg-[#f8f3ee] rounded-xl py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 transition-all
            text-[#1D1616] placeholder-[#c0a89e]
            disabled:opacity-60 disabled:cursor-not-allowed
            ${Icon ? "pl-9 pr-4" : "px-4"}
            ${error ? "border-red-400 bg-red-50" : "border-[#e8dfd6]"}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-[11px] text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}