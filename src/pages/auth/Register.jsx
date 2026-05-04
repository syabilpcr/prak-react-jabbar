import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  QrCode,
  UserPlus,
  Dumbbell,
} from "lucide-react";

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

    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image with simple title */}
        <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-[700px]">
          <img
            src="https://i1-e.pinimg.com/1200x/b7/42/97/b74297bf782830d55728bbd3722971ed.jpg"
            alt="Zeus Gym"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1616]/60 to-[#1D1616]/20 flex flex-col justify-between items-center text-white p-8">
            <div className="relative z-10 text-center mt-8">
            </div>
            
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg tracking-wide">
                ZEUS GYM
              </h2>
              <p className="text-white/80 text-sm drop-shadow">
                Mulai Perjalanan Kebugaran Anda
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white overflow-y-auto max-h-[90vh]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#8E1616]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus size={28} className="text-[#8E1616]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1D1616]">
              Buat Akun Baru
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Daftar dan dapatkan kode QR instan
            </p>
          </div>

          {error && (
            <div className="bg-red-50 mb-4 p-3 text-sm text-red-600 rounded-xl flex items-center gap-2 border border-red-200">
              <span>⚠️</span> {error}
            </div>
          )}

          {loading && (
            <div className="bg-gray-100 mb-4 p-3 text-sm text-gray-600 rounded-xl flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#8E1616] border-t-transparent rounded-full animate-spin"></div>
              Memproses pendaftaran...
            </div>
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
                  <QrCode size={16} /> Daftar & Dapatkan Kode QR
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