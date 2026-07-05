import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  Clock,
  Calendar,
  CheckCircle,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Dynamic user state
  const [currentUser, setCurrentUser] = useState({
    name: "Syabil",
    email: "admin@zeusgym.com",
    role: "Admin",
  });

  // Dynamic notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Member baru terdaftar", time: "2 mnt lalu", unread: true },
    { id: 2, title: "Pembayaran Rp300.000 diterima", time: "15 mnt lalu", unread: true },
    { id: 3, title: "Sesi absensi aktif hari ini: 12 member", time: "1 jam lalu", unread: true },
    { id: 4, title: "Promo hemat SAVE10 digunakan", time: "3 jam lalu", unread: false },
  ]);

  // Live date & time
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      );
      setDateString(
        now.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);

    // Get current logged in user
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) {
          setCurrentUser({
            name: parsed.name,
            email: parsed.email || `${parsed.name.toLowerCase()}@zeusgym.com`,
            role: parsed.role || "Admin",
          });
        }
      } catch (err) {
        console.error("Gagal memuat user login di header:", err);
      }
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Beranda";
    if (path.includes("members")) return "Anggota";
    if (path.includes("payments")) return "Pembayaran";
    if (path.includes("attendance")) return "Absensi";
    if (path.includes("reports")) return "Laporan";
    if (path.includes("promotions")) return "Promosi";
    if (path.includes("feedback")) return "Umpan Balik";
    if (path.includes("components")) return "Components";
    return "Zeus Gym";
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/members?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "SY";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      
      {/* Dynamic Title */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-6 bg-[#8C1007] rounded-full" />
        <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">
          {getPageTitle()}
        </h2>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-xs md:max-w-sm mx-6 hidden sm:block">
        <div className="relative group">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8C1007] transition-colors"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Cari anggota atau ketik kata kunci..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-100 hover:border-gray-200 focus:border-[#8C1007]/30 focus:bg-white rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8C1007]/5 transition-all"
          />
        </div>
      </div>

      {/* Actions Segment */}
      <div className="flex items-center gap-4">
        
        {/* Live Date & Time Widget */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-gray-400/80 border-r border-gray-100 pr-4 h-6">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#8C1007]/60" />
            {dateString}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#8C1007]/60" />
            {timeString}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 bg-gray-55/40 border border-gray-100/10 hover:bg-gray-50 hover:text-[#8C1007] transition-all cursor-pointer"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#8C1007] rounded-full animate-ping" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  Notifikasi Baru
                </p>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-bold text-[#8C1007] hover:underline"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 transition-colors ${
                        notif.unread ? "bg-[#8C1007]/3" : ""
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          notif.unread ? "bg-[#8C1007]" : "bg-gray-200"
                        }`}
                      />
                      <div className="flex-1">
                        <p className={`text-xs ${notif.unread ? "font-bold text-gray-800" : "text-gray-500"}`}>
                          {notif.title}
                        </p>
                        <span className="text-[9px] text-gray-400 block mt-0.5">{notif.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-gray-400">
                    Tidak ada notifikasi baru
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 hover:bg-gray-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-100"
          >
            <div className="w-8 h-8 rounded-lg bg-[#8C1007] flex items-center justify-center text-white text-xs font-black shadow-md shadow-[#8C1007]/20">
              {getInitials(currentUser.name)}
            </div>
            <div className="hidden md:block text-left pr-1">
              <p className="text-xs font-bold text-gray-800 leading-none">
                {currentUser.name}
              </p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown size={12} className="text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50 animate-scale-in">
              <div className="px-4 py-3.5 border-b border-gray-50 bg-gray-50/50">
                <p className="text-xs font-bold text-gray-800">{currentUser.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate font-mono">{currentUser.email}</p>
              </div>
              <div className="py-1.5">
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings size={13} className="text-gray-400" /> Pengaturan Sistem
                </button>
              </div>
              <div className="border-t border-gray-100 py-1.5">
                <button
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                    navigate("/login");
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-bold"
                >
                  <LogOut size={13} /> Keluar Akun
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
