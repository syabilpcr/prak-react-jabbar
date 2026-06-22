import { Dumbbell, HeartPulse, Users, Waves, Bike, Activity, ArrowUpRight } from "lucide-react";
import Reveal from "../Reveal";

const services = [
  {
    icon: Dumbbell,
    title: "Strength Training",
    desc: "Area angkat beban lengkap dengan free weight dan mesin modern.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: HeartPulse,
    title: "Personal Training",
    desc: "Pelatih pribadi yang menyusun program sesuai tubuh dan targetmu.",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: Users,
    title: "Group Classes",
    desc: "Kelas grup energik mulai dari HIIT, yoga, hingga spinning.",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: Waves,
    title: "Swimming Pool",
    desc: "Kolam renang indoor untuk kardio low-impact dan recovery.",
    img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: Bike,
    title: "Cardio Zone",
    desc: "Deretan treadmill, sepeda, dan rower dengan layar hiburan.",
    img: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: Activity,
    title: "Functional Training",
    desc: "Ruang fungsional untuk gerakan dinamis dan latihan atletik.",
    img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=900&q=80",
  },
];

export default function LandingServices() {
  return (
    <section id="services" className="bg-[#241818] py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <Reveal>
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D84040] mb-4">
                Layanan Kami
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight max-w-xl leading-tight">
                SEMUA YANG KAMU BUTUH UNTUK <span className="text-[#D84040]">BERKEMBANG</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="text-white/45 text-[15px] max-w-sm">
              Fasilitas lengkap dalam satu tempat. Dirancang untuk setiap level,
              dari langkah pertama hingga performa terbaik.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 3) * 120}>
                <div className="group relative overflow-hidden rounded-2xl bg-[#2A1A1A] border border-white/[0.06] hover:border-[#D84040]/40 transition-all duration-500 h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A1A1A] to-transparent" />
                    <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-[#D84040] flex items-center justify-center shadow-lg">
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {s.title}
                      </h3>
                      <ArrowUpRight
                        size={18}
                        className="text-white/30 group-hover:text-[#D84040] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                    <p className="text-white/45 text-[13px] mt-2 leading-relaxed">
                      {s.desc}
                    </p>
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