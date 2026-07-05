import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Dumbbell } from "lucide-react";
import api from "../../lib/api";
import Loading from "../../components/Loading";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showAdminLoading, setShowAdminLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/user", {
        params: {
          email: `eq.${form.email}`,
          password: `eq.${form.password}`,
        },
      });

      const user = res.data[0];

      if (user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id_user,
            name: user.nama_lengkap,
            email: user.email,
            phone: user.no_hp,
            role: user.role,
          }),
        );

        if (user.role === "member") {
          navigate("/member");
        } else {
          setShowAdminLoading(true);
        }
      } else {
        setError("Email atau kata sandi salah");
      }
    } catch (err) {
      console.error("Gagal login:", err);
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  if (showAdminLoading) {
    return (
      <Loading
        minDuration={3500}
        onFinish={() => navigate("/dashboard")}
      />
    );
  }

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
              ZEUS GYM
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-[9px] uppercase tracking-[1.5px] text-[#FFF0C4]/40 font-semibold mt-0.5"
            >
              SYSTEM AUTHENTICATION
            </motion.p>
          </div>
        </div>

        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-[#D84040]/10 border border-[#D84040]/20 text-[#D84040] text-xs font-semibold px-4 py-3 rounded-xl text-center animate-shake"
          >
            {error}
          </motion.div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.12em]">
              Alamat Email
            </label>
            <div className="relative flex items-center">
              <Mail size={14} className="absolute left-3.5 text-white/30 pointer-events-none" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/10 focus:outline-none focus:border-[#D84040] focus:ring-1 focus:ring-[#D84040]/30 transition-all duration-300"
                placeholder="nama@email.com"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.12em]">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock size={14} className="absolute left-3.5 text-white/30 pointer-events-none" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/10 focus:outline-none focus:border-[#D84040] focus:ring-1 focus:ring-[#D84040]/30 transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex justify-between items-center text-[10px] text-white/40 font-semibold"
          >
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                className="rounded border-white/10 bg-white/[0.02] accent-[#D84040]"
              />
              INGAT SAYA
            </label>
            <Link
              to="/forgot"
              className="hover:text-[#D84040] transition-colors tracking-wide"
            >
              LUPA SANDI?
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D84040] hover:bg-[#c43232] text-white font-bold text-xs uppercase tracking-[0.08em] py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md shadow-[#D84040]/10 hover:shadow-[#D84040]/25 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-[10px] text-white/30 font-bold uppercase tracking-wider"
        >
          Belum memiliki akun?{" "}
          <Link
            to="/register"
            className="text-[#D84040] hover:text-[#ff5c5c] font-black transition-colors ml-1"
          >
            Daftar
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
