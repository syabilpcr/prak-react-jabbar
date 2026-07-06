import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Shield,
  Sparkles,
  ArrowRight,
  Award,
  Crown,
  CheckCircle2,
  ChevronRight,
  Target,
  TrendingUp,
  Calendar,
  Activity,
} from "lucide-react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

// ─── Konten setelah hero expand ─────────────────────────────────
const weekDays  = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const attendance = [true, true, false, true, true, false, false];

const FACILITIES = [
  {
    title: "Peralatan Berat Lengkap",
    desc: "Barbell olimpiade, squat rack, platform deadlift, mesin kabel multi-arah, dan dumbbell set hingga 50kg.",
    icon: Dumbbell,
    gradient: "from-[#8C1007]/30 to-[#D84040]/10",
    iconColor: "text-[#D84040]",
    tag: "200+ unit",
  },
  {
    title: "Zona Fungsional Luas",
    desc: "Area kettlebell, medicine ball, resistance band, pull-up station, dan sled track tanpa hambatan.",
    icon: Shield,
    gradient: "from-blue-900/30 to-indigo-900/10",
    iconColor: "text-blue-400",
    tag: "500 m²",
  },
  {
    title: "Kardio Terkini",
    desc: "Treadmill, bike, elliptical, dan rowing machine terbaru dengan layar monitor detak jantung terintegrasi.",
    icon: Activity,
    gradient: "from-emerald-900/30 to-teal-900/10",
    iconColor: "text-emerald-400",
    tag: "60+ mesin",
  },
  {
    title: "Loker & Shower Premium",
    desc: "Kamar mandi air panas, loker stainless terkunci, ruang ganti ber-AC, dan amenity kit tersedia.",
    icon: Award,
    gradient: "from-amber-900/30 to-orange-900/10",
    iconColor: "text-amber-400",
    tag: "180+ loker",
  },
];

const QUICK_NAV = [
  { label: "Target Latihan", icon: Target,  to: "/member/workouts",  color: "text-[#D84040]",   bg: "bg-[#D84040]/10  border-[#D84040]/20"  },
  { label: "Tulis Ulasan",   icon: Sparkles,to: "/member/feedback",  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "Profil Saya",    icon: Award,   to: "/member/profile",   color: "text-purple-400",  bg: "bg-purple-500/10  border-purple-500/20" },
];

const STATS = [
  { label: "Luas Area",          value: "1.500 m²",  icon: TrendingUp },
  { label: "Alat Beban",         value: "250+ unit", icon: Dumbbell   },
  { label: "Loker Aman",         value: "180+ unit", icon: Shield     },
  { label: "Jam Buka",           value: "18 Jam",    icon: Calendar   },
];

const MOTIVATIONS = [
  "Konsistensi adalah kunci. Setiap latihan membawa kamu selangkah lebih dekat ke tujuan.",
  "Tubuh terbaikmu dibangun di sini — dengan tekad yang tidak pernah padam.",
  "Rasa lelah hari ini adalah kekuatan esok hari. Jangan berhenti sekarang!",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

// ─── Konten yang muncul setelah expand selesai ─────────────────
function HeroExpandedContent({ user, navigate }) {
  const firstName  = (user?.name || "Member").split(" ")[0];
  const initial    = firstName.charAt(0).toUpperCase();
  const quoteIdx   = useState(() => Math.floor(Math.random() * MOTIVATIONS.length))[0];

  return (
    <div className="bg-[#0b0b0d] text-white">

      {/* ── Weekly tracker & CTA ── */}
      <div className="max-w-5xl mx-auto pt-10 pb-6 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Welcome badge */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#D84040] font-black mb-1">
              {getGreeting()}, {firstName}!
            </p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Dashboard Member
            </h2>
          </div>

          {/* Attendance strip */}
          <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-5 py-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black mr-1">Minggu Ini</span>
            {weekDays.map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-[9px] uppercase font-bold text-white/25">{day}</span>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  attendance[i] ? "bg-[#D84040] shadow-md shadow-[#D84040]/30" : "bg-white/[0.04] border border-white/[0.06]"
                }`}>
                  {attendance[i]
                    ? <CheckCircle2 size={12} className="text-white" />
                    : <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Nav ── */}
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {QUICK_NAV.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className={`group relative flex flex-col items-start gap-2.5 p-4 rounded-2xl border ${item.bg} hover:scale-[1.02] transition-all duration-300 cursor-pointer text-left`}
          >
            <item.icon size={20} className={`${item.color} group-hover:scale-110 transition-transform`} />
            <p className="text-sm font-bold text-white">{item.label}</p>
            <ChevronRight size={13} className="absolute bottom-3 right-3 text-white/20 group-hover:text-white/50 transition-colors" />
          </button>
        ))}
      </div>

      {/* ── Fasilitas ── */}
      <section className="py-20 px-4 md:px-10 bg-[#141416] border-t border-white/[0.05] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D84040]/4 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <motion.p {...fadeUp()} className="text-[11px] uppercase tracking-[0.25em] text-[#D84040] font-black mb-3">
              Detail Fasilitas
            </motion.p>
            <motion.h2 {...fadeUp(0.1)} className="text-3xl md:text-4xl font-black tracking-tight uppercase">
              FASILITAS MEMBER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">TANPA BATASAN</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FACILITIES.map((fac, i) => (
              <motion.div
                key={fac.title}
                {...fadeUp(i * 0.1)}
                className={`group relative overflow-hidden bg-gradient-to-br ${fac.gradient} border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-black/20 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <fac.icon size={20} className={fac.iconColor} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-base font-bold tracking-tight">{fac.title}</h3>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/[0.06]">
                        {fac.tag}
                      </span>
                    </div>
                    <p className="text-white/45 text-sm leading-relaxed">{fac.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="py-12 border-t border-white/[0.04] bg-[#0b0b0d]">
        <div className="max-w-5xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06]">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp(i * 0.07)}
                className="bg-[#0b0b0d] flex flex-col items-center justify-center py-8 px-4 text-center hover:bg-white/[0.02] transition-colors"
              >
                <stat.icon size={16} className="text-[#D84040] mb-2.5" />
                <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-white/35 uppercase tracking-wider mt-1 font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="py-16 px-4 md:px-10 bg-[#141416] border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          {/* Quote */}
          <motion.div
            {...fadeUp()}
            className="relative overflow-hidden rounded-2xl border border-[#D84040]/25 bg-gradient-to-br from-[#1a0a0a] to-[#141416] p-7"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D84040] to-[#8C1007] rounded-l-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D84040]/10 border border-[#D84040]/20 flex items-center justify-center">
                  <Flame size={16} className="text-[#D84040]" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#D84040]/70 font-black">Motivasi Hari Ini</p>
              </div>
              <p className="text-base text-white/80 leading-relaxed font-medium italic">
                "{MOTIVATIONS[quoteIdx]}"
              </p>
              <div className="mt-5 pt-5 border-t border-white/[0.05] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8C1007] to-[#D84040] flex items-center justify-center text-sm font-black text-white">
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{firstName}</p>
                  <p className="text-[10px] text-white/35 uppercase tracking-wider">Zeus Gym Member</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────
export default function MemberDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="bg-[#0b0b0d] text-white">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&w=1280&fit=crop&q=80"
        bgImageSrc="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&w=1920&fit=crop&q=75"
        title="ZEUS GYM"
        date="Premium Fitness"
        scrollToExpand="Scroll untuk masuk ke dashboard"
        textBlend={false}
      >
        <HeroExpandedContent user={user} navigate={navigate} />
      </ScrollExpandMedia>
    </div>
  );
}
