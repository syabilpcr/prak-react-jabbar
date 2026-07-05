import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-[#070708] text-white flex flex-col md:flex-row overflow-hidden relative select-none">
      {/* Background Subtle Grid (Right side form backdrop) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* ── LEFT PANEL: Animated Cinematic Gym Banner ── */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-[45%] lg:w-[40%] h-[300px] md:h-screen relative flex-shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-white/5"
      >
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
          alt="Zeus Gym Premium"
          className="w-full h-full object-cover pointer-events-none"
        />
        
        {/* Dark Red Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-black/30 z-10" />
        <div className="absolute inset-0 bg-[#8C1007]/10 mix-blend-color z-10" />

        {/* Branding content inside Left Panel */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-9 h-9 bg-[#8C1007] rounded-xl flex items-center justify-center shadow-lg shadow-[#8C1007]/20 flex-shrink-0">
              <Dumbbell size={16} className="text-[#FFF0C4] rotate-45" />
            </div>
            <div>
              <h1 className="text-[15px] font-black text-[#FFF0C4] tracking-tight leading-tight uppercase">
                ZEUS GYM
              </h1>
              <span className="text-[9px] text-[#FFF0C4]/40 font-semibold tracking-[1.5px] uppercase mt-0.5 block">
                PANEL ADMIN
              </span>
            </div>
          </motion.div>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xs md:text-sm text-white/60 font-medium leading-relaxed max-w-xs hidden md:block"
          >
            Sistem manajemen keanggotaan, absensi, pembayaran, dan laporan Zeus Gym.
          </motion.p>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL: Form Area with Smooth Transitions ── */}
      <div className="flex-1 min-h-0 flex items-center justify-center relative z-10 p-6 md:p-12">
        <motion.div
          key={location.pathname}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md py-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}