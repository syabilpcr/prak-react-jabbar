import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Dumbbell } from "lucide-react";
import api from "../../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name.trim()) {
      setError("Nama lengkap harus diisi");
      setLoading(false);
      return;
    }

    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError("Email tidak valid");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Kata sandi tidak cocok");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      setLoading(false);
      return;
    }

    if (form.phone.length < 10 || form.phone.length > 13) {
      setError("Nomor telepon tidak valid (10-13 digit)");
      setLoading(false);
      return;
    }

    try {
      const existing = await api.get("/user", {
        params: { email: `eq.${form.email}` },
      });
      if (existing.data.length > 0) {
        setError("Email sudah terdaftar. Silakan gunakan email lain.");
        setLoading(false);
        return;
      }

      const newUser = {
        id_user: `U-${Date.now()}`,
        nama_lengkap: form.name,
        email: form.email,
        no_hp: form.phone,
        password: form.password,
        role: "member",
      };

      await api.post("/user", newUser, {
        headers: { Prefer: "return=representation" },
      });

      alert("✅ Pendaftaran berhasil! Silakan login dengan akun Anda.");
      navigate("/login");
    } catch (err) {
      console.error("Gagal mendaftar:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mendaftar. Periksa koneksi atau coba lagi.",
      );
    } finally {
      setLoading(false);
    }
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
        staggerChildren: 0.06
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
        className="bg-[#0b0b0d]/80 backdrop-blur-md border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(216,64,64,0.06)] relative z-10 space-y-6"
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
              DAFTAR AKUN
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-[9px] uppercase tracking-[1.5px] text-[#FFF0C4]/40 font-semibold mt-0.5"
            >
              ZEUS GYM REGISTRATION
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

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.12em]">
              Nama Lengkap
            </label>
            <div className="relative flex items-center">
              <User size={14} className="absolute left-3.5 text-white/30 pointer-events-none" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/10 focus:outline-none focus:border-[#D84040] focus:ring-1 focus:ring-[#D84040]/30 transition-all duration-300"
                placeholder="Nama Lengkap Anda"
                required
              />
            </div>
          </motion.div>

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
              Nomor Telepon
            </label>
            <div className="relative flex items-center">
              <Phone size={14} className="absolute left-3.5 text-white/30 pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/10 focus:outline-none focus:border-[#D84040] focus:ring-1 focus:ring-[#D84040]/30 transition-all duration-300"
                placeholder="0812xxxxxx"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.12em]">
                Sandi
              </label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3.5 text-white/30 pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/10 focus:outline-none focus:border-[#D84040] focus:ring-1 focus:ring-[#D84040]/30 transition-all duration-300"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.12em]">
                Konfirmasi
              </label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3.5 text-white/30 pointer-events-none" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder-white/10 focus:outline-none focus:border-[#D84040] focus:ring-1 focus:ring-[#D84040]/30 transition-all duration-300"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D84040] hover:bg-[#c43232] text-white font-bold text-xs uppercase tracking-[0.08em] py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md shadow-[#D84040]/10 hover:shadow-[#D84040]/25 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Memproses..." : "Daftar Akun"}
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-[10px] text-white/30 font-bold uppercase tracking-wider"
        >
          Sudah memiliki akun?{" "}
          <Link
            to="/login"
            className="text-[#D84040] hover:text-[#ff5c5c] font-black transition-colors ml-1"
          >
            Masuk
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
