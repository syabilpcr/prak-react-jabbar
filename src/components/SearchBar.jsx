import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={13}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e7a6e]"
      />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-8 pr-4 py-2 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl text-xs text-[#5a3030] placeholder-[#c0a89e] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 w-full transition-all"
      />
    </div>
  );
}
