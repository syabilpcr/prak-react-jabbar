import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone, UserPlus, Send, Dumbbell } from "lucide-react";
import api from "../../lib/api";

// UI Components dari folder ui
import { Alert, AlertDescription } from "../../components/ui/alert";

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

  // ── Tugas: Pendaftaran langsung ke Supabase (bukan dummy/localStorage) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi
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
      // Cek apakah email sudah terdaftar di Supabase
      const existing = await api.get("/user", {
        params: { email: `eq.${form.email}` },
      });
      if (existing.data.length > 0) {
        setError("Email sudah terdaftar. Silakan gunakan email lain.");
        setLoading(false);
        return;
      }

      // Simpan user baru ke Supabase
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

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-[700px] overflow-hidden">
          <img
            src="https://i1-e.pinimg.com/1200x/b7/42/97/b74297bf782830d55728bbd3722971ed.jpg"
            alt="Zeus Gym"
            className="w-full h-full object-cover absolute inset-0 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616] via-[#1D1616]/55 to-[#1D1616]/30" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-[#8E1616]/40 rounded-full blur-[100px]" />
          <div className="relative z-10 h-full flex flex-col justify-between p-10 text-white">
            {/* Logo konsisten admin */}
            <div className="flex items-center gap-2.5 animate-slide-up">
              <div className="w-9 h-9 bg-[#8C1007] rounded-xl flex items-center justify-center shadow-lg">
                <Dumbbell size={16} className="text-[#FFF0C4]" />
              </div>
              <h1 className="text-[14px] font-black text-[#FFF0C4] tracking-tight">
                ZEUS GYM
              </h1>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "120ms" }}>
              <h2 className="text-4xl font-black leading-tight tracking-tight drop-shadow-lg">
                Mulai perjalanan
                <br />
                kebugaranmu.
              </h2>
              <p className="text-white/70 text-sm mt-4 max-w-xs leading-relaxed">
                Daftar sekarang dan jadi bagian dari komunitas Zeus Gym.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white overflow-y-auto max-h-[90vh] flex flex-col justify-center">
          <div className="mb-6 animate-slide-up">
            <div className="w-14 h-14 bg-[#8E1616]/10 rounded-2xl flex items-center justify-center mb-5">
              <UserPlus size={26} className="text-[#8E1616]" />
            </div>
            <h2 className="text-2xl font-black text-[#1D1616] tracking-tight">
              Buat akun baru
            </h2>
            <p className="text-gray-500 text-sm mt-1.5">
              Beberapa langkah lagi menuju versi terbaikmu.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all text-sm"
                  placeholder="anda@example.com"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all text-sm"
                  placeholder="081234567890"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Minimal 6 karakter
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#8E1616]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={16} /> Daftar Sekarang
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-[#8E1616] hover:text-[#D84040] font-semibold transition-colors"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
