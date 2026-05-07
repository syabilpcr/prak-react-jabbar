import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  QrCode,
  FileText,
  Megaphone,
  MessageSquare,
  User,
  Dumbbell,
  Store,
  Plug,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const menuGroups = [
  {
    label: "Menu",
    items: [
      { label: "Beranda", icon: LayoutDashboard, path: "/" },
      { label: "Anggota", icon: Users, path: "/members", badge: 13 },
      { label: "Pembayaran", icon: CreditCard, path: "/payments" },
      { label: "Absensi", icon: QrCode, path: "/attendance" },
      { label: "Laporan", icon: FileText, path: "/reports" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Toko", icon: Store, path: "/store" },
      { label: "Integrasi", icon: Plug, path: "/integration" },
      { label: "Promosi", icon: Megaphone, path: "/promotions" },
      { label: "Umpan Balik", icon: MessageSquare, path: "/feedback" },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Pengaturan", icon: Settings, path: "/settings" },
      { label: "Bantuan", icon: HelpCircle, path: "/help" },
      { label: "Profil", icon: User, path: "/profile" },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    const isLogout = item.label === "Keluar";

    return (
      <button
        onClick={() => navigate(item.path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
          ${isActive
            ? "bg-[#8C1007] text-[#FFF0C4] shadow-md"
            : isLogout
            ? "text-red-300 hover:bg-white/5 hover:text-red-200"
            : "text-[#FFF0C4]/60 hover:bg-white/8 hover:text-[#FFF0C4]"
          }`}
      >
        <span className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-all
          ${isActive ? "bg-white/20" : "group-hover:bg-white/10"}`}>
          <Icon size={15} />
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
            ${isActive ? "bg-white/25 text-[#FFF0C4]" : "bg-[#8C1007]/80 text-[#FFF0C4]"}`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-[220px] min-h-screen bg-[#3E0703] flex flex-col fixed left-0 top-0 bottom-0 z-20 border-r border-[#FFF0C4]/10">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#FFF0C4]/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#8C1007] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Dumbbell size={16} className="text-[#FFF0C4]" />
          </div>
          <div>
            <h1 className="text-[14px] font-black text-[#FFF0C4] tracking-tight leading-tight">
              ZEUS GYM
            </h1>
            <p className="text-[9px] text-[#FFF0C4]/40 font-semibold tracking-[1.5px] uppercase mt-0.5">
              Panel Admin
            </p>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9.5px] font-bold text-[#FFF0C4]/35 tracking-[1.5px] uppercase px-3 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="px-2 pb-4 border-t border-[#FFF0C4]/10 pt-2">
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300/80 hover:bg-white/5 hover:text-red-300 transition-all"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg">
            <LogOut size={15} />
          </span>
          Keluar
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
