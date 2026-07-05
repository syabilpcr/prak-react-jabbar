// src/pages/MemberDetail.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import membersData from "../data/membersData";
import Badge from "../components/Badge";

const statusConfig = {
  Active: { type: "success", label: "Aktif" },
  aktif: { type: "success", label: "Aktif" },
  Expired: { type: "danger", label: "Tidak Aktif" },
  "tidak aktif": { type: "danger", label: "Tidak Aktif" },
  Expiring: { type: "warning", label: "Segera Berakhir" },
};

const getAvatarGradient = (char) => {
  const code = char ? char.toUpperCase().charCodeAt(0) : 65;
  if (code % 4 === 0) return "from-[#8C1007] to-[#D84040]";
  if (code % 4 === 1) return "from-[#1D1616] to-[#3E0703]";
  if (code % 4 === 2) return "from-[#6B00D7] to-[#9B59B6]";
  return "from-[#0D4F4F] to-[#1A8A8A]";
};

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const found = membersData.find((m) => m.id === parseInt(id));

    // hindari setState synchronously dalam effect body (react-hooks/set-state-in-effect)
    queueMicrotask(() => {
      if (!found) {
        setError(`Member dengan ID ${id} tidak ditemukan.`);
      } else {
        setMember(found);
      }
    });
  }, [id]);


  if (error)
    return (
      <div className="p-6 w-full">
        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 text-center max-w-xl mx-auto">
          <p className="text-rose-700 text-sm font-medium">{error}</p>
          <button
            onClick={() => navigate("/members")}
            className="mt-4 flex items-center gap-2 bg-[#8C1007] text-white px-4 py-2 rounded-xl text-xs font-semibold mx-auto hover:bg-[#a01a0a] transition-all"
          >
            <ArrowLeft size={14} /> Kembali ke Members
          </button>
        </div>
      </div>
    );

  if (!member)
    return (
      <div className="p-6 flex items-center justify-center min-h-[40vh] w-full">
        <div className="w-6 h-6 border-2 border-[#8C1007] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const nama = member.nama_lengkap || member.name;
  const statusCfg = statusConfig[member.status_member] || statusConfig[member.status] || statusConfig.Active;
  const gradient = getAvatarGradient(nama?.charAt(0));

  // Info items untuk grid
  const personalInfo = [
    { label: "ID Member", value: member.id_member || member.code, mono: true },
    { label: "Nama Lengkap", value: nama },
    { label: "Jenis Kelamin", value: member.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan" },
    { label: "Tanggal Lahir", value: member.tgl_lahir || "-" },
    { label: "No. Handphone", value: member.no_hp || member.phone },
    { label: "Alamat", value: member.alamat || "-", wide: true },
  ];

  const membershipInfo = [
    { label: "Tanggal Gabung", value: member.tgl_gabung || member.joined },
    { label: "Tanggal Berakhir", value: member.tgl_berakhir || member.expiry },
    { label: "Status Member", value: member.status_member || member.status, badge: true },
    { label: "Pin Akses", value: member.pin_akses || "-", mono: true, highlight: true },
  ];

  const emergencyInfo = [
    { label: "Catatan Medis", value: member.catatan_medis || "Tidak ada" },
    { label: "Kontak Darurat", value: member.kontak_darurat || "-", mono: true },
    { label: "Nama Kontak Darurat", value: member.nama_kontak_darurat || "-" },
  ];

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen w-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between animate-slide-down">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">Detail Anggota</h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Informasi lengkap member {member.id_member || member.code}
          </p>
        </div>
        <button
          onClick={() => navigate("/members")}
          className="inline-flex items-center gap-2 font-semibold bg-white hover:bg-[#f8f3ee] text-[#5a3030] border border-[#e8dfd6] px-4 py-2.5 text-sm rounded-xl transition-all hover:scale-[1.02] shadow-sm hover:shadow"
        >
          <ArrowLeft size={15} />
          Kembali
        </button>
      </div>

      {/* ── Hero Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-slide-up delay-75 shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Top accent bar */}
        <div className={`h-24 bg-gradient-to-r ${gradient} relative`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
        </div>
        
        <div className="px-8 pb-6 -mt-10 relative">
          <div className="flex items-end gap-5">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg animate-bounce-in`}>
              {nama ? nama.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "MB"}
            </div>
            
            <div className="flex-1 pt-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1D1616]">{nama}</h2>
                  <p className="text-sm text-[#9e7a6e] font-mono mt-0.5">{member.id_member || member.code}</p>
                </div>
                <Badge type={statusCfg.type} dot className="animate-pulse-ring">{statusCfg.label}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Data Pribadi ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-slide-up delay-100 hover-lift" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 className="text-sm font-bold text-[#1D1616] mb-5 pb-3 border-b border-gray-100">
          Data Pribadi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {personalInfo.map((item) => (
            <div key={item.label} className={item.wide ? "md:col-span-2" : ""}>
              <p className="text-[10px] text-[#9e7a6e] uppercase font-bold tracking-wider mb-1">{item.label}</p>
              <p className={`text-sm text-[#1D1616] font-semibold ${item.mono ? "font-mono" : ""}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Keanggotaan ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-slide-up delay-150 hover-lift" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 className="text-sm font-bold text-[#1D1616] mb-5 pb-3 border-b border-gray-100">
          Informasi Keanggotaan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {membershipInfo.map((item) => (
            <div key={item.label}>
              <p className="text-[10px] text-[#9e7a6e] uppercase font-bold tracking-wider mb-1">{item.label}</p>
              {item.badge ? (
                <Badge type={statusCfg.type} dot>{item.value}</Badge>
              ) : (
                <p className={`text-sm font-medium ${item.highlight ? "text-[#8C1007] text-lg font-black font-mono animate-glow-text" : "text-[#1D1616] font-semibold"} ${item.mono && !item.highlight ? "font-mono" : ""}`}>
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Medis & Darurat ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-slide-up delay-200 hover-lift" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 className="text-sm font-bold text-[#1D1616] mb-5 pb-3 border-b border-gray-100">
          Catatan Medis & Kontak Darurat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          {emergencyInfo.map((item) => (
            <div key={item.label}>
              <p className="text-[10px] text-[#9e7a6e] uppercase font-bold tracking-wider mb-1">{item.label}</p>
              <p className={`text-sm text-[#1D1616] font-semibold ${item.mono ? "font-mono" : ""}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
