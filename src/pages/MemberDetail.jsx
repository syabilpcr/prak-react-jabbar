// src/pages/MemberDetail.jsx
// Pertemuan 9 — Step 3: Halaman detail member menggunakan Dynamic Route + useParams

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Calendar, Clock, Phone } from "lucide-react";
import membersData from "../data/membersData";
import PageHeader from "../components/PageHeader";

// ── Konfigurasi warna badge tipis & elegan sesuai screenshot referensi ──
const planConfig = {
  Gold: {
    bg: "bg-[#FFFDF0]",
    text: "text-[#B37D14]",
    border: "border-[#FBEBB5]",
  },
  Silver: {
    bg: "bg-[#F4F7FA]",
    text: "text-[#4A5568]",
    border: "border-[#E2E8F0]",
  },
  Bronze: {
    bg: "bg-[#FFF6F0]",
    text: "text-[#C25E1A]",
    border: "border-[#FAD7C4]",
  },
};

const statusConfig = {
  Active: {
    bg: "bg-[#E6FBD9]",
    text: "text-[#1FA349]",
    dot: "bg-[#00C853]",
    border: "border-[#C1F4A6]",
  },
  Expired: {
    bg: "bg-[#FCE8E6]",
    text: "text-[#C53030]",
    dot: "bg-[#E53E3E]",
    border: "border-[#FEB8B8]",
  },
  Expiring: {
    bg: "bg-[#FFF3CD]",
    text: "text-[#856404]",
    dot: "bg-[#FFC107]",
    border: "border-[#FFEEBA]",
  },
};

// ── Background avatar inisial ──
const getAvatarStyle = (char) => {
  const code = char ? char.toUpperCase().charCodeAt(0) : 65;
  if (code % 3 === 0) return "bg-[#280B0B] text-[#FFD6D6]";
  if (code % 3 === 1) return "bg-[#6B00D7] text-[#F3E8FF]";
  return "bg-[#691200] text-[#FFEBE5]";
};

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const found = membersData.find((m) => m.id === parseInt(id));
    if (!found) {
      setError(`Member dengan ID ${id} tidak ditemukan.`);
    } else {
      setMember(found);
    }
  }, [id]);

  if (error)
    return (
      <div className="p-6 w-full">
        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 text-center max-w-xl mx-auto">
          <p className="text-rose-700 text-sm font-medium">{error}</p>
          <button
            onClick={() => navigate("/members")}
            className="mt-4 flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded-xl text-xs font-semibold mx-auto hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={14} /> Kembali ke Members
          </button>
        </div>
      </div>
    );

  if (!member)
    return (
      <div className="p-6 flex items-center justify-center min-h-[40vh] w-full">
        <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const pc = planConfig[member.plan] || planConfig.Bronze;
  const sc = statusConfig[member.status] || statusConfig.Active;
  const avatarClass = getAvatarStyle(member.name?.charAt(0));
  const visitPct = Math.min((member.visits / 100) * 100, 100);

  return (
    // PERBAIKAN: Menggunakan w-full agar mengisi seluruh ruang container layout utama dasbor
    <div className="space-y-6 w-full pb-8">
      {/* ── Page Header ── */}
      <PageHeader
        title="Detail Anggota"
        breadcrumb={["Manajemen", "Members", member.name]}
      >
        <button
          onClick={() => navigate("/members")}
          className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 font-medium px-4 py-1.5 rounded-xl hover:bg-gray-50 transition-all text-xs shadow-sm"
        >
          <ArrowLeft size={13} />
          Kembali
        </button>
      </PageHeader>

      {/* ── UTAMA: KARTU INDIVIDU (Memenuhi Lebar Layout Dasbor) ── */}
      <div className="bg-white border border-[#EBEBEB] rounded-[28px] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] space-y-6 relative overflow-hidden w-full">
        {/* Row 1: Avatar Profil, Nama, & Status Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-[15px] font-bold tracking-wider shrink-0 ${avatarClass}`}
            >
              {member.name
                ? member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "MB"}
            </div>

            <div className="space-y-0.5">
              <h2 className="text-[17px] font-bold text-[#111111] tracking-tight">
                {member.name}
              </h2>
              <p className="text-[11px] text-[#A0A0A0] font-semibold font-mono tracking-wide">
                {member.code}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {member.status}
          </span>
        </div>

        {/* Row 2: Informasi Detail Kontak */}
        <div className="space-y-2 text-[#7F7F7F] text-xs font-medium pt-1">
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-[#A3A3A3]" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] leading-none">🏋️</span>
            {/* PERBAIKAN: Menghindari teks Coach ganda jika data dari database sudah mengandung kata Coach */}
            <span>
              {member.trainer
                ? member.trainer.toLowerCase().includes("coach")
                  ? member.trainer
                  : `Coach ${member.trainer}`
                : "Tanpa Coach"}
            </span>
          </div>
        </div>

        {/* Pembatas Garis Tipis Halus */}
        <div className="h-[1px] bg-[#F5F5F5] w-full" />

        {/* Row 3: Jenis Paket & Harga Nominal Finansial */}
        <div className="flex items-end justify-between gap-4 pt-1">
          <span
            className={`px-[14px] py-1.5 rounded-xl text-[11px] font-bold border tracking-wide min-w-[65px] text-center ${pc.bg} ${pc.text} ${pc.border}`}
          >
            {member.plan}
          </span>

          <div className="text-right space-y-0.5">
            <p className="text-[16px] font-extrabold text-[#111111] tracking-tight">
              Rp {member.price?.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-[#A0A0A0] font-medium">
              {member.visits}x kunjungan
            </p>
          </div>
        </div>
      </div>

      {/* ── KARTU SEKUNDER: DETAIL WAKTU & METRIK AKTIVITAS PROGRESS ── */}
      <div className="bg-white border border-[#EBEBEB] rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Sektor Logistik Masa Aktif */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Logistik Masa Aktif
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                <Calendar size={13} className="text-gray-400" />
              </div>
              <div className="text-xs">
                <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wide">
                  Mulai Terdaftar
                </p>
                <p className="font-semibold text-gray-700 mt-0.5">
                  {member.joined}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                <Clock size={13} className="text-gray-400" />
              </div>
              <div className="text-xs">
                <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wide">
                  Habis Tempo
                </p>
                <p className="font-semibold text-gray-700 mt-0.5">
                  {member.expiry}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                <Phone size={13} className="text-gray-400" />
              </div>
              <div className="text-xs">
                <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wide">
                  Kontak Telepon
                </p>
                <p className="font-semibold text-gray-700 mt-0.5">
                  {member.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sektor Progress Bar Kuota Kunjungan */}
        <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Metrik Aktivitas
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Akumulasi aktivitas check-in kedatangan di gerbang gym.
            </p>
          </div>

          <div className="space-y-2 mt-6 md:mt-0">
            <div className="flex justify-between items-end text-xs font-bold">
              <span className="text-gray-800">{member.visits} / 100 Sesi</span>
              <span className="text-gray-400">{visitPct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-800 rounded-full transition-all duration-500"
                style={{ width: `${visitPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
