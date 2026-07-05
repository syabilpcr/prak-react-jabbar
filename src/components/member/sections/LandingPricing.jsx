import { useState, useEffect } from "react";
import { Zap, Star, Crown, TrendingDown, ArrowRight, X, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../Reveal";
import api from "../../../lib/api";

const durations = [
  { value: "harian", short: "Harian", display: "Akses harian", price: 50000 },
  { value: 1, short: "1 Bulan", display: "1 bulan penuh", price: 300000 },
  { value: 2, short: "2 Bulan", display: "2 bulan", price: 570000 },
  { value: 3, short: "3 Bulan", display: "3 bulan", price: 810000 },
  { value: 4, short: "4 Bulan", display: "4 bulan", price: 1080000 },
  { value: 5, short: "5 Bulan", display: "5 bulan", price: 1325000 },
  { value: 6, short: "6 Bulan", display: "6 bulan", price: 1560000 },
  { value: 7, short: "7 Bulan", display: "7 bulan", price: 1785000 },
  { value: 8, short: "8 Bulan", display: "8 bulan", price: 2000000 },
  { value: 9, short: "9 Bulan", display: "9 bulan", price: 2205000 },
  { value: 10, short: "10 Bulan", display: "10 bulan", price: 2400000 },
  { value: 11, short: "11 Bulan", display: "11 bulan", price: 2585000 },
  { value: 12, short: "12 Bulan", display: "12 bulan / 1 tahun", price: 2760000 },
];

const highlights = [
  { label: "Harian", icon: Zap, tagline: "Coba dulu tanpa komitmen", price: 50000, unit: "hari", color: "from-[#8E1616] to-[#D84040]" },
  { label: "Bulanan", icon: Star, tagline: "Paling fleksibel & populer", price: 300000, unit: "bulan", popular: true, color: "from-amber-500 to-orange-500" },
  { label: "Tahunan", icon: Crown, tagline: "Paling hemat untuk setahun", price: 2760000, unit: "tahun", color: "from-yellow-400 to-amber-500" },
];

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

// ── Custom Price Count Animation Component ──
function AnimatedPrice({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 500; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return <span>{rupiah(displayValue)}</span>;
}

export default function LandingPricing() {
  const [selected, setSelected] = useState(1); // default 1 Bulan
  const active = durations.find((d) => d.value === selected) || durations[1];

  const perMonthBaseline = 300000;
  const months = typeof active.value === "number" ? active.value : 0;
  const baseline = months > 0 ? months * perMonthBaseline : 0;
  const hemat = baseline > active.price ? baseline - active.price : 0;

  // ── Form pendaftaran ──
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null); // { id, nama }
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    nama_lengkap: "",
    jenis_kelamin: "L",
    tgl_lahir: "",
    no_hp: "",
    alamat: "",
  });

  // Promo Code States
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState(null);
  const [promoError, setPromoError] = useState(null);

  const handleApplyPromo = () => {
    setPromoError(null);
    setPromoMessage(null);
    if (!promoCode.trim()) return;

    const savedPromos = localStorage.getItem("zeus_promotions_v3");
    if (!savedPromos) {
      setPromoError("Belum ada kode promo aktif saat ini.");
      return;
    }

    const promoList = JSON.parse(savedPromos);
    const found = promoList.find(
      (p) =>
        p.code.toLowerCase() === promoCode.trim().toLowerCase() &&
        p.status === "Aktif"
    );

    if (found) {
      setAppliedPromo(found);
      setPromoMessage(`Berhasil menggunakan kode promo "${found.title}"!`);
    } else {
      setAppliedPromo(null);
      setPromoError("Kode promo tidak valid atau telah berakhir.");
    }
  };

  const getDiscountedPrice = () => {
    if (!appliedPromo) return active.price;
    const discStr = String(appliedPromo.discount || "");
    if (discStr.includes("%")) {
      const percent = parseFloat(discStr.replace("%", ""));
      return Math.max(0, active.price * (1 - percent / 100));
    } else {
      const amount = parseFloat(discStr.replace(/[^0-9]/g, ""));
      return Math.max(0, active.price - amount);
    }
  };

  const finalPrice = getDiscountedPrice();

  const onField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const durasiDays =
    selected === "harian" ? 1 : (typeof selected === "number" ? selected * 30 : 30);

  const handleDaftar = async () => {
    if (!form.nama_lengkap || !form.no_hp || !form.tgl_lahir) {
      setError("Nama lengkap, nomor HP, dan tanggal lahir wajib diisi.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const expiry = new Date(Date.now() + durasiDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const pin = String(Math.floor(100000 + Math.random() * 900000));

      let allIds = [];
      let from = 0;
      const pageSize = 1000;
      while (true) {
        const pageRes = await api.get("/member", {
          params: { select: "id_member" },
          headers: { Range: `${from}-${from + pageSize - 1}` },
        });
        allIds = allIds.concat(pageRes.data);
        if (pageRes.data.length < pageSize) break;
        from += pageSize;
      }
      const nums = allIds
        .map((m) => parseInt((m.id_member || "").replace("M-", ""), 10))
        .filter((n) => !isNaN(n));
      const nextNumber = (nums.length ? Math.max(...nums) : 1000) + 1;
      const newId = `M-${nextNumber}`;

      const payload = {
        id_member: newId,
        nama_lengkap: form.nama_lengkap,
        jenis_kelamin: form.jenis_kelamin,
        tgl_lahir: form.tgl_lahir,
        no_hp: form.no_hp,
        alamat: form.alamat || "-",
        tgl_gabung: today,
        tgl_berakhir: expiry,
        status_member: "aktif",
        pin_akses: pin,
        catatan_medis: appliedPromo ? `Promo: ${appliedPromo.code}` : "Tidak ada",
        kontak_darurat: "-",
        nama_kontak_darurat: "-",
        frekuensi_transaksi: 1,
        total_nominal_transaksi: finalPrice,
      };

      await api.post("/member", payload, {
        headers: { Prefer: "return=representation" },
      });

      setDone({ id: newId, nama: form.nama_lengkap });
      setForm({ nama_lengkap: "", jenis_kelamin: "L", tgl_lahir: "", no_hp: "", alamat: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "";
      setError(
        msg.includes("duplicate key")
          ? "ID member bentrok, coba klik daftar sekali lagi."
          : msg || "Gagal menyimpan pendaftaran. Periksa koneksi atau hak akses.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="pricing" className="bg-[#1D1616] py-24 relative overflow-hidden">
      {/* Decorative background lights */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#8E1616]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#D84040]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D84040] mb-4">
              Harga Keanggotaan
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase">
              Investasi Kesehatan <br className="hidden md:inline" />
              Untuk <span className="text-[#D84040]">Masa Depanmu</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/45 mt-5 text-[15px] max-w-lg mx-auto">
              Bayar sesuai durasi yang kamu butuhkan. Fleksibel, transparan, dan makin lama durasi makin hemat!
            </p>
          </Reveal>
        </div>

        {/* ── Highlight cards with hover zoom & glow ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-16">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <Reveal key={h.label} delay={i * 100} direction="up" className="h-full">
                <motion.div
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(216, 64, 64, 0.15)",
                  }}
                  className={`relative h-full overflow-hidden rounded-3xl border p-8 flex flex-col transition-colors duration-300 ${
                    h.popular
                      ? "border-[#D84040] bg-[#2A1A1A] md:-translate-y-2"
                      : "border-white/[0.06] bg-[#241818] hover:border-[#D84040]/30"
                  }`}
                >
                  {h.popular && (
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-5 right-5 text-[9px] font-extrabold uppercase tracking-widest text-white bg-[#D84040] rounded-full px-3 py-1.5 shadow-lg shadow-[#D84040]/30"
                    >
                      Pilihan Terbaik
                    </motion.span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${h.color} text-white shadow-lg`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{h.label}</h3>
                  <p className="text-white/40 text-[13px] mt-1.5 leading-relaxed">{h.tagline}</p>
                  
                  <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {rupiah(h.price)}
                    </span>
                    <span className="text-white/40 text-xs font-semibold">/{h.unit}</span>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* ── Interactive duration selector with layout animations ── */}
        <Reveal delay={120} direction="scale">
          <div className="max-w-3xl mx-auto rounded-3xl border border-white/[0.06] bg-[#241818] p-6 md:p-10 shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D84040] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              Kalkulator Paket
            </div>

            <p className="text-center text-white/50 text-xs font-semibold uppercase tracking-wider mb-8">
              Geser durasi keanggotaan untuk penawaran terbaik
            </p>

            {/* Slider tabs with framer-motion sliding background */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 bg-[#1D1616]/50 p-2 rounded-2xl border border-white/[0.03]">
              {durations.map((d) => {
                const isActive = selected === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setSelected(d.value)}
                    className="relative px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePricingTab"
                        className="absolute inset-0 bg-[#D84040] rounded-xl shadow-lg shadow-[#D84040]/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-white" : "text-white/40 hover:text-white/70"}`}>
                      {d.short}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Animated price display */}
            <div className="text-center border-t border-white/[0.04] pt-8">
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-3">
                {active.display}
              </p>
              
              <div className="h-14 flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  <AnimatedPrice value={active.price} />
                </span>
              </div>

              <div className="h-10 mt-4 flex justify-center items-center">
                <AnimatePresence mode="wait">
                  {hemat > 0 ? (
                    <motion.div
                      key="saving-badge"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D84040] bg-[#D84040]/10 border border-[#D84040]/20 rounded-full px-4 py-2"
                    >
                      <TrendingDown size={13} className="animate-bounce" />
                      Hemat {rupiah(hemat)} vs bayar bulanan
                    </motion.div>
                  ) : (
                    <motion.div
                      key="regular-badge"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="text-xs text-white/30"
                    >
                      Tarif standar keanggotaan
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowForm(true);
                  setDone(null);
                  setError(null);
                  setPromoCode("");
                  setAppliedPromo(null);
                  setPromoMessage(null);
                  setPromoError(null);
                }}
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D84040] hover:bg-[#8E1616] text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-[#D84040]/10 transition-colors cursor-pointer"
              >
                Daftar Sekarang
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Modal form pendaftaran dengan AnimatePresence ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => !submitting && setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#241818] border border-white/10 rounded-3xl p-7 shadow-2xl z-10"
            >
              <button
                onClick={() => !submitting && setShowForm(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>

              {done ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Pendaftaran Berhasil!</h3>
                  <p className="text-white/50 text-sm mt-3 leading-relaxed">
                    Selamat bergabung, <span className="text-white font-semibold">{done.nama}</span>.<br />
                    ID member kamu: <span className="text-[#D84040] font-mono font-bold">{done.id}</span>
                  </p>
                  <p className="text-white/30 text-xs mt-2">
                    Gunakan ID ini untuk verifikasi di meja resepsionis Zeus Gym.
                  </p>
                  <button
                    onClick={() => setShowForm(false)}
                    className="mt-8 w-full bg-[#D84040] hover:bg-[#8E1616] text-white font-bold py-3.5 rounded-2xl shadow-lg transition-colors cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">Daftar Keanggotaan</h3>
                  <p className="text-white/40 text-xs mt-1 mb-6">
                    Paket <span className="text-[#D84040] font-bold">{active.display}</span> ·{" "}
                    {appliedPromo ? (
                      <>
                        <span className="line-through text-white/30 mr-1.5">{rupiah(active.price)}</span>
                        <span className="text-emerald-400 font-extrabold">{rupiah(finalPrice)}</span>
                      </>
                    ) : (
                      rupiah(active.price)
                    )}
                  </p>

                  {error && (
                    <div className="mb-4 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3.5">
                    <input
                      name="nama_lengkap"
                      value={form.nama_lengkap}
                      onChange={onField}
                      placeholder="Nama lengkap *"
                      className="w-full px-4 py-3 bg-[#1d1414] border border-white/5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D84040]/50 transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        name="jenis_kelamin"
                        value={form.jenis_kelamin}
                        onChange={onField}
                        className="w-full px-4 py-3 bg-[#1d1414] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-[#D84040]/50 transition-colors"
                      >
                        <option value="L" className="bg-[#241818]">Laki-laki</option>
                        <option value="P" className="bg-[#241818]">Perempuan</option>
                      </select>
                      <input
                        name="tgl_lahir"
                        type="date"
                        value={form.tgl_lahir}
                        onChange={onField}
                        className="w-full px-4 py-3 bg-[#1d1414] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-[#D84040]/50 transition-colors"
                      />
                    </div>
                    <input
                      name="no_hp"
                      value={form.no_hp}
                      onChange={onField}
                      placeholder="Nomor HP * (08xxxxxxxxxx)"
                      className="w-full px-4 py-3 bg-[#1d1414] border border-white/5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D84040]/50 transition-colors"
                    />
                    <input
                      name="alamat"
                      value={form.alamat}
                      onChange={onField}
                      placeholder="Alamat (opsional)"
                      className="w-full px-4 py-3 bg-[#1d1414] border border-white/5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D84040]/50 transition-colors"
                    />

                    {/* Kode Promo Field */}
                    <div className="space-y-1 bg-[#1d1414]/40 p-3 rounded-xl border border-white/5">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">
                        Kode Promo (Opsional)
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Masukkan kode promo..."
                          className="flex-1 px-3 py-2 bg-[#1d1414] border border-white/5 rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D84040]/50 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-3 bg-[#D84040] hover:bg-[#8E1616] text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Pakai
                        </button>
                      </div>
                      {promoError && <p className="text-[10px] text-red-300 font-semibold mt-1">{promoError}</p>}
                      {promoMessage && <p className="text-[10px] text-emerald-400 font-semibold mt-1">{promoMessage}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleDaftar}
                    disabled={submitting}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#D84040] hover:bg-[#8E1616] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-colors cursor-pointer shadow-lg shadow-[#D84040]/10"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Menyimpan...
                      </>
                    ) : (
                      <>Daftar & Simpan</>
                    )}
                  </button>
                  <p className="text-white/20 text-[10px] text-center mt-3">
                    Data disimpan secara aman ke database.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}