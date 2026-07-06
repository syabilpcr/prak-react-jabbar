import React, { Suspense, useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  Dumbbell,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Crown,
  Zap,
  MessageCircle,
  User,
} from "lucide-react";

const navItems = [
  { label: "Beranda",      to: "/member",          icon: LayoutDashboard },
  { label: "Latihan",      to: "/member/workouts", icon: Zap             },
  { label: "Feedback",     to: "/member/feedback", icon: MessageCircle   },
  { label: "Profil",       to: "/member/profile",  icon: User            },
];

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-2 border-white/20 border-t-[#D84040] rounded-full animate-spin" />
  </div>
);

export default function MemberLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setUser(parsed));
    }

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup mobile menu setiap pindah halaman
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  /** Cek apakah route sedang aktif (exact untuk /member, startsWith untuk sub-route) */
  const isActive = (to) => {
    if (to === "/member") return location.pathname === "/member";
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-[#1D1616]">
      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1D1616]/90 backdrop-blur border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo ── */}
            <button
              onClick={() => navigate("/member")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 bg-[#8C1007] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Dumbbell size={16} className="text-[#FFF0C4]" />
              </div>
              <div className="text-left">
                <h1 className="text-[14px] font-black text-[#FFF0C4] tracking-tight leading-tight">
                  ZEUS GYM
                </h1>
                <p className="text-[9px] text-[#FFF0C4]/40 font-semibold tracking-[1.5px] uppercase mt-0.5">
                  Member Area
                </p>
              </div>
            </button>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-1.5">
              {navItems.map((item) => {
                const active = isActive(item.to);
                return (
                  <button
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer
                      ${
                        active
                          ? "bg-[#D84040] text-white font-bold shadow-md shadow-[#D84040]/20"
                          : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                      }`}
                  >
                    <item.icon size={13} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* ── Right — Avatar + Logout ── */}
            <div className="hidden md:flex items-center gap-3">
              {/* Avatar lingkaran dengan initial */}
              <button
                onClick={() => navigate("/member/profile")}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8C1007] to-[#D84040] flex items-center justify-center text-[13px] font-black text-white border-2 border-white/10 group-hover:border-[#D84040]/50 transition-colors">
                  {(user?.name || "M").charAt(0).toUpperCase()}
                </div>
                <span className="text-[13px] text-white/50 group-hover:text-white/80 transition-colors">
                  {(user?.name || "Member").split(" ")[0]}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-full border border-white/15 hover:border-[#D84040]/50 text-white/50 hover:text-[#D84040] flex items-center justify-center transition-all duration-200 cursor-pointer"
                title="Keluar"
              >
                <LogOut size={15} />
              </button>
            </div>

            {/* ── Mobile toggle ── */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-lg text-white flex items-center justify-center"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Nav ── */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1D1616]/95 backdrop-blur border-t border-white/[0.06] px-5 py-5 space-y-1 animate-slide-down">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                    ${
                      active
                        ? "bg-[#D84040]/10 text-[#D84040] font-bold border border-[#D84040]/20"
                        : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                  <item.icon size={16} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}

            {/* Divider */}
            <div className="border-t border-white/[0.06] pt-4 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8C1007] to-[#D84040] flex items-center justify-center text-[13px] font-black text-white">
                  {(user?.name || "M").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user?.name || "Member"}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-[#D84040] transition-colors cursor-pointer px-3 py-2 rounded-lg hover:bg-[#D84040]/10"
              >
                <LogOut size={14} /> Keluar
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}