import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QrCode } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    if (form.password !== form.confirmPassword) {
      alert("Kata sandi tidak cocok");
      setLoading(false);
      return;
    }
    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1D1616] mb-2 text-center">
        Buat Akun Anda ✨
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Bergabung dengan Zeus Gym dan dapatkan kode QR instan
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Email
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
            placeholder="anda@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Telepon
          </label>
          <input
            type="tel"
            name="phone"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
            placeholder="081234567890"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kata Sandi
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Kata Sandi
          </label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-300 flex items-center justify-center gap-2"
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
      <p className="text-center text-sm text-gray-500 mt-6">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-[#8E1616] hover:text-[#8E1616]/80">
          Masuk
        </Link>
      </p>
    </div>
  );
}
