import { ArrowRight, MapPin, Phone, Mail, Share2, Send, Globe, Dumbbell } from "lucide-react";
import Reveal from "../Reveal";

const CTA_IMG =
  "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1600&q=80";

export default function LandingContact({ scrollTo }) {
  const year = new Date().getFullYear();

  return (
    <>
      {/* ── CTA ── */}
      <section id="contact" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CTA_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1D1616]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616] via-transparent to-[#1D1616]" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#8E1616]/30 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 py-28 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[0.95]">
              KEKUATANMU,
              <br />
              <span className="text-[#D84040]">DIMULAI SEKARANG.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-white/55 mt-6 max-w-lg mx-auto text-[15px] leading-relaxed">
              Bergabung bersama ribuan member yang sudah mengubah hidupnya di
              Zeus Gym. Coba gratis 3 hari, tanpa komitmen.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <button
              onClick={() => scrollTo("home")}
              className="group inline-flex items-center gap-2 bg-[#D84040] hover:bg-[#8E1616] text-white font-semibold px-8 py-4 rounded-full mt-9 transition-colors"
            >
              Mulai Free Trial
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1D1616] border-t border-white/[0.06] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#8C1007] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Dumbbell size={16} className="text-[#FFF0C4]" />
                </div>
                <h1 className="text-[14px] font-black text-[#FFF0C4] tracking-tight">
                  ZEUS GYM
                </h1>
              </div>
              <p className="text-white/45 text-[14px] mt-4 max-w-xs leading-relaxed">
                Tempat di mana setiap gerakan membentuk versi terbaikmu. Latih
                tubuh, kuatkan mental.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {[Share2, Send, Globe].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full border border-white/15 hover:border-[#D84040] hover:bg-[#D84040] text-white/60 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Kontak</h4>
              <ul className="space-y-3 text-[14px] text-white/45">
                <li className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#D84040]" /> Jl Tegal sari Gg. Kemuning
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={15} className="text-[#D84040]" /> +62 812 3456 7890
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={15} className="text-[#D84040]" /> halo@zeusgym.id
                </li>
              </ul>
            </div>

            {/* Jam */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Jam Buka</h4>
              <ul className="space-y-3 text-[14px] text-white/45">
                <li className="flex justify-between"><span>Sen - Jum</span><span className="text-white/70">05:00 - 23:00</span></li>
                <li className="flex justify-between"><span>Sabtu</span><span className="text-white/70">06:00 - 22:00</span></li>
                <li className="flex justify-between"><span>Minggu</span><span className="text-white/70">07:00 - 20:00</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-12 pt-6 border-t border-white/[0.06]">
            <p className="text-[13px] text-white/30">
              © {year} Zeus Gym. Seluruh hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-6 text-[13px] text-white/40">
              <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}