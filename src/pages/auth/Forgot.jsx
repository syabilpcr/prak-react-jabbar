import { useState } from "react";
import { Link } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1D1616] mb-2 text-center">
        Lupa Kata Sandi?
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur
        ulang kata sandi
      </p>
      {sent ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center border border-green-200">
          ✅ Tautan atur ulang dikirim ke <strong>{email}</strong>
          <p className="text-xs mt-2">Silakan periksa kotak masuk Anda</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
              placeholder="anda@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-300"
          >
            Kirim Tautan Atur Ulang
          </button>
        </form>
      )}
      <p className="text-center text-sm text-gray-500 mt-6">
        Ingat kata sandi Anda?{" "}
        <Link to="/login" className="text-[#8E1616] hover:text-[#8E1616]/80">
          Masuk
        </Link>
      </p>
    </div>
  );
}
