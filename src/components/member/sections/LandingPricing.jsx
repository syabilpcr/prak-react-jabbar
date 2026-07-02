import { useState } from "react";
import { Zap, Star, Crown, TrendingDown, ArrowRight, X, CheckCircle2, Loader2 } from "lucide-react";
import Reveal from "../Reveal";
import api from "../../../lib/api";

/*
  LandingPricing — menggantikan section Trainers.
  Interaktif:
  - Toggle tagihan Bulanan / Tahunan (harga ikut berubah, tahunan lebih hemat)
  - Kartu paket bisa diklik untuk dipilih (highlight aktif)
*/
// Harga sesuai data membership Zeus Gym (durasi, bukan paket bertingkat)
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
  { label: "Harian", icon: Zap, tagline: "Coba dulu tanpa komitmen", price: 50000, unit: "hari" },
  { label: "Bulanan", icon: Star, tagline: "Paling fleksibel & populer", price: 300000, unit: "bulan", popular: true },
  { label: "Tahunan", icon: Crown, tagline: "Paling hemat untuk setahun", price: 2760000, unit: "tahun" },
];

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

export default function LandingPricing() {
  const [selected, setSelected] = useState(1); // default 1 Bulan
  const active = durations.find((d) => d.value === selected) || durations[1];

  // hitung hemat dibanding harga harian/bulanan setara
  const perMonthBaseline = 300000;
  const months = typeof active.value === "number" ? active.value : 0;
  const baseline = months > 0 ? months * perMonthBaseline : 0;
  const hemat = baseline > active.price ? baseline - active.price : 0;

  // ── Form pendaftaran (tersimpan ke Supabase, muncul di admin Members) ──
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

  const onField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Konversi durasi terpilih ke format yang dipakai admin ("harian" | "N-bulan")
  const durasiKey =
    selected === "harian" ? "harian" : `${selected}-bulan`;
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

      // Generate id_member NUMERIK terbesar + 1 (paginasi, sama seperti admin)
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
        catatan_medis: "Tidak ada",
        kontak_darurat: "-",
        nama_kontak_darurat: "-",
        frekuensi_transaksi: 0,
        total_nominal_transaksi: 0,
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
    <section id="pricing" className="bg-[#1D1616] py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D84040] mb-4">
              Harga Keanggotaan
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              MULAI DARI <span className="text-[#D84040]">Rp 50 RIBU</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/45 mt-5 text-[15px]">
              Bayar sesuai durasi yang kamu mau. Makin lama, makin hemat.
            </p>
          </Reveal>
        </div>

        {/* Kartu highlight cepat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-14">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <Reveal key={h.label} delay={i * 120} direction="up" className="h-full">
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl border p-7 transition-all duration-300 flex flex-col ${
                    h.popular
                      ? "border-[#D84040] bg-[#2A1A1A] shadow-2xl shadow-[#D84040]/10 md:-translate-y-2"
                      : "border-white/[0.06] bg-[#241818] hover:border-[#D84040]/40"
                  }`}
                >
                  {h.popular && (
                    <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#D84040] rounded-full px-3 py-1">
                      Populer
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                      h.popular ? "bg-[#D84040]" : "bg-white/[0.06] group-hover:bg-[#D84040]/80"
                    }`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{h.label}</h3>
                  <p className="text-white/40 text-[13px] mt-1">{h.tagline}</p>
                  <div className="mt-5">
                    <span className="text-3xl font-extrabold text-white">
                      {rupiah(h.price)}
                    </span>
                    <span className="text-white/40 text-sm">/{h.unit}</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Kalkulator durasi interaktif */}
        <Reveal delay={120} direction="scale">
          <div className="max-w-3xl mx-auto rounded-2xl border border-white/[0.06] bg-[#241818] p-7 md:p-9">
            <p className="text-center text-white/70 text-sm mb-6">
              Pilih durasi keanggotaan untuk melihat harganya
            </p>

            {/* Tombol durasi (klik untuk memilih) */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelected(d.value)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    selected === d.value
                      ? "bg-[#D84040] text-white shadow-lg shadow-[#D84040]/20"
                      : "bg-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {d.short}
                </button>
              ))}
            </div>

            {/* Ringkasan harga terpilih */}
            <div className="text-center border-t border-white/[0.06] pt-7">
              <p className="text-white/40 text-[13px] uppercase tracking-wider mb-2">
                {active.display}
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl md:text-5xl font-extrabold text-white">
                  {rupiah(active.price)}
                </span>
              </div>

              {hemat > 0 && (
                <div className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-semibold text-[#D84040] bg-[#D84040]/10 border border-[#D84040]/30 rounded-full px-3 py-1.5">
                  <TrendingDown size={14} />
                  Hemat {rupiah(hemat)} vs bayar bulanan
                </div>
              )}

              <button
                onClick={() => { setShowForm(true); setDone(null); setError(null); }}
                className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D84040] hover:bg-[#8E1616] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
              >
                Daftar Sekarang
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Modal Pendaftaran (simpan ke Supabase → muncul di admin Members) ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !submitting && setShowForm(false)}
          />
          <div className="relative w-full max-w-md bg-[#241818] border border-white/10 rounded-2xl p-7 shadow-2xl">
            <button
              onClick={() => !submitting && setShowForm(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            {done ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#D84040]/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={30} className="text-[#D84040]" />
                </div>
                <h3 className="text-xl font-bold text-white">Pendaftaran Berhasil!</h3>
                <p className="text-white/50 text-sm mt-2">
                  Selamat bergabung, <span className="text-white font-semibold">{done.nama}</span>.
                  ID member kamu <span className="text-[#D84040] font-mono font-semibold">{done.id}</span>.
                  Data sudah tersimpan dan muncul di panel admin.
                </p>
                <button
                  onClick={() => setShowForm(false)}
                  className="mt-6 w-full bg-[#D84040] hover:bg-[#8E1616] text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Daftar Keanggotaan</h3>
                <p className="text-white/45 text-[13px] mb-5">
                  Paket <span className="text-[#D84040] font-semibold">{active.display}</span> · {rupiah(active.price)}
                </p>

                {error && (
                  <div className="mb-4 text-[13px] text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <input
                    name="nama_lengkap"
                    value={form.nama_lengkap}
                    onChange={onField}
                    placeholder="Nama lengkap *"
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D84040] transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      name="jenis_kelamin"
                      value={form.jenis_kelamin}
                      onChange={onField}
                      className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D84040] transition-colors"
                    >
                      <option value="L" className="bg-[#241818]">Laki-laki</option>
                      <option value="P" className="bg-[#241818]">Perempuan</option>
                    </select>
                    <input
                      name="tgl_lahir"
                      type="date"
                      value={form.tgl_lahir}
                      onChange={onField}
                      className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D84040] transition-colors"
                    />
                  </div>
                  <input
                    name="no_hp"
                    value={form.no_hp}
                    onChange={onField}
                    placeholder="Nomor HP * (08xxxxxxxxxx)"
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D84040] transition-colors"
                  />
                  <input
                    name="alamat"
                    value={form.alamat}
                    onChange={onField}
                    placeholder="Alamat (opsional)"
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D84040] transition-colors"
                  />
                </div>

                <button
                  onClick={handleDaftar}
                  disabled={submitting}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#D84040] hover:bg-[#8E1616] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>Daftar & Simpan</>
                  )}
                </button>
                <p className="text-white/30 text-[11px] text-center mt-3">
                  Data disimpan ke sistem dan langsung tampil di panel admin.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}