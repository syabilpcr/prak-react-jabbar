import { useState } from "react";
import {
  Plus,
  Send,
  Trophy,
  Link as LinkIcon,
  Copy,
  Check,
  Users,
  Gift,
  Share2,
} from "lucide-react";

// ── Components ────────────────────────────────────────────────
import SearchBar from "../components/SearchBar";
import Badge from "../components/Badge";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";

// ── Data ──────────────────────────────────────────────────────
import promotionsData from "../data/promotionsData";

const Promotions = () => {
  const [promotions, setPromotions] = useState(promotionsData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPromoStatus, setFilterPromoStatus] = useState("all");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralActive, setReferralActive] = useState(false);
  const makeReferral = () => {
    const code = "ZEUSREF" + Math.floor(Math.random() * 10000);
    return {
      code,
      link: `https://zeusgym.com/ref/${code}`,
    };
  };

  const [referralCode, setReferralCode] = useState(() => makeReferral().code);
  const [referralLink, setReferralLink] = useState(() => makeReferral().link);

  const [copied, setCopied] = useState(false);
  const [referralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    rewardsEarned: 0,
    pendingRewards: 0,
  });
  const [referralHistory] = useState([
    { id: 1, friendName: "Budi Santoso", date: "2024-12-01", status: "Aktif", reward: "Rp 25.000" },
    { id: 2, friendName: "Siti Rahayu", date: "2024-12-03", status: "Aktif", reward: "Rp 25.000" },
    { id: 3, friendName: "Agus Wijaya", date: "2024-12-05", status: "Pending", reward: "Rp 25.000" },
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
    alert(`✅ Promosi "${promo.title}" berhasil dikirim ke semua anggota!\n\n📧 ${promo.sent + 1} anggota akan menerima notifikasi.`);
    setPromotions(promotions.map((p) => (p.id === promo.id ? { ...p, sent: p.sent + 1 } : p)));
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
    if (window.confirm("Apakah Anda yakin ingin menonaktifkan program referral?")) {
      setReferralActive(false);
      setShowReferralModal(false);
      alert("Program referral telah dinonaktifkan.");
    }
  };

  const filtered = promotions.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterPromoStatus === "all" || p.status === filterPromoStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      {/* ── Page Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">Promosi & Otomatisasi</h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Kelola kampanye promosi dan program referral
          </p>
        </div>
        <Button type="primary" icon={Plus} onClick={() => setShowModal(true)}>
          Buat Promosi
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Gift}
          label="Total Promosi"
          value={promotions.length}
          change="+5.0%"
          trend="up"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={Send}
          label="Total Terkirim"
          value={promotions.reduce((s, p) => s + p.sent, 0)}
          change="+12.3%"
          trend="up"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={Users}
          label="Referral Aktif"
          value={referralStats.totalReferrals}
          change="+8.1%"
          trend="up"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={Trophy}
          label="Promosi Aktif"
          value={promotions.filter((p) => p.status === "Aktif").length}
          change="+3.2%"
          trend="up"
          sub="dari bulan lalu"
        />
      </div>

      {/* Referral Program Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-[#8E1616] to-[#D84040] rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <p className="text-xs text-white/80 font-semibold">Program Referral</p>
                </div>
                <p className="text-xl font-bold text-white">Ajak Teman, Dapat Diskon!</p>
                <p className="text-xs text-white/80 mt-1 max-w-[200px]">
                  Dapatkan diskon 20% untuk setiap teman yang bergabung!
                </p>
                {referralActive && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-white/90">Program Aktif</span>
                  </div>
                )}
              </div>
              <Button
                type={referralActive ? "danger" : "secondary"}
                onClick={() => { setReferralActive(true); setShowReferralModal(true); }}
              >
                {referralActive ? "Kelola" : "Aktifkan"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#8C1007]/10 flex items-center justify-center">
              <Trophy size={24} className="text-[#8C1007]" />
            </div>
            <div>
              <p className="text-xs text-[#9e7a6e]">Pemasaran Digital</p>
              <p className="text-sm font-bold text-[#1D1616]">Kampanye SMS & Email</p>
              <p className="text-xs text-[#9e7a6e]">Terkirim otomatis ke anggota kadaluarsa</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabel Promosi ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1616]">Promosi Aktif</p>
              <p className="text-xs text-[#9e7a6e]">{filtered.length} kampanye</p>
            </div>
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari promosi..."
              className="w-52"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">Filter:</span>
            <select
              value={filterPromoStatus}
              onChange={(e) => setFilterPromoStatus(e.target.value)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Kadaluarsa">Kadaluarsa</option>
            </select>
            {filterPromoStatus !== "all" && (
              <button
                onClick={() => setFilterPromoStatus("all")}
                className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold hover:bg-red-100 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table headers={["Judul", "Kode", "Diskon", "Berlaku Hingga", "Terkirim", "Status", "Aksi"]}>
            {filtered.length === 0
              ? null
              : filtered.map((promo) => (
                  <tr key={promo.id} className="hover:bg-[#faf6f4] transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-[#1D1616] text-sm">
                      {promo.title}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-[#8C1007]">
                      {promo.code}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-bold text-[#8C1007]">
                      {promo.discount}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#9e7a6e]">
                      {promo.validUntil}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#9e7a6e]">
                      {promo.sent} anggota
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge type={promo.status === "Aktif" ? "success" : "danger"} dot>
                        {promo.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Button
                        type="ghost"
                        size="sm"
                        icon={Send}
                        onClick={() => handleSendPromo(promo)}
                        disabled={promo.status !== "Aktif"}
                      >
                        Kirim
                      </Button>
                    </td>
                  </tr>
                ))}
          </Table>
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon="🔍"
            title="Promosi tidak ditemukan"
            message="Coba ubah kata kunci pencarian Anda."
          />
        )}
      </div>

      {/* ── Modal Referral ── */}
      <Modal
        open={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        title="Program Referral - Ajak Teman"
        subtitle="Dapatkan diskon 20% untuk setiap teman yang bergabung!"
        footer={
          <div className="flex gap-3">
            {referralActive && (
              <Button type="danger" fullWidth onClick={handleDeactivateReferral}>
                Nonaktifkan Program
              </Button>
            )}
            <Button type="primary" fullWidth onClick={() => setShowReferralModal(false)}>
              Tutup
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Referral Link */}
          <div className="bg-[#f8f3ee] rounded-xl p-4 border border-[#e8dfd6]">
            <label className="block text-xs font-bold text-[#9e7a6e] mb-2 uppercase tracking-wide">
              Link Referral Anda
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-white border border-[#e8dfd6] rounded-xl px-3 py-2">
                <LinkIcon size={16} className="text-[#9e7a6e] mr-2" />
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-[#1D1616] outline-none"
                />
              </div>
              <Button type="primary" size="sm" icon={copied ? Check : Copy} onClick={handleCopyLink}>
                {copied ? "Tersalin!" : "Salin"}
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-3">
            <Button type="primary" fullWidth onClick={handleShareWhatsApp}>
              WhatsApp
            </Button>
            <Button type="secondary" onClick={handleRegenerateCode}>
              🔄
            </Button>
          </div>

          {/* Referral History */}
          <div>
            <p className="text-sm font-bold text-[#1D1616] mb-3">Riwayat Referral</p>
            <Table headers={["Teman", "Tanggal", "Status", "Reward"]}>
              {referralHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[#faf6f4] transition-colors">
                  <td className="px-6 py-2.5 text-sm text-[#1D1616]">{item.friendName}</td>
                  <td className="px-6 py-2.5 text-xs text-[#9e7a6e]">{item.date}</td>
                  <td className="px-6 py-2.5">
                    <Badge type={item.status === "Aktif" ? "success" : "warning"} dot>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-2.5 text-sm font-semibold text-green-600">{item.reward}</td>
                </tr>
              ))}
            </Table>
          </div>
        </div>
      </Modal>

      {/* ── Modal Buat Promosi ── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Buat Promosi"
        subtitle="Kirim otomatis ke anggota target"
        footer={
          <div className="flex gap-3">
            <Button type="secondary" fullWidth onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="primary" fullWidth onClick={handleSubmit}>
              Buat & Publikasikan
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <InputField
            label="Judul Promosi"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Contoh: Spesial Musim Panas"
            required
          />
          <InputField
            label="Kode Promo"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Contoh: SUMMER20"
            required
          />
          <SelectField
            label="Tipe Diskon"
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            options={[
              { value: "percentage", label: "Persentase" },
              { value: "fixed", label: "Nominal" },
            ]}
          />
          <InputField
            label="Nilai Diskon"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder={form.discountType === "percentage" ? "20" : "50000"}
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default Promotions;
