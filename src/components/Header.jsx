import { useState } from "react";
import { Search, Bell, X, Command, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ title, subtitle }) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white px-8 py-3.5 flex items-center justify-between sticky top-0 z-10 border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-[#1D1616] leading-tight">
            {title || "Beranda"}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-gray-500 leading-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari anggota, pembayaran..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-14 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] w-52 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-0.5 text-gray-400">
            {searchValue ? (
              <button
                onClick={() => setSearchValue("")}
                className="hover:text-gray-600 transition-colors"
              >
                <X size={12} />
              </button>
            ) : (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-500">
                <Command size={9} />K
              </span>
            )}
          </div>
        </div>

        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors">
          <Bell size={16} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#D84040] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        <div className="w-px h-7 bg-gray-200" />

        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-xs font-bold text-[#1D1616] leading-tight">
              ADMIN ZEUS
            </p>
            <p className="text-[10px] text-gray-500 leading-tight">
              Super Admin
            </p>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8E1616] to-[#D84040] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#8E1616]/30">
              Z
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors ml-2"
          >
            <LogOut size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
