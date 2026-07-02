import React, { Suspense, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Dumbbell, LogOut, Menu, X } from "lucide-react";

// ── Menu navigasi (scroll ke section di halaman beranda) ──────
const navItems = [
  { label: "Beranda", target: "home" },
  { label: "Tentang", target: "about" },
  { label: "Layanan", target: "services" },
<<<<<<< HEAD
  { label: "Pelatih", target: "trainers" },
=======
  { label: "Paket", target: "pricing" },
>>>>>>> master
  { label: "FAQ", target: "faq" },
];

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-2 border-white/20 border-t-[#D84040] rounded-full animate-spin" />
  </div>
);

export default function MemberLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setUser(JSON.parse(stored));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
            {/* Logo */}
            <button
              onClick={() => scrollTo("home")}
              className="flex items-center gap-2.5"
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

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-1.5">
              {navItems.map((item) => (
                <button
                  key={item.target}
                  onClick={() => scrollTo(item.target)}
                  className="text-sm text-white/60 hover:text-white px-4 py-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[13px] text-white/50">
                Hai, {(user?.name || "Member").split(" ")[0]}
              </span>
              <button
                onClick={() => scrollTo("contact")}
                className="bg-[#D84040] hover:bg-[#8E1616] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Free Trial
              </button>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-full border border-white/15 hover:border-white/40 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                title="Keluar"
              >
                <LogOut size={15} />
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-lg text-white flex items-center justify-center"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1D1616] border-t border-white/[0.06] px-5 py-6 space-y-4 animate-slide-up">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => scrollTo(item.target)}
                className="block text-base text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="w-full bg-[#D84040] text-white text-sm font-semibold px-5 py-3 rounded-full"
            >
              Free Trial
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <LogOut size={15} /> Keluar
            </button>
          </div>
        )}
      </header>

      {/* ── Content (full-bleed, landing mengatur lebarnya sendiri) ── */}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}