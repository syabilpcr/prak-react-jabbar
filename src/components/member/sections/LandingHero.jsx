import { useState } from "react";
import { Play, ArrowRight, Dumbbell, Flame, Trophy, Calendar, QrCode, Activity, Heart, Award } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import VideoModal from "../../VideoModal";

const HERO_IMG =
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1400&q=80";

// ── CUSTOM VIDEO URL ─────────────────────────────────────────────
// Ganti nilai ini dengan URL video Anda sendiri. 
// Bisa berupa URL YouTube (misal: "https://www.youtube.com/watch?v=VIDEO_ID")
// Atau file video lokal yang diletakkan di dalam folder 'public' (misal: "/videos/video-pribadi.mp4")
const VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-athletic-man-lifting-barbell-in-the-gym-42289-large.mp4";

const tags = [
  "Personal Training",
  "Strength",
  "Group Classes",
  "Swimming",
  "Cardio Equipment",
  "Functional Workouts",
];

export default function LandingHero({ scrollTo }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-[120vh] md:min-h-[140vh] flex flex-col justify-start overflow-hidden bg-[#0b0b0d] pt-24"
    >
      {/* Background visual accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[80%] opacity-20 md:opacity-30">
          <img
            src={HERO_IMG}
            alt=""
            className="w-full h-full object-cover object-center filter grayscale contrast-125"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0d] via-[#0b0b0d]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-[#0b0b0d]" />
        
        {/* Neon Glow spots */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#8E1616]/20 rounded-full blur-[100px] animate-pulse-ring" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#D84040]/10 rounded-full blur-[120px] animate-float-slow" />
      </div>

      <div className="relative z-10 w-full">
        <ContainerScroll
          titleComponent={
            <div className="max-w-4xl mx-auto px-4 text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D84040]/10 border border-[#D84040]/20 text-xs font-semibold text-[#D84040] mb-5 uppercase tracking-wider animate-slide-down">
                <Dumbbell size={13} className="animate-rotate-slow" />
                The Ultimate Gym Experience
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight animate-slide-up">
                Push Your Limits <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D84040] via-[#F46B6B] to-orange-500 animate-gradient">
                  with Zeus Gym
                </span>
              </h1>

              <p
                className="text-white/60 mt-6 max-w-xl mx-auto text-[14px] md:text-[16px] leading-relaxed animate-slide-up delay-100"
              >
                Dari pemula hingga atlet, rasakan latihan yang dirancang untuk
                membantumu mencapai performa puncak dan melampaui target
                kebugaranmu dengan sistem tracking termodern.
              </p>

              <div
                className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-slide-up delay-150"
              >
                <button
                  onClick={() => scrollTo("contact")}
                  className="group inline-flex items-center gap-2 bg-[#D84040] hover:bg-[#8E1616] text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#D84040]/20 hover:scale-[1.03] cursor-pointer"
                >
                  Join Now
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="group inline-flex items-center gap-2.5 text-white/80 hover:text-white font-semibold transition-colors px-5 py-3.5 rounded-xl hover:bg-white/[0.04] cursor-pointer"
                >
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Play size={14} fill="white" className="ml-0.5" />
                  </span>
                  Watch Video
                </button>
              </div>

              {/* Tag layanan */}
              <div
                className="flex flex-wrap justify-center gap-2 mt-8 animate-slide-up delay-200"
              >
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-[12px] text-white/50 bg-[#141416]/40 border border-white/5 hover:border-[#D84040]/40 hover:text-white rounded-full px-3.5 py-1.5 transition-all duration-300 cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          }
        >
          {/* Mock Dashboard UI inside the 3D Scroll Card */}
          <div className="w-full h-full bg-[#0e0e11] text-white font-sans flex flex-col p-3 md:p-6 overflow-hidden">
            {/* Topbar of mock dashboard */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D84040]/20 flex items-center justify-center border border-[#D84040]/30 animate-pulse-ring">
                  <Dumbbell size={14} className="text-[#D84040]" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wider text-white">ZEUS PORTAL v2.4</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping-slow" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Live State: In Gym</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Active Program</span>
                  <span className="text-xs font-semibold text-[#D84040]">Hypertrophy 4-Day Split</span>
                </div>
                <div className="h-8 w-[1px] bg-white/5 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8E1616] to-[#D84040] flex items-center justify-center font-bold text-xs">
                    JS
                  </div>
                  <span className="text-xs font-semibold hidden md:inline">Syabil Jabbar</span>
                </div>
              </div>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto pr-1">
              {/* Left Column: Quick Stats */}
              <div className="md:col-span-2 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#141416] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block mb-1">Streak</span>
                    <span className="text-lg md:text-2xl font-black text-white flex items-center gap-1.5">
                      12 <Flame size={16} className="text-orange-500 animate-float" />
                    </span>
                    <span className="text-[9px] text-green-500 mt-1 block font-medium">Personal Best!</span>
                  </div>

                  <div className="bg-[#141416] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block mb-1">Calories Burned</span>
                    <span className="text-lg md:text-2xl font-black text-white flex items-center gap-1.5">
                      840 <Activity size={16} className="text-red-500" />
                    </span>
                    <span className="text-[9px] text-white/40 mt-1 block font-medium">Avg. 450 kcal/day</span>
                  </div>

                  <div className="bg-[#141416] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block mb-1">Rank</span>
                    <span className="text-lg md:text-2xl font-black text-white flex items-center gap-1.5">
                      Pro <Trophy size={16} className="text-yellow-500 animate-sparkle" />
                    </span>
                    <span className="text-[9px] text-[#D84040] mt-1 block font-bold">Top 5% Members</span>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="bg-[#141416] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Heart size={14} className="text-red-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider">Weekly Target Progression</span>
                    </div>
                    <span className="text-xs font-black text-[#D84040]">80% Complete</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-gradient-to-r from-[#8E1616] to-[#D84040] rounded-full w-[80%] animate-gradient" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-white/40">
                    <span>Target: 5 workouts / week</span>
                    <span>4 / 5 Selesai</span>
                  </div>
                </div>

                {/* Upcoming Classes */}
                <div className="bg-[#141416] border border-white/5 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#D84040]" />
                    Rekomendasi Kelas Hari Ini
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-[#D84040] bg-[#D84040]/10 px-2 py-1 rounded">19:00</span>
                        <div>
                          <p className="text-xs font-semibold">Boxing Intense Session</p>
                          <p className="text-[10px] text-white/40">Coach Reza · Level Lanjutan</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-green-500/10 text-green-400 font-bold px-2 py-0.5 rounded">Tersedia</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-white/50 bg-white/5 px-2 py-1 rounded">20:30</span>
                        <div>
                          <p className="text-xs font-semibold">Functional HIIT Flow</p>
                          <p className="text-[10px] text-white/40">Coach Sarah · Level Menengah</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-yellow-500/10 text-yellow-400 font-bold px-2 py-0.5 rounded">Hampir Penuh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Check-in / QR Code & Plan Info */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#241818] to-[#141416] border border-[#D84040]/20 rounded-xl p-4 text-center flex flex-col items-center justify-center h-full min-h-[220px]">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-3">Quick Check-in QR</span>
                  <div className="relative p-3 bg-white rounded-2xl mb-4 group cursor-pointer hover:scale-105 transition-transform duration-300">
                    <QrCode size={100} className="text-black" />
                    <div className="absolute inset-0 border-2 border-[#D84040] rounded-2xl animate-pulse" />
                  </div>
                  <h4 className="text-xs font-black text-white tracking-wide">SCAN AT GATE</h4>
                  <p className="text-[9px] text-white/40 mt-1 max-w-[150px] mx-auto leading-relaxed">Dekatkan QR ke scanner gate untuk check-in otomatis</p>
                </div>
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={VIDEO_URL}
      />
    </section>
  );
}