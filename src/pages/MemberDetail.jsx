// src/pages/MemberDetail.jsx
// Pertemuan 9 — Step 3: Halaman detail member menggunakan Dynamic Route + useParams

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Dumbbell,
  CreditCard,
  Activity,
  Clock,
  Award,
  QrCode,
  RefreshCw,
} from "lucide-react";
import membersData from "../data/membersData";
import PageHeader from "../components/PageHeader";

// ── Konfigurasi warna ─────────────────────────────────────────
const planConfig = {
  Gold:   { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  badge: "from-amber-400 to-amber-300",  shadow: "shadow-amber-100"  },
  Silver: { bg: "bg-slate-100", text: "text-slate-600",  border: "border-slate-200",  badge: "from-slate-400 to-slate-300",  shadow: "shadow-slate-100"  },
  Bronze: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "from-orange-400 to-orange-300", shadow: "shadow-orange-100" },
};

const statusConfig = {
  Active:   { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400",  border: "border-green-100"  },
  Expired:  { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400",    border: "border-red-100"    },
  Expiring: { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400",  border: "border-amber-100"  },
};

// ── QR Code visual sederhana ──────────────────────────────────
const QRVisual = ({ code }) => {
  const seed  = code.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 49 }, (_, i) => ((seed * (i + 3) * 7) % 17) > 7);
  return (
    <div className="w-28 h-28 border-2 border-green-400 rounded-2xl flex flex-col items-center justify-center bg-white p-2.5 shadow-sm">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1.5 }}>
        {cells.map((on, i) => (
          <div
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: 1,
              background: on ? "#22c55e" : "transparent",
            }}
          />
        ))}
      </div>
      <div className="text-[7px] text-gray-400 mt-1.5 tracking-widest font-semibold">ZEUS GYM</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
export default function MemberDetail() {
  // ── Pertemuan 9 Step 3: ambil :id dari URL ────────────────
  const { id }          = useParams();
  const navigate        = useNavigate();
  const [member, setMember] = useState(null);
  const [error, setError]   = useState(null);

  // ── Cari data member berdasarkan id dari local data ────────
  // (Ekuivalen dengan axios.get ke API, tapi data dari local JSON)
  useEffect(() => {
    // Simulasi async (sesuai pola useEffect di Pertemuan 9)
    const found = membersData.find((m) => m.id === parseInt(id));
    if (!found) {
      setError(`Member dengan ID ${id} tidak ditemukan.`);
    } else {
      setMember(found);
    }
  }, [id]);

  // ── Guard: Error ──────────────────────────────────────────
  if (error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-600 font-semibold text-sm">{error}</p>
          <button
            onClick={() => navigate("/members")}
            className="mt-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold mx-auto hover:bg-red-600 transition-colors"
          >
            <ArrowLeft size={14} />
            Kembali ke Members
          </button>
        </div>
      </div>
    );

  // ── Guard: Loading ────────────────────────────────────────
  if (!member)
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Memuat data member...</p>
        </div>
      </div>
    );

  // ── Konfigurasi warna berdasarkan plan & status ───────────
  const pc = planConfig[member.plan]     || planConfig.Bronze;
  const sc = statusConfig[member.status] || statusConfig.Active;

  // ── Hitung persentase kunjungan (maks 100 kunjungan) ──────
  const visitPct = Math.min((member.visits / 100) * 100, 100);

  // ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Member Detail"
        breadcrumb={["Management", "Members", member.name]}
      >
        <button
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors text-xs"
        >
          <ArrowLeft size={14} />
          Kembali
        </button>
      </PageHeader>

      {/* ── Grid utama ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Kartu Identitas Member (kiri) ── */}
        <div
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          {/* Banner warna plan */}
          <div className={`h-24 bg-gradient-to-br ${pc.badge} relative overflow-hidden`}>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute -bottom-2 -left-2 w-14 h-14 rounded-full bg-white/10" />
            {/* Badge plan */}
            <span className="absolute top-3 right-3 text-[10px] font-black text-white/80 tracking-widest uppercase">
              {member.plan} MEMBER
            </span>
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-2xl ${pc.bg} ${pc.text} border-4 border-white flex items-center justify-center text-2xl font-black -mt-8 shadow-lg ${pc.shadow}`}>
              {member.name.charAt(0)}
            </div>

            <h2 className="mt-3 text-xl font-black text-gray-800">{member.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{member.code}</p>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border mt-3 ${sc.bg} ${sc.text} ${sc.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {member.status}
            </span>

            <div className="mt-5 space-y-3">
              {[
                { Icon: Mail,     label: "Email",   value: member.email   },
                { Icon: Phone,    label: "Telepon", value: member.phone   },
                { Icon: Calendar, label: "Bergabung", value: member.joined },
                { Icon: Clock,    label: "Berlaku s/d", value: member.expiry },
                { Icon: Dumbbell, label: "Trainer",  value: member.trainer },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-xs text-gray-700 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code */}
            <div className="mt-5 pt-5 border-t border-gray-50 flex flex-col items-center gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member QR Code</p>
              <QRVisual code={member.code} />
              <p className="text-[9px] text-gray-300 tracking-widest">{member.code}</p>
            </div>
          </div>
        </div>

        {/* ── Kolom kanan (statistik + info) ── */}
        <div className="xl:col-span-2 space-y-5">

          {/* ── Statistik 3 kartu ── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: Activity,
                label: "Total Kunjungan",
                value: `${member.visits}x`,
                sub: "Sejak bergabung",
                color: "text-green-500",
                bg: "bg-green-50",
                border: "border-green-100",
              },
              {
                icon: CreditCard,
                label: "Biaya/Bulan",
                value: `Rp ${member.price.toLocaleString("id-ID")}`,
                sub: `Plan ${member.plan}`,
                color: "text-amber-500",
                bg: "bg-amber-50",
                border: "border-amber-100",
              },
              {
                icon: Award,
                label: "Trainer",
                value: member.trainer,
                sub: "Personal trainer",
                color: "text-blue-500",
                bg: "bg-blue-50",
                border: "border-blue-100",
              },
            ].map(({ icon: Icon, label, value, sub, color, bg, border }) => (
              <div
                key={label}
                className={`bg-white rounded-2xl border ${border} p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <div className={`${bg} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={16} className={color} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-base font-black text-gray-800 leading-tight">{value}</p>
                <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Info lengkap member ── */}
          <div
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">Informasi Lengkap</p>
                <p className="text-xs text-gray-400">Data detail member {member.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                  ID: {member.id}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Nama Lengkap",  value: member.name     },
                  { label: "Kode Member",   value: member.code     },
                  { label: "Email",         value: member.email    },
                  { label: "Telepon",       value: member.phone    },
                  { label: "Plan",          value: member.plan     },
                  { label: "Trainer",       value: member.trainer  },
                  { label: "Harga/Bulan",   value: `Rp ${member.price.toLocaleString("id-ID")}` },
                  { label: "Total Kunjungan", value: `${member.visits} kali` },
                  { label: "Tanggal Bergabung", value: member.joined  },
                  { label: "Berlaku Sampai",    value: member.expiry  },
                  { label: "Status",        value: member.status   },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Progress kunjungan ── */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-700">Aktivitas Kunjungan</p>
                <p className="text-xs text-gray-400">{member.visits} dari 100 kunjungan target</p>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                {visitPct.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700"
                style={{ width: `${visitPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-400">
              <span>0 kunjungan</span>
              <span>100 kunjungan</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}