import { Play } from "lucide-react";
import Reveal from "../Reveal";
import CountUp from "../CountUp";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80";

const stats = [
  { end: 12, suffix: "+", label: "Tahun Pengalaman" },
  { end: 27, suffix: "K+", label: "Member Aktif" },
  { end: 60, suffix: "+", label: "Kelas Mingguan" },
  { end: 117, suffix: "+", label: "Pelatih Ahli" },
];

export default function LandingAbout() {
  return (
    <section id="about" className="bg-[#1D1616] py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D84040] mb-4">
            Tentang Kami
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight max-w-3xl leading-tight">
            PERJALANAN <span className="text-[#D84040]">KEBUGARAN</span> MU
            DIMULAI DI SINI
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-white/50 mt-6 max-w-2xl text-[15px] leading-relaxed">
            Di Zeus Gym, kami berkomitmen membantumu membuka potensi penuh.
            Dengan peralatan kelas atas, pelatih berpengalaman, dan komunitas
            yang hangat, kami menyediakan lingkungan sempurna untuk mendorong
            batasmu dan meraih tujuan.
          </p>
        </Reveal>

        {/* Stats count-up */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div>
                <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  <CountUp end={s.end} suffix={s.suffix} />
                </p>
                <p className="text-[13px] text-white/45 mt-2">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Video block */}
        <Reveal direction="scale" delay={120}>
          <div className="relative mt-16 rounded-2xl overflow-hidden aspect-[16/8] group cursor-pointer">
            <img
              src={ABOUT_IMG}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={22} fill="#0b0b0d" className="text-[#0b0b0d] ml-1" />
              </span>
              <span className="absolute w-16 h-16 rounded-full bg-white/40 animate-ping-slow" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}