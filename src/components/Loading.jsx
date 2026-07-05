import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Loading({ onFinish, minDuration = 3500 }) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("ZEUS SYSTEM BOOT");
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let animationFrameId;

    const loadingMessages = [
      "ZEUS SYSTEM BOOT",
      "ESTABLISHING SECURE CONNECTION...",
      "FETCHING DATABASE SCHEMAS...",
      "AUTHENTICATING ADMIN ACCESS...",
      "SYNCHRONIZING SYSTEM DATA...",
      "BUILDING WORKSPACE INTERFACE...",
      "PREPARING SECURE PROTOCOLS...",
      "ACCESS GRANTED",
    ];

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      let percentage = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(percentage);

      const messageIndex = Math.min(
        Math.floor(percentage / (100 / loadingMessages.length)),
        loadingMessages.length - 1
      );
      setCurrentMessage(loadingMessages[messageIndex]);

      if (percentage < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          onFinish();
        }, 500);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [minDuration]);

  return createPortal(
    <AnimatePresence onExitComplete={onFinish}>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#070708] flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden"
        >
          {/* Active Digital Noise Overlay */}
          <div className="absolute inset-[-150%] noise-bg opacity-[0.06] pointer-events-none z-0" />

          {/* Subtle Grid and Glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D84040]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D84040]/3 rounded-full blur-[150px] opacity-10 pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#D84040] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                ZEUS CRM // CORE SYSTEM
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/30 hidden sm:inline">
              SYS_REV_8.0.3_2026
            </span>
          </div>

          {/* Middle Layout: Huge Percentage & Floating Message */}
          <div className="relative z-10 my-auto flex flex-col justify-center items-center mx-auto text-center space-y-6">
            {/* Dynamic Status Text */}
            <div className="h-6 overflow-hidden flex items-center justify-center">
              <motion.span
                key={currentMessage}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-xs md:text-sm font-mono text-[#D84040]/80 tracking-[0.2em] uppercase font-bold block"
              >
                {currentMessage}
              </motion.span>
            </div>

            {/* Massive modern percentage counter */}
            <div className="relative leading-none">
              <h2 className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-white flex items-center justify-center">
                {String(Math.floor(progress)).padStart(3, "0")}
                <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-white/40 ml-4 uppercase">
                  % BOOTED
                </span>
              </h2>
            </div>
          </div>

          {/* Bottom Bar: Loading track line */}
          <div className="relative z-10 space-y-6 w-full">
            {/* Glowing Ultra-thin Progress Line */}
            <div className="max-w-xl mx-auto w-full h-[2px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-[#D84040] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* System Status Indicators */}
            <div className="flex justify-between items-end text-[9px] md:text-[10px] font-mono text-white/40">
              <div className="flex gap-6">
                <div>
                  <span className="block text-white/20 mb-1">STABLE VERSION</span>
                  <span className="text-white/60">NODE_ENV: PRODUCTION</span>
                </div>
                <div className="hidden sm:block">
                  <span className="block text-white/20 mb-1">NETWORK STATUS</span>
                  <span className="text-emerald-500 font-bold">ONLINE // 200 OK</span>
                </div>
              </div>
              <div>
                <span className="block text-white/20 text-right mb-1">SYSTEM BOOTSTRAP</span>
                <span className="text-white/60">INITIALIZING SUBROUTINES</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}