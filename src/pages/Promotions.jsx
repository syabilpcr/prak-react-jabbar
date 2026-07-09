import { useState, useEffect } from "react";
import {
  Plus,
  Send,
  Trophy,
  Link as LinkIcon,
  Copy,
  Check,
  Users,
  Gift,
  Edit,
  Trash2,
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
  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem("zeus_promotions_v3");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("zeus_promotions_v3", JSON.stringify(promotionsData));
    return promotionsData;
  });

  useEffect(() => {
    localStorage.setItem("zeus_promotions_v3", JSON.stringify(promotions));
    window.dispatchEvent(new Event("local-storage-promo-update"));
  }, [promotions]);

  // ── Persistent Referral Configuration State ──
  const [referralConfig, setReferralConfig] = useState(() => {
    const saved = localStorage.getItem("zeus_referral_config");
    if (saved) return JSON.parse(saved);
    const code = "ZEUSREF" + Math.floor(1000 + Math.random() * 9000);
    const initialConfig = {
      active: true,
      code: code,
      link: `https://zeusgym.com/ref/${code}`,
      history: [
        { id: 1, friendName: "Budi Santoso", date: "2026-06-15", status: "Aktif", reward: "Rp 25.000" },
        { id: 2, friendName: "Siti Rahayu", date: "2026-07-02", status: "Aktif", reward: "Rp 25.000" },
      ],
    };
    localStorage.setItem("zeus_referral_config", JSON.stringify(initialConfig));
    return initialConfig;
  });

  // Sync state modifications to localStorage
  useEffect(() => {
    localStorage.setItem("zeus_referral_config", JSON.stringify(referralConfig));
    window.dispatchEvent(new Event("local-storage-promo-update"));
  }, [referralConfig]);

  // Listen to external triggers (e.g. signup utilizing code from Members.jsx)
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("zeus_referral_config");
      if (saved) {
        setReferralConfig(JSON.parse(saved));
      }
    };
    window.addEventListener("local-storage-promo-update", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("local-storage-promo-update", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPromoStatus, setFilterPromoStatus] = useState("all");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic statistics calculations
  const totalReferrals = referralConfig.history.length;
  const activeReferrals = referralConfig.history.filter((h) => h.status === "Aktif").length;
  const pendingReferrals = referralConfig.history.filter((h) => h.status === "Pending").length;
  const rewardsEarned = activeReferrals * 25000;
  const pendingRewards = pendingReferrals * 25000;

  const [editingPromo, setEditingPromo] = useState(null);

  const [form, setForm] = useState({
    title: "",
    code: "",
    discount: "",
    discountType: "percentage",
    status: "Aktif",
    validUntil: "2026-12-31",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.title || !form.code || !form.discount) return;
    
    if (editingPromo) {
      const updated = promotions.map((p) => {
        if (p.id === editingPromo.id) {
          return {
            ...p,
            title: form.title,
            code: form.code,
            type: form.discountType,
            status: form.status,
            validUntil: form.validUntil,
            discount:
              form.discountType === "percentage"
                ? `${form.discount}%`
                : `Rp ${Number(form.discount).toLocaleString("id-ID")}`,
          };
        }
        return p;
      });
      setPromotions(updated);
      setEditingPromo(null);
    } else {
      const newPromo = {
        id: `PROMO-${String(promotions.length + 1).padStart(3, "0")}`,
        title: form.title,
        code: form.code,
        type: form.discountType,
        status: form.status,
        validUntil: form.validUntil,
        discount:
          form.discountType === "percentage"
            ? `${form.discount}%`
            : `Rp ${Number(form.discount).toLocaleString("id-ID")}`,
        sent: 0,
      };
      setPromotions([newPromo, ...promotions]);
    }
    setForm({ title: "", code: "", discount: "", discountType: "percentage", status: "Aktif", validUntil: "2026-12-31" });
    setShowModal(false);
  };

  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setForm({
      title: promo.title,
      code: promo.code,
      discount: String(promo.discount || "").replace("%", "").replace("Rp ", "").replace(/\./g, ""),
      discountType: promo.type || (String(promo.discount).includes("%") ? "percentage" : "fixed"),
      status: promo.status || "Aktif",
      validUntil: promo.validUntil || "2026-12-31",
    });
    setShowModal(true);
  };

  const handleDeletePromo = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus promosi ini?")) {
      setPromotions(promotions.filter((p) => p.id !== id));
    }
  };

  const handleSendPromo = (promo) => {
    alert(`✅ Promosi "${promo.title}" berhasil dikirim ke semua anggota!\n\n📧 ${promo.sent + 1} anggota akan menerima notifikasi.`);
    setPromotions(promotions.map((p) => (p.id === promo.id ? { ...p, sent: p.sent + 1 } : p)));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralConfig.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = `🎉 Ayo bergabung dengan Zeus Gym! Gunakan kode referral saya: ${referralConfig.code} untuk mendapatkan diskon 20% untuk bulan pertama! 🏋️‍♂️\n\nKlik link: ${referralConfig.link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleRegenerateCode = () => {
    const code = "ZEUSREF" + Math.floor(1000 + Math.random() * 9000);
    setReferralConfig({
      ...referralConfig,
      code: code,
      link: `https://zeusgym.com/ref/${code}`,
    });
    alert(`Kode referral baru telah dibuat: ${code}`);
  };

  const handleToggleReferral = () => {
    const nextState = !referralConfig.active;
    setReferralConfig({
      ...referralConfig,
      active: nextState,
    });
    if (!nextState) {
      setShowReferralModal(false);
    }
    alert(`Program referral telah ${nextState ? "diaktifkan" : "dinonaktifkan"}.`);
  };

  const filtered = promotions.filter((p) => {
    const title = p.title || "";
    const code = p.code || "";
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) ||
      code.toLowerCase().includes(search.toLowerCase());
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
        <Button
          type="primary"
          icon={Plus}
          onClick={() => {
            setEditingPromo(null);
            setForm({ title: "", code: "", discount: "", discountType: "percentage", status: "Aktif", validUntil: "2026-12-31" });
            setShowModal(true);
          }}
        >
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
          value={promotions.reduce((s, p) => s + (p.sent || 0), 0)}
          change="+12.3%"
          trend="up"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={Users}
          label="Referral Aktif"
          value={totalReferrals}
          change={`+${activeReferrals}`}
          trend="up"
          sub="total teman diajak"
        />
        <StatCard
          icon={Trophy}
          label="Reward Diklaim"
          value={`Rp ${(rewardsEarned / 1000).toFixed(0)}k`}
          change={`+Rp ${pendingRewards / 1000}k pending`}
          trend="up"
          sub="estimasi insentif"
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
                <p className="text-xs text-white/80 mt-1 max-w-[220px]">
                  Gunakan kode <span className="font-mono font-black text-white">{referralConfig.code}</span> untuk dapat diskon 20% !
                </p>
                {referralConfig.active && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-white/90">Program Aktif</span>
                  </div>
                )}
              </div>
              <Button
                type={referralConfig.active ? "primary" : "secondary"}
                onClick={() => {
                  if (!referralConfig.active) {
                    setReferralConfig({ ...referralConfig, active: true });
                  }
                  setShowReferralModal(true);
                }}
              >
                {referralConfig.active ? "Kelola" : "Aktifkan"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#8C1007]/10 flex items-center justify-center">
            <Trophy size={24} className="text-[#8C1007]" />
          </div>
          <div>
            <p className="text-xs text-[#9e7a6e]">Pemasaran Digital</p>
            <p className="text-sm font-bold text-[#1D1616]">Program Referral Aktif</p>
            <p className="text-xs text-[#9e7a6e]">Masukkan kode referral saat pendaftaran member untuk potongan biaya 20%.</p>
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
              <p className="text-sm font-bold text-[#1D1616]">Daftar Promosi</p>
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
                      {promo.sent || 0} anggota
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge type={promo.status === "Aktif" ? "success" : "danger"} dot>
                        {promo.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Button
                          type="ghost"
                          size="sm"
                          icon={Send}
                          onClick={() => handleSendPromo(promo)}
                          disabled={promo.status !== "Aktif"}
                        >
                          Kirim
                        </Button>
                        <button
                          onClick={() => handleEditPromo(promo)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit promo"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePromo(promo.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Hapus promo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
        subtitle="Bagikan kode referral Anda untuk mengklaim insentif bonus!"
        footer={
          <div className="flex gap-3">
            <Button type="danger" fullWidth onClick={handleToggleReferral}>
              {referralConfig.active ? "Nonaktifkan Program" : "Aktifkan Program"}
            </Button>
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
                  value={referralConfig.link}
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
            <Button type="secondary" onClick={handleRegenerateCode} title="Regenerasi Kode">
              🔄 Buat Baru
            </Button>
          </div>

          {/* Referral History */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-bold text-[#1D1616]">Riwayat Teman Diajak</p>
              <span className="text-[10px] bg-red-50 text-[#8C1007] px-2 py-0.5 rounded-full font-bold">
                {referralConfig.history.length} Orang
              </span>
            </div>
            <Table headers={["Teman", "Tanggal", "Status", "Reward"]}>
              {referralConfig.history.map((item) => (
                <tr key={item.id} className="hover:bg-[#faf6f4] transition-colors">
                  <td className="px-6 py-2.5 text-sm text-[#1D1616] font-semibold">{item.friendName}</td>
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

      {/* ── Modal Buat/Edit Promosi ── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingPromo ? "Edit Promosi" : "Buat Promosi"}
        subtitle={editingPromo ? "Ubah detail kampanye promosi" : "Kirim otomatis ke anggota target"}
        footer={
          <div className="flex gap-3">
            <Button type="secondary" fullWidth onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="primary" fullWidth onClick={handleSubmit}>
              {editingPromo ? "Simpan Perubahan" : "Buat & Publikasikan"}
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
              { value: "percentage", label: "Persentase (%)" },
              { value: "fixed", label: "Nominal (Rupiah)" },
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
          <InputField
            label="Berlaku Hingga"
            name="validUntil"
            type="date"
            value={form.validUntil}
            onChange={handleChange}
            required
          />
          <SelectField
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { value: "Aktif", label: "Aktif" },
              { value: "Kadaluarsa", label: "Kadaluarsa" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Promotions;
