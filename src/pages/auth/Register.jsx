import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  QrCode,
  UserPlus,
  Send,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Form Registrasi, 2: OTP Verification
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Kirim OTP ke nomor telepon
  const sendOTP = async (phoneNumber) => {
    // Generate OTP 6 digit
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Tampilkan OTP via Alert (untuk testing)
    alert(`🔐 KODE OTP ANDA: ${otpCode}\n\nKode ini akan dikirim ke ${phoneNumber}\nBerlaku selama 5 menit`);
    
    // Simpan ke localStorage
    localStorage.setItem("otp_temp", otpCode);
    localStorage.setItem("otp_phone", phoneNumber);
    localStorage.setItem("otp_expiry", Date.now() + 5 * 60 * 1000); // 5 menit
    
    return otpCode;
  };

  const handleSubmitRegistration = async (e) => {
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

    // Cek apakah email sudah terdaftar
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.email === form.email)) {
      setError("Email sudah terdaftar. Silakan gunakan email lain.");
      setLoading(false);
      return;
    }

    // Cek apakah nomor HP sudah terdaftar
    if (users.some(u => u.phone === form.phone)) {
      setError("Nomor telepon sudah terdaftar. Silakan gunakan nomor lain.");
      setLoading(false);
      return;
    }

    try {
      // Kirim OTP ke nomor telepon
      await sendOTP(form.phone);
      
      // Simpan data user sementara
      setUserData({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      
      // Pindah ke step OTP verification
      setStep(2);
    } catch (err) {
      setError("Gagal mengirim kode OTP. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-[700px]">
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
                Mulai Perjalanan Kebugaran Anda
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white overflow-y-auto max-h-[90vh]">
          {step === 1 ? (
            // Step 1: Registration Form
            <>
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

              <form onSubmit={handleSubmitRegistration}>
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
                  <p className="text-[10px] text-gray-400 mt-1">
                    Kode OTP akan dikirim ke nomor ini
                  </p>
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
                      <Send size={16} /> Kirim Kode OTP
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
            </>
          ) : (
            // Step 2: OTP Verification
            <OTPVerification
              phoneNumber={form.phone}
              userData={userData}
              onSuccess={() => {
                // Registrasi berhasil, simpan data user ke database
                const users = JSON.parse(localStorage.getItem("users") || "[]");
                const newUser = {
                  id: Date.now(),
                  ...userData,
                  role: "member",
                  createdAt: new Date().toISOString(),
                };
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                
                // Tampilkan pesan sukses
                alert("✅ Pendaftaran berhasil! Silakan login dengan akun Anda.");
                
                // Arahkan ke halaman login
                navigate("/login");
              }}
              onBack={() => {
                setStep(1);
                setError("");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Komponen OTP Verification
function OTPVerification({ phoneNumber, userData, onSuccess, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Timer untuk resend OTP
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus ke input berikutnya
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Masukkan kode OTP 6 digit");
      return;
    }

    setLoading(true);
    setError("");

    // Simulasi verifikasi OTP
    setTimeout(() => {
      const storedOTP = localStorage.getItem("otp_temp");
      const storedPhone = localStorage.getItem("otp_phone");
      const expiry = localStorage.getItem("otp_expiry");

      if (!storedOTP || !storedPhone) {
        setError("Sesi verifikasi kadaluarsa. Silakan daftar ulang.");
        setLoading(false);
        return;
      }

      if (Date.now() > parseInt(expiry)) {
        setError("Kode OTP sudah kadaluarsa. Silakan minta ulang.");
        setLoading(false);
        return;
      }

      if (otpCode === storedOTP && phoneNumber === storedPhone) {
        // Hapus OTP sementara
        localStorage.removeItem("otp_temp");
        localStorage.removeItem("otp_phone");
        localStorage.removeItem("otp_expiry");
        
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError("Kode OTP salah. Silakan coba lagi.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    
    // Generate OTP baru
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Tampilkan OTP via Alert
    alert(`🔐 KODE OTP BARU: ${otpCode}\n\nKode ini akan dikirim ke ${phoneNumber}\nBerlaku selama 5 menit`);
    
    localStorage.setItem("otp_temp", otpCode);
    localStorage.setItem("otp_expiry", Date.now() + 5 * 60 * 1000);
    
    setTimer(60);
    setCanResend(false);
    setLoading(false);
    
    // Reset OTP input
    setOtp(["", "", "", "", "", ""]);
    
    // Fokus ke input pertama
    document.getElementById("otp-0")?.focus();
    
    // Mulai timer lagi
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Auto focus input pertama saat komponen mount
  useEffect(() => {
    document.getElementById("otp-0")?.focus();
  }, []);

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Verifikasi Berhasil!</h2>
        <p className="text-gray-500">Mengalihkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#8E1616]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <QrCode size={28} className="text-[#8E1616]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1D1616]">
          Verifikasi Nomor Telepon
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Masukkan kode OTP yang dikirim ke
        </p>
        <p className="text-[#8E1616] font-semibold text-sm mt-1">
          {phoneNumber}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 mb-4 p-3 text-sm text-red-600 rounded-xl flex items-center gap-2 border border-red-200">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          Kode Verifikasi (6 Digit)
        </label>
        <div className="flex gap-2 justify-center">
          {otp.map((_, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all"
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#8E1616]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm mb-3"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <QrCode size={16} /> Verifikasi & Daftar
          </>
        )}
      </button>

      <div className="text-center">
        {canResend ? (
          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="text-sm text-[#8E1616] hover:text-[#D84040] transition-colors"
          >
            Kirim Ulang Kode OTP
          </button>
        ) : (
          <p className="text-sm text-gray-400">
            Kirim ulang kode dalam {timer} detik
          </p>
        )}
      </div>

      <button
        onClick={onBack}
        className="w-full mt-4 border border-gray-200 text-gray-600 font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors text-sm"
      >
        ← Kembali ke Form Pendaftaran
      </button>
    </>
  );
}659025