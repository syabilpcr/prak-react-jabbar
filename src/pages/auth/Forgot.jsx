import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, Dumbbell } from "lucide-react";

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

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image with simple title */}
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[500px]">
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
                Bersama Menuju Tubuh Ideal
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#8E1616]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send size={28} className="text-[#8E1616]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1D1616]">
              Atur Ulang Kata Sandi
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Masukkan email terdaftar Anda
            </p>
          </div>

          {error && (
            <div className="bg-red-50 mb-5 p-4 text-sm text-red-600 rounded-xl flex items-center gap-2 border border-red-200">
              <span>⚠️</span> {error}
            </div>
          )}

          {sent ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-200">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold text-lg">
                Tautan atur ulang dikirim!
              </p>
              <p className="text-sm mt-2">
                Ke <strong className="text-green-800">{email}</strong>
              </p>
              <p className="text-xs mt-3 text-gray-500">
                Silakan periksa kotak masuk atau folder spam Anda
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 mt-6 text-sm bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
              >
                <ArrowLeft size={16} /> Kembali ke Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all"
                    placeholder="anda@example.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Kami akan mengirimkan tautan reset ke email ini
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md shadow-[#8E1616]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={16} /> Kirim Tautan Atur Ulang
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link
              to="/login"
              className="text-[#8E1616] hover:text-[#D84040] font-semibold transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}