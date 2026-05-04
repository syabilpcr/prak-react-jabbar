import { useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  Plus,
  X,
  Search,
  Send,
  Trophy,
  Link as LinkIcon,
  Copy,
  Check,
  Users,
  Gift,
  Share2,
} from "lucide-react";

const initialPromotions = [
  {
    id: "PROMO-001",
    title: "Diskon Anggota Baru",
    code: "WELCOME20",
    discount: "20%",
    type: "percentage",
    validUntil: "2024-12-31",
    status: "Aktif",
    sent: 45,
  },
  {
    id: "PROMO-002",
    title: "Bonus Referral",
    code: "REFER50",
    discount: "Rp 50rb",
    type: "fixed",
    validUntil: "2024-12-25",
    status: "Aktif",
    sent: 28,
  },
  {
    id: "PROMO-003",
    title: "Spesial Anggota Gold",
    code: "GOLD15",
    discount: "15%",
    type: "percentage",
    validUntil: "2024-12-20",
    status: "Kadaluarsa",
    sent: 120,
  },
];

const Promotions = () => {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralActive, setReferralActive] = useState(false);
  const [referralCode, setReferralCode] = useState(
    "ZEUSREF" + Math.floor(Math.random() * 10000),
  );
  const [referralLink, setReferralLink] = useState(
    `https://zeusgym.com/ref/${referralCode}`,
  );
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    rewardsEarned: 0,
    pendingRewards: 0,
  });
  const [referralHistory, setReferralHistory] = useState([
    {
      id: 1,
      friendName: "Budi Santoso",
      date: "2024-12-01",
      status: "Aktif",
      reward: "Rp 25.000",
    },
    {
      id: 2,
      friendName: "Siti Rahayu",
      date: "2024-12-03",
      status: "Aktif",
      reward: "Rp 25.000",
    },
    {
      id: 3,
      friendName: "Agus Wijaya",
      date: "2024-12-05",
      status: "Pending",
      reward: "Rp 25.000",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    code: "",
    discount: "",
    discountType: "percentage",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.title || !form.code || !form.discount) return;
    const newPromo = {
      id: `PROMO-${String(promotions.length + 1).padStart(3, "0")}`,
      ...form,
      discount:
        form.discountType === "percentage"
          ? `${form.discount}%`
          : `Rp ${form.discount}`,
      type: form.discountType,
      validUntil: "2024-12-31",
      status: "Aktif",
      sent: 0,
    };
    setPromotions([newPromo, ...promotions]);
    setForm({ title: "", code: "", discount: "", discountType: "percentage" });
    setShowModal(false);
  };

  const handleSendPromo = (promo) => {
    alert(
      `✅ Promosi "${promo.title}" berhasil dikirim ke semua anggota!\n\n📧 ${promo.sent + 1} anggota akan menerima notifikasi.`,
    );
    setPromotions(
      promotions.map((p) =>
        p.id === promo.id ? { ...p, sent: p.sent + 1 } : p,
      ),
    );
  };

  const handleReferralProgram = () => {
    setReferralActive(true);
    setShowReferralModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = `🎉 Ayo bergabung dengan Zeus Gym! Gunakan kode referral saya: ${referralCode} untuk mendapatkan diskon 20% untuk bulan pertama! 🏋️‍♂️\n\nKlik link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleRegenerateCode = () => {
    const newCode = "ZEUSREF" + Math.floor(Math.random() * 10000);
    setReferralCode(newCode);
    setReferralLink(`https://zeusgym.com/ref/${newCode}`);
    alert(`Kode referral baru: ${newCode}`);
  };

  const handleDeactivateReferral = () => {
    if (
      window.confirm("Apakah Anda yakin ingin menonaktifkan program referral?")
    ) {
      setReferralActive(false);
      setShowReferralModal(false);
      alert("Program referral telah dinonaktifkan.");
    }
  };

  const filtered = promotions.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Promosi & Otomatisasi"
        breadcrumb={["Pemasaran", "Promosi"]}
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <Plus size={14} /> Buat Promosi
        </button>
      </PageHeader>

      {/* Referral Program Card */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-[#8E1616] to-[#D84040] rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <p className="text-xs text-white/80 font-semibold">
                    Program Referral
                  </p>
                </div>
                <p className="text-xl font-bold text-white">
                  Ajak Teman, Dapat Diskon!
                </p>
                <p className="text-xs text-white/80 mt-1 max-w-[200px]">
                  Dapatkan diskon 20% untuk setiap teman yang bergabung!
                </p>
                {referralActive && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-white/90">
                      Program Aktif
                    </span>
                    <span className="text-[10px] text-white/70">
                      | {referralStats.totalReferrals} referral
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleReferralProgram}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  referralActive
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-white text-[#8E1616] hover:bg-gray-100"
                } shadow-lg`}
              >
                {referralActive ? "📋 Kelola Program" : "🚀 Aktifkan"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#8E1616]/10 flex items-center justify-center">
              <Trophy size={24} className="text-[#8E1616]" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Pemasaran Digital</p>
              <p className="text-sm font-bold text-[#1D1616]">
                Kampanye SMS & Email
              </p>
              <p className="text-xs text-gray-400">
                Terkirim otomatis ke anggota kadaluarsa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#1D1616]">Promosi Aktif</p>
            <p className="text-xs text-gray-400">{filtered.length} kampanye</p>
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari promosi..."
              className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] w-44"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Judul
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Kode
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Diskon
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Berlaku Hingga
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Terkirim
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((promo) => (
                <tr
                  key={promo.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3.5 font-semibold text-[#1D1616] text-sm">
                    {promo.title}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-xs text-[#8E1616]">
                    {promo.code}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-bold text-[#8E1616]">
                    {promo.discount}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-gray-500">
                    {promo.validUntil}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-gray-500">
                    {promo.sent} anggota
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${promo.status === "Aktif" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}
                    >
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => handleSendPromo(promo)}
                      disabled={promo.status !== "Aktif"}
                      className={`p-1.5 rounded-lg transition-colors ${promo.status === "Aktif" ? "bg-gray-100 hover:bg-[#8E1616]/20 text-[#8E1616]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                      <Send size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referral Program Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#8E1616]/5 to-[#D84040]/5">
              <div>
                <h3 className="text-xl font-bold text-[#1D1616] flex items-center gap-2">
                  <Users size={24} className="text-[#8E1616]" />
                  Program Referral - Ajak Teman
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Dapatkan diskon 20% untuk setiap teman yang bergabung!
                </p>
              </div>
              <button
                onClick={() => setShowReferralModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center border border-green-200">
                  <Users size={20} className="text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-green-700">
                    {referralStats.totalReferrals}
                  </p>
                  <p className="text-[10px] text-green-600">Total Referral</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border border-blue-200">
                  <Gift size={20} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-700">
                    {referralStats.activeReferrals}
                  </p>
                  <p className="text-[10px] text-blue-600">Aktif</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 text-center border border-yellow-200">
                  <Trophy size={20} className="text-yellow-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-yellow-700">
                    Rp {(referralStats.rewardsEarned / 1000).toFixed(0)}rb
                  </p>
                  <p className="text-[10px] text-yellow-600">Reward Didapat</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 text-center border border-purple-200">
                  <Share2 size={20} className="text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-purple-700">
                    Rp {(referralStats.pendingRewards / 1000).toFixed(0)}rb
                  </p>
                  <p className="text-[10px] text-purple-600">Pending</p>
                </div>
              </div>

              {/* Referral Link Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  Link Referral Anda
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
                    <LinkIcon size={16} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-[#1D1616] outline-none"
                    />
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white rounded-xl transition-all flex items-center gap-2 text-sm"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  Bagikan link ini ke teman Anda. Setiap pendaftaran baru akan
                  memberikan diskon untuk Anda berdua!
                </p>
              </div>

              {/* Share Buttons */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  Bagikan ke Media Sosial
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="text-lg">💚</span> WhatsApp
                  </button>
                  <button
                    onClick={handleRegenerateCode}
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all"
                    title="Buat kode baru"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Referral History */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#1D1616] mb-3 flex items-center gap-2">
                  <Users size={14} className="text-[#8E1616]" />
                  Riwayat Referral
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-xs text-gray-500 font-medium">
                          Teman
                        </th>
                        <th className="text-left py-2 text-xs text-gray-500 font-medium">
                          Tanggal
                        </th>
                        <th className="text-left py-2 text-xs text-gray-500 font-medium">
                          Status
                        </th>
                        <th className="text-right py-2 text-xs text-gray-500 font-medium">
                          Reward
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralHistory.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-2 text-sm text-[#1D1616]">
                            {item.friendName}
                          </td>
                          <td className="py-2 text-xs text-gray-500">
                            {item.date}
                          </td>
                          <td className="py-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                                item.status === "Aktif"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-2 text-right text-sm font-semibold text-green-600">
                            {item.reward}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {referralActive && (
                  <button
                    onClick={handleDeactivateReferral}
                    className="flex-1 border border-red-300 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Nonaktifkan Program
                  </button>
                )}
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="flex-1 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 rounded-xl transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#1D1616]">
                  Buat Promosi
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Kirim otomatis ke anggota target
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Judul Promosi
                </label>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Contoh: Spesial Musim Panas"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Kode Promo
                </label>
                <input
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Contoh: SUMMER20"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Tipe Diskon
                </label>
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                >
                  <option>persentase</option>
                  <option>nominal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Nilai Diskon
                </label>
                <input
                  name="discount"
                  type="text"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder={
                    form.discountType === "persentase" ? "20" : "50000"
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                Buat & Publikasikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
