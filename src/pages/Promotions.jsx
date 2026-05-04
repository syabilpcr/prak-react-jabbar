import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Plus, X, Search, Send, Trophy } from "lucide-react";

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
    alert(`Mengirim promosi "${promo.title}" ke semua anggota...`);
    setPromotions(
      promotions.map((p) =>
        p.id === promo.id ? { ...p, sent: p.sent + 1 } : p,
      ),
    );
  };
  const handleReferralProgram = () =>
    alert(
      "Program referral diaktifkan! Anggota mendapat hadiah untuk mengajak teman.",
    );
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
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-[#8E1616] to-[#D84040] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/80">Program Referral</p>
              <p className="text-lg font-bold text-white">Ajak Teman</p>
              <p className="text-xs text-white/70 mt-1">
                Dapatkan diskon 20% untuk berdua!
              </p>
            </div>
            <button
              onClick={handleReferralProgram}
              className="bg-white text-[#8E1616] px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Aktifkan
            </button>
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
