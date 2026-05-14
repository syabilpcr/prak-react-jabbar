import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Users, Wallet, CalendarCheck, TrendingUp, MoreHorizontal } from "lucide-react";
import membersData from "../data/membersData";

// ── Config ────────────────────────────────────────────────────
const planConfig = {
  Gold:   { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-400"  },
  Silver: { bg: "bg-slate-100", text: "text-slate-600",  border: "border-slate-200",  dot: "bg-slate-400"  },
  Bronze: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-400" },
};

const statusConfig = {
  Active:   { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400",  border: "border-green-100"  },
  Expired:  { bg: "bg-red-50",   text: "text-red-700",   dot: "bg-red-400",    border: "border-red-100"    },
  Expiring: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400",  border: "border-amber-100"  },
};

// ── Stat Card (sama persis gaya Dashboard) ────────────────────
const StatCard = ({ icon: Icon, label, value, sub, change, trend }) => {
  const isUp = trend === "up";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#8C1007]/10 flex items-center justify-center">
          <Icon size={18} className="text-[#8C1007]" />
        </div>
        <button className="text-gray-300"><MoreHorizontal size={16} /></button>
      </div>
      <p className="text-2xl font-black text-[#1D1616] tracking-tight leading-none mb-1">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">{label}</p>
      <div className="flex items-center gap-1.5">
        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md
          ${isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {isUp ? "↑" : "↓"} {change}
        </span>
        <span className="text-[10px] text-gray-400">{sub}</span>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────
const Members = () => {
  const [members, setMembers]     = useState(membersData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [form, setForm]           = useState({
    name: "", email: "", phone: "", plan: "Bronze", trainer: "Coach Budi",
  });

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.plan.toLowerCase().includes(search.toLowerCase())
  );

  const totalActive   = members.filter((m) => m.status === "Active").length;
  const totalExpiring = members.filter((m) => m.status === "Expiring").length;
  const totalRevenue  = members.reduce((s, m) => s + m.price, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return;
    const planPrices = { Gold: 500000, Silver: 300000, Bronze: 150000 };
    const today  = new Date().toISOString().split("T")[0];
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const newMember = {
      id: members.length + 1,
      code: `ZG-${String(members.length + 1).padStart(3, "0")}`,
      status: "Active", joined: today, expiry, visits: 0,
      price: planPrices[form.plan] || 150000, ...form,
    };
    setMembers([newMember, ...members]);
    setForm({ name: "", email: "", phone: "", plan: "Bronze", trainer: "Coach Budi" });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">

      {/* ── Page Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">Anggota Gym</h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">Kelola semua data anggota Zeus Gym</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#8C1007] hover:bg-[#a01a0a] text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-xs shadow-md shadow-[#8C1007]/30 hover:-translate-y-0.5 duration-200"
        >
          <Plus size={14} />
          Tambah Member
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}        label="Total Member"    value={members.length}  change="12.5%" trend="up"   sub="dari bulan lalu" />
        <StatCard icon={CalendarCheck} label="Member Aktif"   value={totalActive}     change="5.3%"  trend="up"   sub="dari bulan lalu" />
        <StatCard icon={TrendingUp}   label="Akan Expired"    value={totalExpiring}   change="2.1%"  trend="down" sub="dari bulan lalu" />
        <StatCard icon={Wallet}       label="Total Pendapatan" value={`Rp ${(totalRevenue/1000000).toFixed(1)} Jt`} change="18.2%" trend="up" sub="dari bulan lalu" />
      </div>

      {/* ── Tabel ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>

        {/* Header tabel */}
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#1D1616]">Daftar Member</p>
            <p className="text-xs text-[#9e7a6e]">{filtered.length} total member terdaftar</p>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e7a6e]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari member..."
              className="pl-8 pr-4 py-2 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl text-xs text-[#5a3030] placeholder-[#c0a89e] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 w-48"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#3E0703]">
                {["#","Nama Member","Kode","Plan","Trainer","Harga/Bulan","Kunjungan","Status"].map((h) => (
                  <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold text-[#FFF0C4]/70 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f0eb]">
              {filtered.map((item, idx) => {
                const pc = planConfig[item.plan]     || planConfig.Bronze;
                const sc = statusConfig[item.status] || statusConfig.Active;
                return (
                  <tr key={item.id} className="hover:bg-[#faf6f4] transition-colors">
                    <td className="px-6 py-3.5 text-xs text-[#9e7a6e] font-medium">{idx + 1}</td>

                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${pc.bg} ${pc.text} flex items-center justify-center font-bold text-xs border ${pc.border}`}>
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <Link
                            to={`/members/${item.id}`}
                            className="font-semibold text-[#8C1007] hover:text-[#a01a0a] hover:underline transition-colors text-sm"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[10px] text-[#9e7a6e]">{item.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 font-mono text-xs text-[#9e7a6e] font-semibold">{item.code}</td>

                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${pc.bg} ${pc.text} ${pc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
                        {item.plan}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-xs text-[#5a3030]">{item.trainer}</td>

                    <td className="px-6 py-3.5 text-sm font-semibold text-[#1D1616]">
                      Rp {item.price.toLocaleString("id-ID")}
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="text-sm font-black text-[#8C1007]">{item.visits}</span>
                      <span className="text-[10px] text-[#9e7a6e]">x</span>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9e7a6e] text-sm">
            Member tidak ditemukan.
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md mx-4 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#1D1616]">Tambah Member Baru</h3>
                <p className="text-xs text-[#9e7a6e] mt-0.5">Isi data member dengan lengkap</p>
              </div>
              <button onClick={() => setShowModal(false)}
                className="p-2 hover:bg-[#f8f3ee] rounded-xl transition-colors text-[#9e7a6e]">✕</button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Nama Lengkap", name: "name",  type: "text",  placeholder: "Nama member..." },
                { label: "Email",        name: "email", type: "email", placeholder: "email@contoh.com" },
                { label: "Telepon",      name: "phone", type: "text",  placeholder: "08xxxxxxxxxx" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-bold text-[#9e7a6e] mb-1.5 uppercase tracking-wide">{field.label}</label>
                  <input
                    name={field.name} type={field.type} value={form[field.name]}
                    onChange={handleChange} placeholder={field.placeholder}
                    className="w-full border border-[#e8dfd6] bg-[#f8f3ee] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 transition-all text-[#1D1616]"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-[#9e7a6e] mb-1.5 uppercase tracking-wide">Plan Membership</label>
                <select name="plan" value={form.plan} onChange={handleChange}
                  className="w-full border border-[#e8dfd6] bg-[#f8f3ee] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 transition-all text-[#1D1616]">
                  <option value="Gold">Gold — Rp 500.000/bulan</option>
                  <option value="Silver">Silver — Rp 300.000/bulan</option>
                  <option value="Bronze">Bronze — Rp 150.000/bulan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#9e7a6e] mb-1.5 uppercase tracking-wide">Trainer</label>
                <select name="trainer" value={form.trainer} onChange={handleChange}
                  className="w-full border border-[#e8dfd6] bg-[#f8f3ee] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 transition-all text-[#1D1616]">
                  <option>Coach Budi</option>
                  <option>Coach Rina</option>
                  <option>Coach Deni</option>
                  <option>Coach Yanto</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-[#e8dfd6] text-[#9e7a6e] font-semibold py-2.5 rounded-xl hover:bg-[#f8f3ee] transition-colors text-sm">
                Batal
              </button>
              <button onClick={handleSubmit}
                className="flex-1 bg-[#8C1007] hover:bg-[#a01a0a] text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-[#8C1007]/30">
                Simpan Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;