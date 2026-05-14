import { useState, useEffect } from "react";
import { Bell, Search, MessageSquare, ChevronDown } from "lucide-react";

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-10">
      <span className="text-[15px] font-bold text-[#1D1616] flex-1">
        {time.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </span>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl px-3 py-2 w-52">
        <Search size={13} className="text-[#9e7a6e]" />
        <span className="text-xs text-[#c0a89e]">Cari anggota, laporan...</span>
      </div>

      {/* Icons */}
      <button className="w-9 h-9 rounded-xl bg-[#f8f3ee] border border-[#e8dfd6] flex items-center justify-center">
        <MessageSquare size={15} className="text-[#7a3a3a]" />
      </button>
      <button className="relative w-9 h-9 rounded-xl bg-[#f8f3ee] border border-[#e8dfd6] flex items-center justify-center">
        <Bell size={15} className="text-[#7a3a3a]" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8C1007] text-[#FFF0C4] text-[8px] font-bold rounded-full flex items-center justify-center">
          13
        </span>
      </button>

      {/* Admin */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#8C1007] flex items-center justify-center text-[#FFF0C4] text-xs font-bold">
          SY
        </div>
        <div>
          <p className="text-[12px] font-bold text-[#1D1616] leading-tight">Syabil Admin</p>
          <p className="text-[10px] text-[#9e7a6e]">Admin</p>
        </div>
        <ChevronDown size={13} className="text-[#9e7a6e]" />
      </div>
    </div>
  );
};

export default Header;