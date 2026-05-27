export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full border bg-[#f8f3ee] rounded-xl px-4 py-2.5 text-sm
          focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 transition-all
          text-[#1D1616] disabled:opacity-60 disabled:cursor-not-allowed
          ${error ? "border-red-400 bg-red-50" : "border-[#e8dfd6]"}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-[11px] text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
