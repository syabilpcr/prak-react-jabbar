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
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Beranda", icon: LayoutDashboard, path: "/" },
    { label: "Anggota", icon: Users, path: "/members" },
    { label: "Pembayaran", icon: CreditCard, path: "/payments" },
    { label: "Absensi", icon: QrCode, path: "/attendance" },
    { label: "Laporan", icon: FileText, path: "/reports" },
    { label: "Promosi", icon: Megaphone, path: "/promotions" },
    { label: "Umpan Balik", icon: MessageSquare, path: "/feedback" },
    { label: "Profil", icon: User, path: "/profile" },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <button
        onClick={() => navigate(item.path)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
          isActive
            ? "bg-[#8E1616] text-white shadow-lg shadow-[#8E1616]/30"
            : "text-gray-300 hover:bg-[#8E1616]/20 hover:text-white"
        }`}
      >
        <span
          className={`p-1.5 rounded-lg transition-all ${
            isActive ? "bg-white/20" : "group-hover:bg-[#8E1616]/30"
          }`}
        >
          <Icon size={14} />
        </span>
        {item.label}
      </button>
    );
  };

  return (
    <div className="w-64 min-h-screen bg-[#1D1616] flex flex-col p-4 fixed left-0 top-0 bottom-0 z-20 border-r border-[#8E1616]/30">
      <div className="mb-8 px-2 pt-3">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-8 h-8 bg-[#D84040] rounded-xl flex items-center justify-center shadow-lg shadow-[#D84040]/30">
            <Dumbbell size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            ZEUS<span className="text-[#D84040]">GYM</span>
          </h1>
        </div>
        <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase ml-10">
          Panel Admin
        </p>
      </div>

      <div className="flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-auto"></div>
    </div>
  );
};

export default Sidebar;
