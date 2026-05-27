import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const notifications = [
    { id: 1, title: "Member baru terdaftar", time: "2 menit lalu", unread: true },
    { id: 2, title: "Pembayaran diterima dari Maya", time: "15 menit lalu", unread: true },
    { id: 3, title: "5 member akan expired minggu ini", time: "1 jam lalu", unread: true },
    { id: 4, title: "Feedback baru ⭐5 dari Sari", time: "3 jam lalu", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Beranda";
    if (path.includes("members")) return "Anggota";
    if (path.includes("payments")) return "Pembayaran";
    if (path.includes("attendance")) return "Absensi";
    if (path.includes("reports")) return "Laporan";
    if (path.includes("promotions")) return "Promosi";
    if (path.includes("feedback")) return "Umpan Balik";
    if (path.includes("profile")) return "Profil";
    if (path.includes("components")) return "Components";
    return "Zeus Gym";
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/members?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Page title */}
      <div>
        <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-8">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Cari..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#8C1007] transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">Notifikasi</p>
                {unreadCount > 0 && (
                  <span className="text-xs text-gray-500">{unreadCount} baru</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? "bg-blue-50/30" : ""}`}
                  >
                    <p className={`text-sm ${notif.unread ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="w-full text-center text-xs text-[#8C1007] font-medium hover:underline py-1">
                  Lihat semua
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#8C1007] flex items-center justify-center text-white text-xs font-semibold">
              SY
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800 leading-none">Syabil</p>
              <p className="text-xs text-gray-500 mt-0.5">Admin</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Syabil Admin</p>
                <p className="text-xs text-gray-500 mt-0.5">syabil@zeusgym.com</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { navigate("/profile"); setShowProfile(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={14} /> Profil
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings size={14} /> Pengaturan
                </button>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={() => { navigate("/login"); setShowProfile(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} /> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
