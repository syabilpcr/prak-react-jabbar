import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  MessageSquare,
  ChevronDown,
  X,
  Clock,
  Calendar,
  Sparkles,
} from "lucide-react";

const Header = ({ onSearch }) => {
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      alert(`Mencari untuk: "${searchQuery}"`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <div className="h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm transition-all duration-300">
      {/* ── SISI KIRI: WAKTU & STATS RINGKAS ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/60 rounded-xl px-3.5 py-1.5 shadow-inner">
          <Calendar size={14} className="text-[#8C1007]" />
          <span className="text-xs font-bold text-gray-700 tracking-wide">
            {time.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <div className="w-[1px] h-3 bg-gray-300 mx-1" />
          <Clock size={13} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-500 font-mono">
            {time.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* ── SISI KANAN: PENCARIAN & KONTROL KOMPLEKS ─────────────────────────── */}
      <div className="flex items-center gap-6">
        {/* Kolom Pencarian Premium (Card Style) */}
        <div className="flex items-center gap-2.5 bg-[#FDFBF9] border border-[#EBE3DB] rounded-xl px-3.5 py-1.5 w-80 shadow-sm focus-within:border-[#8C1007] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8C1007]/5 focus-within:shadow-md transition-all duration-300 group">
          <Search
            size={14}
            className="text-[#A38479] group-focus-within:text-[#8C1007] transition-colors shrink-0"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Cari anggota, laporan, atau transaksi..."
            className="bg-transparent text-xs font-medium text-gray-800 placeholder-[#CBB3A9] focus:outline-none w-full"
          />

          {searchQuery ? (
            <button
              onClick={clearSearch}
              className="text-[#A38479] hover:text-[#8C1007] p-0.5 rounded-full hover:bg-gray-100 transition-all"
            >
              <X size={12} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block bg-white border border-[#EBE3DB] text-[9px] px-1.5 py-0.5 rounded-md text-gray-400 font-sans shadow-sm select-none">
              Ctrl+K
            </kbd>
          )}
        </div>

        {/* Pembatas Vertikal */}
        <div className="h-6 w-[1px] bg-gray-200 hidden md:block" />

        {/* Menu Aksi/Ikon Pintas */}
        <div className="flex items-center gap-2.5">
          {/* Tombol Pesan */}
          <button className="w-9 h-9 rounded-xl bg-[#FDFBF9] border border-[#EBE3DB] flex items-center justify-center text-[#7A3A3A] hover:text-[#8C1007] hover:bg-[#8C1007]/5 hover:border-[#8C1007]/20 shadow-sm transition-all duration-200 relative group">
            <MessageSquare
              size={15}
              className="group-hover:scale-105 transition-transform"
            />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#8C1007] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Tombol Notifikasi Ber-badge Kompleks */}
          <button className="relative w-9 h-9 rounded-xl bg-[#FDFBF9] border border-[#EBE3DB] flex items-center justify-center text-[#7A3A3A] hover:text-[#8C1007] hover:bg-[#8C1007]/5 hover:border-[#8C1007]/20 shadow-sm transition-all duration-200 group">
            <Bell
              size={15}
              className="group-hover:scale-105 transition-transform"
            />
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#8C1007] text-[#FFF0C4] text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm shadow-[#8C1007]/20">
              13
            </span>
          </button>
        </div>

        {/* Pembatas Vertikal */}
        <div className="h-6 w-[1px] bg-gray-200" />

        {/* Card Profil Admin Premium */}
        <div className="flex items-center gap-3 bg-[#FDFBF9]/40 hover:bg-[#FDFBF9] p-1.5 pr-3.5 rounded-xl border border-[#EBE3DB]/60 hover:border-[#EBE3DB] cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300">
          {/* Avatar Container dengan Status Online Indicator */}
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8C1007] to-[#B3190F] flex items-center justify-center text-[#FFF0C4] text-xs font-black shadow-md shadow-[#8C1007]/20 transform group-hover:scale-102 transition-transform">
              SY
            </div>
            {/* Status Online Badge */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm shadow-emerald-500/50" />
          </div>

          {/* Label Informasi Pengguna */}
          <div className="hidden md:block select-none">
            <div className="flex items-center gap-1">
              <p className="text-xs font-extrabold text-gray-800 tracking-tight leading-none group-hover:text-[#8C1007] transition-colors">
                Syabil Admin
              </p>
             
            </div>
            <p className="text-[9px] text-[#A38479] font-bold uppercase tracking-wider mt-0.5">
              Super Administrator
            </p>
          </div>

          <ChevronDown
            size={13}
            className="text-[#A38479] group-hover:text-[#8C1007] transition-colors duration-200 ml-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
