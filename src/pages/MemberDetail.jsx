// src/pages/MemberDetail.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  Heart, 
  DollarSign, 
  Key, 
  Sparkles,
  Cake,
  Activity,
  AlertCircle
} from "lucide-react";
import api from "../lib/api";
import Badge from "../components/Badge";

const statusConfig = {
  Active: { type: "success", label: "Aktif", bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  aktif: { type: "success", label: "Aktif", bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  Expired: { type: "danger", label: "Tidak Aktif", bg: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  "tidak aktif": { type: "danger", label: "Tidak Aktif", bg: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  Expiring: { type: "warning", label: "Segera Berakhir", bg: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
};

const getAvatarGradient = (char) => {
  const code = char ? char.toUpperCase().charCodeAt(0) : 65;
  if (code % 4 === 0) return "from-rose-600 to-red-500";
  if (code % 4 === 1) return "from-zinc-800 to-zinc-900";
  if (code % 4 === 2) return "from-indigo-600 to-purple-600";
  return "from-teal-600 to-emerald-500";
};

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const idMember = decodeURIComponent(id);
        const res = await api.get("/member", {
          params: {
            id_member: `eq.${idMember}`,
            limit: 1,
          },
        });

        if (!res.data || res.data.length === 0) {
          setError(`Member dengan ID "${idMember}" tidak ditemukan.`);
        } else {
          setMember(res.data[0]);
        }
      } catch (err) {
        console.error("Gagal mengambil detail member:", err);
        setError("Gagal memuat data member dari server. Periksa koneksi atau konfigurasi API.");
      }
    };

    fetchMember();
  }, [id]);

  const copyPin = (pin) => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error)
    return (
      <div className="p-6 w-full min-h-screen bg-[#f8f6f2] flex items-center justify-center">
        <div className="bg-white border border-rose-100 rounded-3xl p-8 text-center max-w-md mx-auto shadow-xl hover-lift">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Oops! Ada Masalah</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate("/members")}
            className="flex items-center justify-center gap-2 w-full bg-[#8C1007] text-white px-5 py-3 rounded-2xl text-xs font-semibold hover:bg-[#a01a0a] transition-all shadow-md"
          >
            <ArrowLeft size={14} /> Kembali ke Anggota
          </button>
        </div>
      </div>
    );

  if (!member)
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh] w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#8C1007] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-400 tracking-wider">MEMUAT DETAIL...</p>
        </div>
      </div>
    );

  const nama = member.nama_lengkap || member.name;
  const statusCfg = statusConfig[member.status_member] || statusConfig[member.status] || statusConfig.Active;
  const gradient = getAvatarGradient(nama?.charAt(0));

  // Menghitung sisa hari keanggotaan
  const getRemainingDays = (expiry) => {
    if (!expiry) return null;
    const diff = new Date(expiry) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  const remainingDays = getRemainingDays(member.tgl_berakhir);

  return (
    <div className="p-6 bg-[#f8f6f2] min-h-screen w-full font-sans antialiased text-[#1D1616]">
      {/* ── Breadcrumb & Header ── */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] font-bold text-[#8C1007] uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full">
            Profil Member Zeus Gym
          </span>
          <h1 className="text-2xl font-black text-[#1D1616] mt-2">Detail Informasi Anggota</h1>
        </div>
        <button
          onClick={() => navigate("/members")}
          className="inline-flex items-center justify-center gap-2 font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 px-4 py-2.5 text-xs rounded-2xl transition-all shadow-sm active:scale-95 w-fit"
        >
          <ArrowLeft size={14} />
          Kembali ke Daftar
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Column: Profile Card ── */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main Profile Info Card */}
          <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Header Gradient */}
            <div className={`h-28 bg-gradient-to-r ${gradient} relative flex items-center justify-center overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40" />
            </div>

            {/* Profile Picture & Badges */}
            <div className="px-6 pb-6 text-center relative -mt-14">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white shadow-xl mx-auto transform transition-transform duration-300 hover:scale-105`}>
                {nama ? nama.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "MB"}
              </div>

              <h2 className="text-xl font-extrabold text-gray-900 mt-4 leading-tight">{nama}</h2>
              <p className="text-xs font-mono text-gray-400 mt-1 tracking-wider">{member.id_member || member.code}</p>

              <div className="flex justify-center mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusCfg.bg}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {statusCfg.label}
                </span>
              </div>

              {/* Progress Keanggotaan */}
              {member.tgl_berakhir && (
                <div className="mt-6 pt-5 border-t border-gray-150">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-gray-400 font-medium">Sisa Keanggotaan</span>
                    <span className="font-bold text-gray-900">{remainingDays} Hari</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${remainingDays > 7 ? 'from-emerald-500 to-teal-400' : 'from-rose-500 to-red-400'}`} 
                      style={{ width: `${Math.min(100, Math.max(0, (remainingDays / 30) * 100))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access Credentials Card */}
          <div className="bg-white rounded-3xl border border-gray-100/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Key size={14} className="text-[#8C1007]" /> Kredensial Akses
            </h3>
            
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">PIN Akses Gym</p>
                <p className="text-lg font-black font-mono tracking-widest text-[#8C1007] mt-0.5">{member.pin_akses || "-"}</p>
              </div>
              <button 
                onClick={() => copyPin(member.pin_akses)}
                className="px-3 py-1.5 bg-white text-xs font-bold text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                {copied ? "Tersalin!" : "Salin"}
              </button>
            </div>
          </div>

        </div>

        {/* ── Right Column: Detail Information Panel ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Personal Details */}
          <div className="bg-white rounded-3xl border border-gray-100/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
              <User size={14} className="text-[#8C1007]" /> Informasi Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
              
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-red-50 text-[#8C1007] rounded-xl flex-shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Jenis Kelamin</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {member.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-red-50 text-[#8C1007] rounded-xl flex-shrink-0">
                  <Cake size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tanggal Lahir</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{member.tgl_lahir || "-"}</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-red-50 text-[#8C1007] rounded-xl flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">No. Handphone</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{member.no_hp || member.phone}</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start md:col-span-2">
                <div className="p-2.5 bg-red-50 text-[#8C1007] rounded-xl flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Alamat Tinggal</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-relaxed">{member.alamat || "-"}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Card: Membership Information */}
          <div className="bg-white rounded-3xl border border-gray-100/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
              <Sparkles size={14} className="text-[#8C1007]" /> Detail Keanggotaan & Finansial
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
              
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-red-50 text-[#8C1007] rounded-xl flex-shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Mulai Bergabung</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{member.tgl_gabung || member.joined}</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-red-50 text-[#8C1007] rounded-xl flex-shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Berakhir Pada</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{member.tgl_berakhir || member.expiry}</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-red-50 text-[#8C1007] rounded-xl flex-shrink-0">
                  <DollarSign size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Kontribusi Biaya</p>
                  <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                    Rp {(member.total_nominal_transaksi || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Card: Emergency Contact & Medical Notes */}
          <div className="bg-white rounded-3xl border border-gray-100/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
              <ShieldAlert size={14} className="text-[#8C1007]" /> Catatan Medis & Kontak Darurat
            </h3>
            
            <div className="space-y-4">
              
              {/* Medical Record */}
              <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10 flex gap-3.5 items-start">
                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                  <Activity size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Riwayat Medis / Alergi</h4>
                  <p className="text-sm text-amber-900/80 font-medium mt-1 leading-relaxed">
                    {member.catatan_medis || "Tidak ada catatan medis khusus."}
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-rose-500/5 rounded-2xl p-4 border border-rose-500/10 flex gap-3.5 items-start">
                <div className="p-2 bg-rose-500/10 text-rose-600 rounded-lg">
                  <Heart size={18} />
                </div>
                <div className="w-full">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide">Kontak Darurat Utama</h4>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-2">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nama Kontak</p>
                      <p className="text-sm font-semibold text-gray-900">{member.nama_kontak_darurat || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nomor HP Kontak</p>
                      <p className="text-sm font-mono font-bold text-gray-900">{member.kontak_darurat || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
