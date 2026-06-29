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
  UserCog,
  Dumbbell,
  Store,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

// ── Definisi menu ─────────────────────────────────────────────
const menuGroups = [
  {
    label: "Menu",
    items: [
      { label: "Beranda", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Anggota", icon: Users, path: "/members", badge: 1000 },
      { label: "Pembayaran", icon: CreditCard, path: "/payments" },
      { label: "Absensi", icon: QrCode, path: "/attendance" },
      { label: "Laporan", icon: FileText, path: "/reports" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Promosi", icon: Megaphone, path: "/promotions" },
      { label: "Umpan Balik", icon: MessageSquare, path: "/feedback" },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Profil", icon: User, path: "/profile" },
      { label: "Manajemen User", icon: UserCog, path: "/users" },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ── NavItem ───────────────────────────────────────────────
  const NavItem = ({ item }) => {
    /*
      Cek aktif:
      - "/members" aktif HANYA jika pathname persis "/members"
        (bukan "/members/1", "/members/5" — itu halaman MemberDetail)
      - Route lain cukup pathname === item.path
    */
    const isActive =
      item.path === "/members"
        ? location.pathname === "/members"
        : location.pathname === item.path;

    const Icon = item.icon;

    return (
      <button
        onClick={() => navigate(item.path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
          ${
            isActive
              ? "bg-[#8E1616] text-[#F8EEDF] shadow-md"
              : "text-[#F8EEDF]/60 hover:bg-white/8 hover:text-[#F8EEDF]"
          }`}
      >
        {/* Icon box */}
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-all
            ${isActive ? "bg-white/20" : "group-hover:bg-white/10"}`}
        >
          <Icon size={15} />
        </span>

        {/* Label */}
        <span className="flex-1 text-left">{item.label}</span>

        {/* Badge (opsional) */}
        {item.badge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full
              ${
                isActive
                  ? "bg-white/25 text-[#F8EEDF]"
                  : "bg-[#8E1616]/80 text-[#F8EEDF]"
              }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="w-[220px] min-h-screen bg-[#000000] flex flex-col fixed left-0 top-0 bottom-0 z-20 border-r border-[#E8C999]/15">
      {/* ── Logo ── */}
      <div className="px-4 py-5 border-b border-[#E8C999]/15">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#8E1616] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Dumbbell size={16} className="text-[#E8C999]" />
          </div>
          <div>
            <h1 className="text-[14px] font-black text-[#F8EEDF] tracking-tight leading-tight">
              ZEUS GYM
            </h1>
            <p className="text-[9px] text-[#E8C999]/60 font-semibold tracking-[1.5px] uppercase mt-0.5">
              Panel Admin
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav Groups ── */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9.5px] font-bold text-[#E8C999]/45 tracking-[1.5px] uppercase px-3 mb-1">
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

      {/* ── Logout ── */}
      <div className="px-2 pb-4 border-t border-[#E8C999]/15 pt-2">
        <button
          onClick={() => navigate("/login")}
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
