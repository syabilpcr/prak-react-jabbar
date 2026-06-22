import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Dumbbell } from "lucide-react";
import Button from "../../components/Button";
import api from "../../lib/api";

// UI Components dari folder ui
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ── Tugas: Login langsung ke Supabase (bukan dummy/localStorage) ──
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
        // Simpan session user (tanpa password) di localStorage
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

        // ── Routing berdasarkan role ──
        // role "member" → area member; role lain (admin/staff/trainer) → dashboard admin
        if (user.role === "member") {
          navigate("/member");
        } else {
          navigate("/");
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

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px] overflow-hidden">
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
                Selamat datang
                <br />
                kembali, juara.
              </h2>
              <p className="text-white/70 text-sm mt-4 max-w-xs leading-relaxed">
                Masuk untuk melanjutkan perjalanan kebugaranmu di Zeus Gym.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8 animate-slide-up">
            <div className="w-14 h-14 bg-[#8E1616]/10 rounded-2xl flex items-center justify-center mb-5">
              <LogIn size={26} className="text-[#8E1616]" />
            </div>
            <h2 className="text-2xl font-black text-[#1D1616] tracking-tight">
              Masuk ke akun
            </h2>
            <p className="text-gray-500 text-sm mt-1.5">
              Senang melihatmu lagi. Yuk lanjutkan.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <Alert variant="default" className="mb-5">
              <AlertDescription>Memproses...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="animate-slide-up" style={{ animationDelay: "80ms" }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8E1616] transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]/30 focus:border-[#8E1616] focus:bg-white transition-all"
                  placeholder="admin@zeusgym.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kata Sandi
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8E1616] transition-colors"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]/30 focus:border-[#8E1616] focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 accent-[#8E1616]"
                />
                Ingat saya
              </label>
              <Link
                to="/forgot"
                className="text-sm text-[#8E1616] hover:text-[#D84040] transition-colors"
              >
                Lupa Kata Sandi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md shadow-[#8E1616]/30 hover:shadow-lg hover:shadow-[#8E1616]/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
              {!loading && (
                <LogIn size={17} className="group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-[#8E1616] hover:text-[#D84040] font-semibold transition-colors"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
