import { Share2 } from "lucide-react";
import Reveal from "../Reveal";

const trainers = [
  {
    name: "Rangga Pratama",
    role: "Head Strength Coach",
    img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sarah Wijaya",
    role: "Yoga & Mobility",
    img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mike Hartono",
    role: "HIIT & Conditioning",
    img: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "aliya rahma",
    role: "Personal Trainer",
    img: "https://images.unsplash.com/photo-1609899537878-88d5ba429bdf?auto=format&fit=crop&w=800&q=80",
  },
];

export default function LandingTrainers() {
  return (
    <section id="trainers" className="bg-[#1D1616] py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D84040] mb-4">
              Tim Pelatih
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              DILATIH OLEH YANG <span className="text-[#D84040]">TERBAIK</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/45 mt-5 text-[15px]">
              Pelatih bersertifikat yang benar-benar peduli pada progresmu.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {trainers.map((t, i) => (
            <Reveal key={t.name} delay={i * 100} direction="up">
              <div className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <img
                  src={t.img}
                  alt={t.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616] via-[#1D1616]/10 to-transparent" />
                {/* Overlay aksi muncul saat hover */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#D84040] flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Share2 size={16} className="text-white" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                  <p className="text-[#D84040] text-[13px] font-medium mt-0.5">
                    {t.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}