import { Dumbbell, HeartPulse, Users, Waves, Bike, Activity, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../Reveal";

const services = [
  {
    icon: Dumbbell,
    title: "Strength Training",
    desc: "Area angkat beban lengkap dengan free weight dan mesin modern.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
    color: "from-[#8E1616] to-[#D84040]"
  },
  {
    icon: HeartPulse,
    title: "Personal Training",
    desc: "Pelatih pribadi yang menyusun program sesuai tubuh dan targetmu.",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Users,
    title: "Group Classes",
    desc: "Kelas grup energik mulai dari HIIT, yoga, hingga spinning.",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    color: "from-emerald-400 to-teal-500"
  },
  {
    icon: Waves,
    title: "Swimming Pool",
    desc: "Kolam renang indoor untuk kardio low-impact dan recovery.",
    img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80",
    color: "from-blue-400 to-indigo-500"
  },
  {
    icon: Bike,
    title: "Cardio Zone",
    desc: "Deretan treadmill, sepeda, dan rower dengan layar hiburan.",
    img: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Activity,
    title: "Functional Training",
    desc: "Ruang fungsional untuk gerakan dinamis dan latihan atletik.",
    img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=900&q=80",
    color: "from-[#D84040] to-[#8E1616]"
  },
];

export default function LandingServices() {
  return (
    <section id="services" className="bg-[#241818] py-24 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#D84040]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#8E1616]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <Reveal>
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D84040] mb-4">
                Layanan Kami
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight max-w-xl leading-tight uppercase">
                Semua Yang Kamu <br className="hidden md:inline" />
                Butuh Untuk <span className="text-[#D84040]">Berkembang</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="text-white/45 text-[15px] max-w-sm leading-relaxed">
              Fasilitas lengkap dalam satu tempat. Dirancang untuk setiap level,
              dari langkah pertama hingga performa atletik terbaikmu.
            </p>
          </Reveal>
        </div>

        {/* ── Grid Layanan dengan Animasi Stagger & Hover Premium ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 3) * 100} direction="up" className="h-full">
                <motion.div
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className="group relative overflow-hidden rounded-3xl bg-[#2A1A1A] border border-white/[0.06] hover:border-[#D84040]/30 transition-colors duration-300 h-full flex flex-col cursor-pointer"
                >
                  {/* Photo Container */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      variants={{
                        rest: { scale: 1, opacity: 0.6 },
                        hover: { scale: 1.12, opacity: 0.8 }
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={s.img}
                      alt={s.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A1A1A] via-[#2A1A1A]/40 to-transparent" />
                    
                    {/* Icon Box with Hover Scale */}
                    <motion.div
                      variants={{
                        rest: { scale: 1, rotate: 0 },
                        hover: { scale: 1.1, rotate: 5 }
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className={`absolute top-5 left-5 w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg text-white`}
                    >
                      <Icon size={20} />
                    </motion.div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#D84040] transition-colors duration-300">
                          {s.title}
                        </h3>
                        <motion.div
                          variants={{
                            rest: { x: 0, y: 0 },
                            hover: { x: 3, y: -3 }
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <ArrowUpRight
                            size={18}
                            className="text-white/30 group-hover:text-[#D84040] transition-colors duration-300"
                          />
                        </motion.div>
                      </div>
                      <p className="text-white/40 text-[13px] mt-2.5 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}