import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Reveal from "../Reveal";

const faqs = [
  {
    q: "Apakah ada masa percobaan gratis?",
    a: "Ya. Kamu bisa mencoba fasilitas Zeus Gym gratis selama 3 hari pertama. Cukup daftar dan datang ke resepsionis dengan kartu identitas.",
  },
  {
    q: "Jam berapa gym buka?",
    a: "Zeus Gym buka setiap hari dari pukul 05.00 hingga 23.00. Beberapa cabang utama buka 24 jam untuk member Pro.",
  },
  {
    q: "Apakah peralatan gym selalu tersedia dan terawat?",
    a: "Ya. Semua peralatan diperiksa dan dirawat secara rutin setiap hari. Jika ada peralatan yang memerlukan perbaikan, langsung diganti sementara agar tidak mengganggu latihan anggota.",
  },
  {
    q: "Bisakah saya membekukan membership?",
    a: "Bisa. Membership dapat dibekukan hingga 30 hari per tahun tanpa biaya, misalnya saat kamu sedang bepergian atau cedera.",
  },
  {
    q: "Apakah tersedia loker dan kamar mandi?",
    a: "Tentu. Setiap cabang dilengkapi loker aman, kamar mandi air panas, dan area ganti yang bersih dan nyaman.",
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-[#241818] py-24">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D84040] mb-4">
              FAQ
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              PERTANYAAN <span className="text-[#D84040]">UMUM</span>
            </h2>
          </Reveal>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 80}>
                <div
                  className={`rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? "bg-[#2A1A1A] border-[#D84040]/40"
                      : "bg-[#2A1A1A] border-white/[0.06] hover:border-white/15"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15px] md:text-base font-medium text-white">
                      {f.q}
                    </span>
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isOpen ? "bg-[#D84040] text-white" : "bg-white/10 text-white/60"
                      }`}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-white/50 text-[14px] leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}