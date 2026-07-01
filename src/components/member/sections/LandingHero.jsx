import { Play, ArrowRight } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1400&q=80";

const tags = [
  "Personal Training",
  "Strength",
  "Group Classes",
  "Swimming",
  "Cardio Equipment",
  "Functional Workouts",
];

export default function LandingHero({ scrollTo }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#1D1616]"
    >
      {/* Foto atlet + overlay oranye gelap */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute right-0 top-0 h-full w-full md:w-[60%] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D1616] via-[#1D1616]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616] via-transparent to-transparent" />
        {/* glow merah maroon */}
        <div className="absolute -bottom-32 right-10 w-[500px] h-[500px] bg-[#8E1616]/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full pt-24 pb-16">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[0.95] tracking-tight animate-slide-up">
            Push Your
            <br />
            Limits <span className="text-[#D84040]">with Us</span>
          </h1>

          <p
            className="text-white/55 mt-6 max-w-md text-[15px] leading-relaxed animate-slide-up"
            style={{ animationDelay: "120ms" }}
          >
            Dari pemula hingga atlet, rasakan latihan yang dirancang untuk
            membantumu mencapai performa puncak dan melampaui target
            kebugaranmu.
          </p>

          <div
            className="flex flex-wrap items-center gap-4 mt-9 animate-slide-up"
            style={{ animationDelay: "240ms" }}
          >
            <button
              onClick={() => scrollTo("contact")}
              className="group inline-flex items-center gap-2 bg-[#D84040] hover:bg-[#8E1616] text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Join Now
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button className="group inline-flex items-center gap-3 text-white font-medium">
              <span className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Play size={16} fill="white" className="ml-0.5" />
              </span>
              Watch Video
            </button>
          </div>

          {/* Tag layanan */}
          <div
            className="flex flex-wrap gap-2.5 mt-10 animate-slide-up"
            style={{ animationDelay: "360ms" }}
          >
            {tags.map((t) => (
              <span
                key={t}
                className="text-[13px] text-white/70 border border-white/15 hover:border-[#D84040]/60 hover:text-white rounded-full px-4 py-2 transition-colors cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}