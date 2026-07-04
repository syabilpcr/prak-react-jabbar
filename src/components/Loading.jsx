import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";

export default function Loading({ onFinish, minDuration = 5000 }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Menyiapkan Sistem Zeus Gym");
  useEffect(() => {
    const startTime = Date.now();
    let animationFrameId;
    let timeoutId;

    const loadingMessages = [
      "Menyiapkan Sistem Zeus Gym",
      "Memuat Data Anggota...",
      "Menyinkronkan Pembayaran...",
      "Memeriksa Absensi Hari Ini...",
      "Memuat Laporan Terbaru...",
      "Mempersiapkan Dashboard...",
      "Hampir Selesai...",
      "Selamat Datang di Zeus Gym! "
    ];

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      let percentage = Math.min((elapsed / minDuration) * 100, 100);
      
      setProgress(percentage);

      // Update message based on progress
      const messageIndex = Math.min(
        Math.floor(percentage / (100 / loadingMessages.length)),
        loadingMessages.length - 1
      );
      setLoadingText(loadingMessages[messageIndex]);

      if (percentage < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // Sudah 100%
        // Beri waktu 500ms untuk menampilkan 100%
        timeoutId = setTimeout(() => {
          if (onFinish) {
            console.log("Loading 100% selesai, memanggil onFinish");
            onFinish();
          }
        }, 500);
      }
    };

    // Mulai animasi
    animationFrameId = requestAnimationFrame(updateProgress);

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [minDuration, onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D1616] via-[#8E1616] to-[#D84040] flex items-center justify-center overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-[#D84040]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-[#D84040]/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s", top: "20%", right: "10%" }}></div>

      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" style={{ animation: "spin 8s linear infinite" }}></div>
      <div className="absolute bottom-10 right-10 w-52 h-52 border border-white/10 rounded-full" style={{ animation: "spin 12s linear infinite reverse" }}></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Logo Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-3xl bg-white/10 blur-xl animate-ping"></div>
          <div className="absolute inset-[-8px] rounded-3xl bg-[#D84040]/20 blur-md animate-pulse"></div>

          {/* Main Box */}
          <div className="relative w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl border-2 border-white/30" style={{ animation: "spin 4s linear infinite" }}></div>
            <div 
              className="w-24 h-24 rounded-2xl bg-[#D84040] flex items-center justify-center shadow-lg shadow-[#D84040]/50"
              style={{
                animation: "bounce 1.2s ease-in-out infinite"
              }}
            >
              <Dumbbell size={42} className="text-white" style={{ animation: "shake 0.5s ease-in-out infinite" }} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-5xl font-black tracking-[0.35em] text-white drop-shadow-lg">
          ZEUS
          <span className="text-[#D84040]">GYM</span>
        </h1>

        <p className="text-white/70 text-sm mt-3 tracking-[0.3em] uppercase">
          Gym Management System
        </p>

        {/* Progress Bar */}
        <div className="w-80 relative mt-12">
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#D84040] via-white to-[#D84040] rounded-full transition-all duration-100 ease-linear relative"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 10px rgba(216, 64, 64, 0.5)"
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: "shimmer 1.5s ease-in-out infinite" }}></div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="absolute -top-2 w-full flex justify-between px-1">
            {[0, 25, 50, 75, 100].map((step) => (
              <div
                key={step}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  progress >= step ? "bg-white shadow-lg" : "bg-white/30"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="flex justify-between items-center w-80 mt-4">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <div className="relative w-4 h-4">
              <div className="absolute inset-0 border-2 border-white/20 border-t-[#D84040] rounded-full animate-spin"></div>
              {progress >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <span className="font-medium">
              {progress >= 100 ? "Selesai!" : "Memuat Dashboard..."}
            </span>
          </div>

          <div className="relative">
            <span className="text-white font-bold text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {Math.floor(progress)}%
            </span>
            {progress >= 100 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-10 text-center min-h-[100px]">
          <p className="text-white/90 text-sm tracking-widest uppercase font-medium transition-all duration-300">
            {loadingText}
          </p>

          {/* Animated Dots */}
          {progress < 100 && (
            <div className="flex justify-center gap-2 mt-4">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s", animationDuration: "1.4s" }}></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "1.4s" }}></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s", animationDuration: "1.4s" }}></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.6s", animationDuration: "1.4s" }}></span>
            </div>
          )}
          
          {/* Completion Animation */}
          {progress >= 100 && (
            <div className="mt-4" style={{ animation: "fadeInUp 0.5s ease-out forwards" }}>
              <p className="text-green-400 text-xs font-bold flex items-center justify-center gap-2">
                <span>✓</span> Load Complete!
                <span>✓</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}