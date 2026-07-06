import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Menu, X } from "lucide-react";

// ── Area TOP: Navbar ───────────────────────────────────────────
// Menu navigasi (scroll ke section di halaman landing)
const navItems = [
  { label: "Beranda", target: "home" },
  { label: "Tentang", target: "about" },
  { label: "Galeri", target: "gallery" },
  { label: "Promosi", target: "promotions" },
  { label: "Paket", target: "pricing" },
  { label: "FAQ", target: "faq" },
  { label: "Umpan Balik", target: "feedback" },
];

export default function PublicNavbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-[#1D1616]/90 backdrop-blur border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Identitas & Navigasi (logo jelas, menu dibatasi) */}
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#8C1007] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Dumbbell size={16} className="text-[#FFF0C4]" />
            </div>
            <div className="text-left">
              <h1 className="text-[14px] font-black text-[#FFF0C4] tracking-tight leading-tight">
                ZEUS GYM
              </h1>
              <p className="text-[9px] text-[#FFF0C4]/40 font-semibold tracking-[1.5px] uppercase mt-0.5">
                Gym Management CRM
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

          {/* Secondary CTA (Masuk) & Primary CTA (Daftar) di sudut kanan */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-white/70 hover:text-white font-medium px-4 py-2.5 transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-[#D84040] hover:bg-[#8E1616] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Daftar
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
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => navigate("/login")}
              className="w-full text-center border border-white/15 text-white text-sm font-semibold px-5 py-3 rounded-full"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-[#D84040] text-white text-sm font-semibold px-5 py-3 rounded-full"
            >
              Daftar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
