import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Silakan masukkan alamat email");
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  };

  // Animation variants for 21dev look
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Background Decorative Rings/Blobs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#D84040]/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#D84040]/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#0b0b0d]/80 backdrop-blur-md border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(216,64,64,0.06)] relative z-10 space-y-7"
      >
        {/* Header Section */}
        <div className="text-center space-y-3">
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center justify-center w-11 h-11 bg-[#8C1007] rounded-xl shadow-lg shadow-[#8C1007]/20 flex-shrink-0"
          >
            <Dumbbell size={18} className="text-[#FFF0C4] rotate-45" />
          </motion.div>
          
          <div className="space-y-1">
            <motion.h1 
              variants={itemVariants}
              className="text-xl font-black uppercase tracking-tight text-[#FFF0C4] leading-tight"
            >
              LUPA KATA SANDI
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-[9px] uppercase tracking-[1.5px] text-[#FFF0C4]/40 font-semibold mt-0.5"
            >
              ZEUS GYM ACCOUNT RECOVERY
            </motion.p>
          </div>
        </div>

        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-[#D84040]/10 border border-[#D84040]/20 text-[#D84040] text-xs font-semibold px-4 py-3 rounded-xl text-center"
          >
            {error}
          </motion.div>
        )}

        {sent ? (
          <motion.div 
            variants={itemVariants}
            className="bg-[#D84040]/5 border border-[#D84040]/20 p-6 rounded-2xl text-center space-y-4"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Tautan Atur Ulang Dikirim!
              </p>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Tautan untuk mengatur ulang kata sandi Anda telah dikirim ke <strong className="text-white">{email}</strong>.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block text-[10px] font-black uppercase tracking-wider bg-white text-black px-6 py-3.5 rounded-xl hover:bg-[#D84040] hover:text-white transition-all cursor-pointer shadow-md"
            >
              Kembali ke Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.12em]">
                Masukkan Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/10 focus:outline-none focus:border-[#D84040] focus:ring-1 focus:ring-[#D84040]/30 transition-all duration-300"
                placeholder="nama@email.com"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D84040] hover:bg-[#c43232] text-white font-bold text-xs uppercase tracking-[0.08em] py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md shadow-[#D84040]/10 hover:shadow-[#D84040]/25 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Memproses..." : "Kirim Tautan Pemulihan"}
              </button>
              
              <Link
                to="/login"
                className="block text-center text-[10px] text-white/40 hover:text-white transition-colors uppercase font-black tracking-[0.15em] pt-3"
              >
                Kembali ke Login
              </Link>
            </motion.div>
          </form>
        )}
      </motion.div>
    </div>
  );
}