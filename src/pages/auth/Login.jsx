import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Dumbbell } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      // Ambil data user dari localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.email === form.email && u.password === form.password
      );

      if (user) {
        // Simpan session user
        localStorage.setItem("currentUser", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        }));
        navigate("/");
      } else {
        setError("Email atau kata sandi salah");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px]">
          <img
            src="https://i1-e.pinimg.com/1200x/b7/42/97/b74297bf782830d55728bbd3722971ed.jpg"
            alt="Zeus Gym"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616]/60 to-[#1D1616]/20 flex flex-col justify-between items-center text-white p-8">
            <div className="relative z-10 text-center mt-8"></div>
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg tracking-wide">
                ZEUS GYM
              </h2>
              <p className="text-white/80 text-sm drop-shadow">
                Pusat Kebugaran Premium
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#8E1616]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn size={28} className="text-[#8E1616]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1D1616]">
              Selamat Datang Kembali
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Silakan masuk ke akun Anda
            </p>
          </div>

          {error && (
            <div className="bg-red-50 mb-5 p-4 text-sm text-red-600 rounded-xl flex items-center gap-2 border border-red-200">
              <span>⚠️</span> {error}
            </div>
          )}

          {loading && (
            <div className="bg-gray-100 mb-5 p-4 text-sm text-gray-600 rounded-xl flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#8E1616] border-t-transparent rounded-full animate-spin"></div>
              Memproses...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all"
                  placeholder="admin@zeusgym.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all"
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
              className="w-full bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md shadow-[#8E1616]/30"
            >
              Masuk ke Dashboard
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