import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
      if (form.email && form.password) navigate("/");
      else setError("Silakan masukkan email dan password");
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1D1616] mb-6 text-center">
        Selamat Datang Kembali 👋
      </h2>
      {error && (
        <div className="bg-red-50 mb-5 p-4 text-sm text-red-600 rounded-xl flex items-center gap-2 border border-red-200">
          ⚠️ {error}
        </div>
      )}
      {loading && (
        <div className="bg-gray-100 mb-5 p-4 text-sm text-gray-600 rounded-xl flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#8E1616] border-t-transparent rounded-full animate-spin"></div>{" "}
          Memproses...
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Email
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
            placeholder="admin@zeusgym.com"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kata Sandi
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
            placeholder="••••••••"
          />
        </div>
        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded border-gray-300" /> Ingat
            saya
          </label>
          <Link
            to="/forgot"
            className="text-sm text-[#8E1616] hover:text-[#8E1616]/80"
          >
            Lupa Kata Sandi?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-300"
        >
          Masuk ke Dashboard
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Belum punya akun?{" "}
        <Link to="/register" className="text-[#8E1616] hover:text-[#8E1616]/80">
          Daftar
        </Link>
      </p>
    </div>
  );
}
