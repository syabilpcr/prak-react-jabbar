import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  X,
  Command,
  LogOut,
  AlertTriangle,
  Power,
  Dumbbell,
  CheckCircle,
  AlertCircle,
  Info,
  Gift,
  Calendar,
  UserPlus,
  CreditCard,
  Clock,
  Trash2,
  CheckCheck,
  Eye,
  EyeOff,
  Mail,
  MessageSquare,
  Settings,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Komponen Modal Konfirmasi Logout
const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 border border-gray-200 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut size={20} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-[#1D1616]">
              Konfirmasi Keluar
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
            <p className="text-xs text-yellow-800">
              Anda akan keluar dari dashboard Zeus Gym. Pastikan semua data
              telah tersimpan.
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin keluar dari akun?
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Anda perlu login kembali untuk mengakses dashboard.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Power size={14} /> Keluar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen Notifikasi Item
const NotificationItem = ({ notification, onMarkAsRead, onDelete, onMarkAllAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      case "warning":
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case "info":
        return <Info size={16} className="text-blue-500" />;
      case "promo":
        return <Gift size={16} className="text-purple-500" />;
      case "member":
        return <UserPlus size={16} className="text-[#8E1616]" />;
      case "payment":
        return <CreditCard size={16} className="text-green-500" />;
      case "schedule":
        return <Calendar size={16} className="text-orange-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getBgColor = () => {
    if (!notification.isRead) return "bg-[#8E1616]/5 hover:bg-[#8E1616]/10";
    return "hover:bg-gray-50";
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} detik lalu`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  return (
    <div
      className={`p-3 rounded-xl transition-all cursor-pointer group relative ${getBgColor()} border border-transparent hover:border-gray-200`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
            {getIcon()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-[#1D1616]">
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-[#8E1616] rounded-full flex-shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock size={10} /> {timeAgo(notification.createdAt)}
            </span>
            {notification.action && (
              <span className="text-[10px] text-[#8E1616] font-medium">
                {notification.action}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-lg flex-shrink-0"
        >
          <Trash2 size={12} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

// Komponen Dropdown Notifikasi Utama
const NotificationDropdown = ({ isOpen, onClose, notifications, onMarkAsRead, onDelete, onMarkAllAsRead, onClearAll }) => {
  const dropdownRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  
  const filteredNotifications = notifications
    .filter((n) => filter === "all" || n.type === filter || (filter === "unread" && !n.isRead))
    .filter((n) => 
      searchTerm === "" || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filterOptions = [
    { value: "all", label: "Semua", icon: Bell },
    { value: "unread", label: "Belum Dibaca", icon: EyeOff },
    { value: "success", label: "Sukses", icon: CheckCircle },
    { value: "warning", label: "Peringatan", icon: AlertTriangle },
    { value: "info", label: "Informasi", icon: Info },
    { value: "promo", label: "Promo", icon: Gift },
    { value: "member", label: "Member", icon: UserPlus },
    { value: "payment", label: "Pembayaran", icon: CreditCard },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-down"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-[#1D1616]">Notifikasi</h3>
            <p className="text-xs text-gray-500">
              {unreadCount} notifikasi belum dibaca
            </p>
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Tandai semua sudah dibaca"
              >
                <CheckCheck size={16} className="text-gray-500" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Hapus semua notifikasi"
              >
                <Trash2 size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari notifikasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
          />
        </div>
      </div>

      {/* Filter Tab */}
      <div className="px-3 py-2 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-1">
          {filterOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = filter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap ${
                  isActive
                    ? "bg-[#8E1616] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={12} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
            <p className="text-xs text-gray-400 mt-1">
              Semua notifikasi akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              onClose();
              // Navigasi ke halaman notifikasi lengkap
            }}
            className="w-full text-center text-xs text-[#8E1616] font-semibold hover:underline"
          >
            Lihat Semua Notifikasi
          </button>
        </div>
      )}
    </div>
  );
};

const Header = ({ title, subtitle }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  // Data notifikasi awal
  const initialNotifications = [
    {
      id: 1,
      title: "Pendaftaran Member Baru",
      message: "Alex Johnson baru saja mendaftar sebagai member dengan paket Yearly.",
      type: "member",
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      action: "Lihat Detail",
    },
    {
      id: 2,
      title: "Pembayaran Berhasil",
      message: "Pembayaran dari Sarah Williams sebesar Rp 350.000 telah dikonfirmasi.",
      type: "payment",
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      action: "Lihat Invoice",
    },
    {
      id: 3,
      title: "Promo Spesial Akhir Tahun",
      message: "Diskon 20% untuk semua paket keanggotaan! Berlaku sampai 31 Desember.",
      type: "promo",
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      action: "Lihat Promo",
    },
    {
      id: 4,
      title: "Peringatan Kadaluarsa",
      message: "Keanggotaan Mike Chen akan berakhir dalam 3 hari. Segera perpanjang!",
      type: "warning",
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      action: "Perpanjang Sekarang",
    },
    {
      id: 5,
      title: "Check-in Berhasil",
      message: "Jessica Lee telah melakukan check-in di Area Cardio.",
      type: "success",
      isRead: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      action: "Lihat Aktivitas",
    },
    {
      id: 6,
      title: "Jadwal Kelas Baru",
      message: "Kelas Yoga pagi ditambahkan setiap hari Selasa dan Kamis jam 07:00.",
      type: "schedule",
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      action: "Lihat Jadwal",
    },
    {
      id: 7,
      title: "Umpan Balik Member",
      message: "David Kim memberikan rating 5 bintang untuk fasilitas gym.",
      type: "info",
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      action: "Lihat Ulasan",
    },
  ];

  // Load notifikasi dari localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      setNotifications(initialNotifications);
      localStorage.setItem("notifications", JSON.stringify(initialNotifications));
    }
  }, []);

  // Update jumlah notifikasi
  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    setNotificationCount(unreadCount);
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Simulasi notifikasi real-time
  useEffect(() => {
    const interval = setInterval(() => {
      // Random notifikasi baru setiap 30 detik (untuk demo)
      const random = Math.random();
      if (random > 0.7) {
        const newNotification = {
          id: Date.now(),
          title: "Aktivitas Baru",
          message: `Anggota telah melakukan check-in di gym. (${new Date().toLocaleTimeString()})`,
          type: "info",
          isRead: false,
          createdAt: new Date().toISOString(),
          action: "Lihat Detail",
        };
        setNotifications((prev) => [newNotification, ...prev]);
        
        // Tampilkan notifikasi browser
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Zeus Gym", {
            body: newNotification.message,
            icon: "/favicon.ico",
          });
        }
      }
    }, 30000);

    // Minta izin notifikasi browser
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("Hapus semua notifikasi?")) {
      setNotifications([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    alert("👋 Anda telah keluar dari Zeus Gym Dashboard.\n\nSampai jumpa kembali!");
    navigate("/login");
  };

  return (
    <>
      <header className="bg-white px-8 py-3.5 flex items-center justify-between sticky top-0 z-10 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D84040] rounded-xl flex items-center justify-center shadow-lg shadow-[#D84040]/30">
              <Dumbbell size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                <span className="text-[#1D1616]">ZEUS</span>
                <span className="text-[#D84040]">GYM</span>
              </h1>
              {subtitle && (
                <p className="text-[11px] text-gray-500 leading-tight -mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifikasi Button dengan Badge */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <Bell size={16} className="text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#D84040] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce-in">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {/* Dropdown Notifikasi */}
            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
            />
          </div>

          <div className="w-px h-7 bg-gray-200" />

          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <p className="text-xs font-bold text-[#1D1616] leading-tight">
                SYABIL ADMIN
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">Admin</p>
            </div>
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8E1616] to-[#D84040] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#8E1616]/30">
                Z
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors ml-2"
              title="Keluar"
            >
              <LogOut size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Modal Konfirmasi Logout */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Header;