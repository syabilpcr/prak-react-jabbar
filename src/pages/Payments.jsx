import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import {
  Plus,
  CreditCard,
  QrCode,
  Wallet,
  Smartphone,
  Calendar,
  CalendarDays,
  Clock,
  Loader,
  CheckCircle,
  AlertCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Receipt,
} from "lucide-react";

// ── Pertemuan 13: Consume API ──────────────────────────────
// Data transaksi & member diambil dari REST API Supabase (schema "zeusgym"),
// bukan dari file data statis lagi.
import api from "../lib/api";

// ── Components ────────────────────────────────────────────────
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import SelectField from "../components/SelectField";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/Avatar";

// ── UI Components dari folder ui ──────────────────────────────
import { Input } from "../components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";

// ── Pertemuan 13: Consume API ──────────────────────────────
// Jenis transaksi yang benar-benar ada di data Supabase (kolom jenis_transaksi):
// "Perpanjangan 1 Bulan", "Perpanjangan 3 Bulan", "Perpanjangan 6 Bulan",
// "Perpanjangan 1 Tahun". Tidak ada konsep "metode pembayaran" atau "status"
// di data asli, jadi konfigurasi itu dihapus dari halaman ini.
const jenisTransaksiConfig = {
  "Perpanjangan 1 Bulan": {
    className: "bg-[#8E1616]/10 text-[#8E1616] border border-[#8E1616]/20",
    icon: Clock,
    label: "1 Bulan",
    nominal: 300000,
  },
  "Perpanjangan 3 Bulan": {
    className: "bg-[#D84040]/10 text-[#D84040] border border-[#D84040]/20",
    icon: Calendar,
    label: "3 Bulan",
    nominal: 800000,
  },
  "Perpanjangan 6 Bulan": {
    className: "bg-purple-100 text-purple-700 border border-purple-200",
    icon: CalendarDays,
    label: "6 Bulan",
    nominal: 1500000,
  },
  "Perpanjangan 1 Tahun": {
    className: "bg-[#1D1616]/10 text-[#1D1616] border border-[#1D1616]/20",
    icon: CalendarDays,
    label: "1 Tahun",
    nominal: 2500000,
  },
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [memberMap, setMemberMap] = useState({}); // { id_member: nama_lengkap }
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [form, setForm] = useState({
    id_member: "",
    jenis_transaksi: "Perpanjangan 1 Bulan",
    nominal: "300000",
  });

  // ── Pertemuan 13: Consume API ──────────────────────────────
  // Ambil data transaksi & member dari REST API Supabase (schema "zeusgym").
  // Karena jumlah transaksi besar (ribuan baris) dan Supabase membatasi
  // maksimal 1000 baris per request, data diambil bertahap (paginasi)
  // memakai header "Range" sampai semua baris benar-benar terambil.
  useEffect(() => {
    const fetchAllPaginated = async (path, params = {}) => {
      let allRows = [];
      let from = 0;
      const pageSize = 1000;
      while (true) {
        const res = await api.get(path, {
          params,
          headers: { Range: `${from}-${from + pageSize - 1}` },
        });
        allRows = allRows.concat(res.data);
        if (res.data.length < pageSize) break;
        from += pageSize;
      }
      return allRows;
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        const [memberRows, transaksiRows] = await Promise.all([
          fetchAllPaginated("/member", { select: "id_member,nama_lengkap" }),
          fetchAllPaginated("/transaksi"),
        ]);

        const lookup = {};
        memberRows.forEach((m) => {
          lookup[m.id_member] = m.nama_lengkap;
        });
        setMemberMap(lookup);
        setMembersList(memberRows);

        // Urutkan dari transaksi terbaru ke terlama
        transaksiRows.sort(
          (a, b) => new Date(b.tgl_transaksi) - new Date(a.tgl_transaksi),
        );
        setPayments(transaksiRows);
      } catch (err) {
        console.error("Gagal mengambil data transaksi:", err);
        setFetchError(
          "Gagal memuat data transaksi dari server. Periksa koneksi atau konfigurasi API.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleJenisChange = (e) => {
    const jenis = e.target.value;
    const suggestedNominal = jenisTransaksiConfig[jenis]?.nominal || "";
    setForm({
      ...form,
      jenis_transaksi: jenis,
      nominal: String(suggestedNominal),
    });
  };

  const handleSubmit = async () => {
    if (!form.id_member || !form.nominal) {
      alert("ID Member dan nominal wajib diisi!");
      return;
    }
    if (!memberMap[form.id_member]) {
      alert(
        `ID Member "${form.id_member}" tidak ditemukan. Periksa kembali ID-nya.`,
      );
      return;
    }

    // ── Pertemuan 13: Consume API ──────────────────────────────
    // Payload hanya berisi kolom yang memang ada di table zeusgym.transaksi
    const newPayment = {
      id_transaksi: `TRX-${Date.now()}`,
      id_member: form.id_member,
      tgl_transaksi: new Date().toISOString().slice(0, 19).replace("T", " "),
      jenis_transaksi: form.jenis_transaksi,
      nominal: Number(form.nominal),
    };

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res = await api.post("/transaksi", newPayment, {
        headers: { Prefer: "return=representation" },
      });

      const inserted = res.data[0] || newPayment;
      setPayments([inserted, ...payments]);
      setForm({
        id_member: "",
        jenis_transaksi: "Perpanjangan 1 Bulan",
        nominal: "300000",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Gagal menambahkan transaksi:", err);
      setSubmitError(
        err.response?.data?.message ||
          "Gagal menyimpan transaksi baru ke server. Periksa koneksi atau hak akses (GRANT INSERT).",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = payments.filter((p) => {
    const namaMember = memberMap[p.id_member] || "";
    const matchSearch =
      namaMember.toLowerCase().includes(search.toLowerCase()) ||
      p.id_member?.toLowerCase().includes(search.toLowerCase()) ||
      p.id_transaksi?.toLowerCase().includes(search.toLowerCase());
    const matchJenis =
      filterJenis === "all" || p.jenis_transaksi === filterJenis;
    return matchSearch && matchJenis;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const totalRevenue = payments.reduce((sum, p) => sum + (p.nominal || 0), 0);
  const avgPerTransaksi = payments.length ? totalRevenue / payments.length : 0;

  // Jenis transaksi paling populer (berdasarkan jumlah kemunculan)
  const jenisCount = payments.reduce((acc, p) => {
    acc[p.jenis_transaksi] = (acc[p.jenis_transaksi] || 0) + 1;
    return acc;
  }, {});
  const jenisTerpopuler =
    Object.entries(jenisCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  if (loading && payments.length === 0 && !fetchError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader
            size={40}
            className="text-[#8E1616] animate-spin mx-auto mb-4"
          />
          <p className="text-gray-500">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      {/* ── Page Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">Pembayaran</h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Kelola semua transaksi pembayaran Zeus Gym
          </p>
        </div>
        <Button type="primary" icon={Plus} onClick={() => setShowModal(true)}>
          Pembayaran Baru
        </Button>
      </div>

      {/* ── Pertemuan 13: Alert error fetch API ── */}
      {fetchError && (
        <Alert variant="destructive" className="relative">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Gagal Memuat Data</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CreditCard}
          label="Total Pendapatan"
          value={`Rp ${(totalRevenue / 1000000).toFixed(1)} Jt`}
          change="+18.2%"
          trend="up"
          sub="seluruh transaksi"
        />
        <StatCard
          icon={Wallet}
          label="Total Transaksi"
          value={payments.length.toLocaleString("id-ID")}
          change="+12.5%"
          trend="up"
          sub="semua transaksi"
        />
        <StatCard
          icon={TrendingUp}
          label="Rata-rata / Transaksi"
          value={`Rp ${(avgPerTransaksi / 1000).toFixed(0)} Rb`}
          change="+5.3%"
          trend="up"
          sub="per transaksi"
        />
        <StatCard
          icon={Receipt}
          label="Jenis Terpopuler"
          value={
            jenisTransaksiConfig[jenisTerpopuler]?.label || jenisTerpopuler
          }
          change=""
          trend="up"
          sub="paling sering dipilih"
        />
      </div>

      {/* ── Tabel ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        {/* Header tabel */}
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1616]">
                Transaksi Pembayaran
              </p>
              <p className="text-xs text-[#9e7a6e]">
                {filtered.length} dari {payments.length} transaksi
              </p>
            </div>
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari pembayaran..."
              className="w-52"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">
              Filter:
            </span>
            <select
              value={filterJenis}
              onChange={handleFilterChange(setFilterJenis)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Jenis Transaksi</option>
              <option value="Perpanjangan 1 Bulan">Perpanjangan 1 Bulan</option>
              <option value="Perpanjangan 3 Bulan">Perpanjangan 3 Bulan</option>
              <option value="Perpanjangan 6 Bulan">Perpanjangan 6 Bulan</option>
              <option value="Perpanjangan 1 Tahun">Perpanjangan 1 Tahun</option>
            </select>
            {filterJenis !== "all" && (
              <button
                onClick={() => {
                  setFilterJenis("all");
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold hover:bg-red-100 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={[
              "ID Transaksi",
              "Anggota",
              "ID Member",
              "Jenis Transaksi",
              "Nominal",
              "Tanggal",
            ]}
          >
            {currentItems.length === 0
              ? null
              : currentItems.map((payment) => {
                  const jenisStyle =
                    jenisTransaksiConfig[payment.jenis_transaksi] ||
                    jenisTransaksiConfig["Perpanjangan 1 Bulan"];
                  const JenisIcon = jenisStyle.icon;
                  const namaMember =
                    memberMap[payment.id_member] || "Member tidak ditemukan";

                  return (
                    <tr
                      key={payment.id_transaksi}
                      className="hover:bg-[#faf6f4] transition-colors"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-[#9e7a6e] font-semibold">
                        {payment.id_transaksi}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={namaMember} size="sm" />
                          <span className="font-semibold text-[#1D1616] text-sm">
                            {namaMember}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-[#9e7a6e]">
                        {payment.id_member}
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge type="info" dot>
                          <JenisIcon size={11} className="inline mr-1" />
                          {jenisStyle.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-[#8C1007]">
                        Rp {(payment.nominal || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-[#9e7a6e]">
                        {payment.tgl_transaksi}
                      </td>
                    </tr>
                  );
                })}
          </Table>
        </div>

        {currentItems.length === 0 && (
          <EmptyState
            icon="🔍"
            title="Tidak ada transaksi ditemukan"
            message="Coba dengan kata kunci lain atau tambah transaksi baru"
          />
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-[#9e7a6e]">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filtered.length)} of {filtered.length}{" "}
              results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-[#5a3030] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        currentPage === pageNumber
                          ? "bg-[#0d6efd] text-white"
                          : "border border-gray-200 text-[#5a3030] hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="text-xs text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-[#5a3030] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Tambah Pembayaran ── */}
      <Modal
        open={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title="Catat Transaksi Baru"
        subtitle="Masukkan ID Member dan jenis perpanjangan membership"
        footer={
          <div className="flex gap-3">
            <Button
              type="secondary"
              fullWidth
              disabled={submitting}
              onClick={() => setShowModal(false)}
            >
              Batal
            </Button>
            <Button
              type="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Transaksi"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* ── Pertemuan 13: Error simpan ke API ── */}
          {submitError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Gagal Menyimpan</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <SelectField
            label="Pilih Anggota Gym"
            name="id_member"
            value={form.id_member}
            onChange={handleChange}
            options={[
              { value: "", label: "Pilih Anggota..." },
              ...membersList.map((m) => ({
                value: m.id_member,
                label: `${m.nama_lengkap} (${m.id_member})`,
              })),
            ]}
          />
          <SelectField
            label="Jenis Transaksi"
            name="jenis_transaksi"
            value={form.jenis_transaksi}
            onChange={handleJenisChange}
            options={[
              {
                value: "Perpanjangan 1 Bulan",
                label: "Perpanjangan 1 Bulan (Rp 300.000)",
              },
              {
                value: "Perpanjangan 3 Bulan",
                label: "Perpanjangan 3 Bulan (Rp 800.000)",
              },
              {
                value: "Perpanjangan 6 Bulan",
                label: "Perpanjangan 6 Bulan (Rp 1.500.000)",
              },
              {
                value: "Perpanjangan 1 Tahun",
                label: "Perpanjangan 1 Tahun (Rp 2.500.000)",
              },
            ]}
          />
          <div>
            <label className="block text-xs font-bold text-[#9e7a6e] mb-1.5 uppercase tracking-wide">
              Nominal (Rp) <span className="text-[#8C1007] ml-1">*</span>
            </label>
            <Input
              name="nominal"
              type="number"
              value={form.nominal}
              onChange={handleChange}
              placeholder="0"
              required
              className="bg-[#f8f3ee] border-[#e8dfd6]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payments;
