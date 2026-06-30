import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Users,
  Wallet,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import api from "../lib/api";

// ── Components ────────────────────────────────────────────────
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";

// ── UI Components dari folder ui ──────────────────────────────
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";

// ── Main Component ────────────────────────────────────────────
const Members = () => {
  // ── Pertemuan 13: Consume API ──────────────────────────────
  // members diambil dari REST API Supabase (schema "zeusgym", table "member"),
  // bukan dari file data statis lagi.
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [successAlert, setSuccessAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [form, setForm] = useState({
    nama_lengkap: "",
    jenis_kelamin: "L",
    tgl_lahir: "",
    no_hp: "",
    alamat: "",
    status_member: "aktif",
    pin_akses: "",
    catatan_medis: "",
    kontak_darurat: "",
    nama_kontak_darurat: "",
    durasi_membership: "1-bulan", // default 1 bulan
  });

  // ── Pertemuan 13: Consume API ──────────────────────────────
  // Ambil data member dari REST API Supabase saat komponen pertama kali dimuat.
  // Endpoint: GET {SUPABASE_URL}/rest/v1/member (schema "zeusgym")
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // Supabase membatasi maksimal 1000 baris per request (lihat setting
        // "Max rows" di Data API). Karena jumlah member sudah melebihi 1000,
        // data diambil bertahap (paginasi) memakai header "Range" sampai
        // semua baris benar-benar terambil — bukan hanya 1000 baris pertama.
        let allRows = [];
        let from = 0;
        const pageSize = 1000;
        while (true) {
          const pageRes = await api.get("/member", {
            headers: { Range: `${from}-${from + pageSize - 1}` },
          });
          allRows = allRows.concat(pageRes.data);
          if (pageRes.data.length < pageSize) break;
          from += pageSize;
        }

        // Urutkan berdasarkan angka pada id_member (bukan ORDER BY di server,
        // yang akan mengurutkan "M-999" vs "M-2001" secara teks/string —
        // hasilnya salah karena bukan urutan angka yang sebenarnya).
        allRows.sort((a, b) => {
          const numA = parseInt((a.id_member || "").replace("M-", ""), 10);
          const numB = parseInt((b.id_member || "").replace("M-", ""), 10);
          return numA - numB;
        });

        // Tambahkan field bantu "id" (numerik) supaya tetap kompatibel
        // dengan komponen lain yang masih mengandalkan urutan index,
        // tanpa mengubah data asli dari Supabase.
        const withId = allRows.map((m, idx) => ({ id: idx + 1, ...m }));
        setMembers(withId);
      } catch (err) {
        console.error("Gagal mengambil data member:", err);
        setFetchError(
          "Gagal memuat data member dari server. Periksa koneksi atau konfigurasi API.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filtered = members.filter((m) => {
    const nama = (m.nama_lengkap || m.name || "").toLowerCase();
    const kode = (m.id_member || m.code || "").toLowerCase();
    const matchSearch =
      nama.includes(search.toLowerCase()) ||
      kode.includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (m.status_member || m.status || "").toLowerCase() === filterStatus;
    const matchGender =
      filterGender === "all" || m.jenis_kelamin === filterGender;
    return matchSearch && matchStatus && matchGender;
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

  // Reset ke halaman 1 saat filter berubah
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const totalActive = members.filter(
    (m) => (m.status_member || m.status) === "aktif" || m.status === "Active",
  ).length;
  const totalExpired = members.filter(
    (m) =>
      (m.status_member || m.status) === "tidak aktif" || m.status === "Expired",
  ).length;
  const totalRevenue = members.reduce(
    (s, m) => s + (m.total_nominal_transaksi ?? m.price ?? 0),
    0,
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nama_lengkap || !form.no_hp || !form.tgl_lahir) {
      alert("Nama lengkap, nomor HP, dan tanggal lahir wajib diisi!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    // Hitung tanggal berakhir berdasarkan durasi
    const durasiConfig = {
      harian: { days: 1 },
      "1-bulan": { days: 30 },
      "2-bulan": { days: 60 },
      "3-bulan": { days: 90 },
      "4-bulan": { days: 120 },
      "5-bulan": { days: 150 },
      "6-bulan": { days: 180 },
      "7-bulan": { days: 210 },
      "8-bulan": { days: 240 },
      "9-bulan": { days: 270 },
      "10-bulan": { days: 300 },
      "11-bulan": { days: 330 },
      "12-bulan": { days: 365 },
    };

    const selectedDurasi =
      durasiConfig[form.durasi_membership] || durasiConfig["1-bulan"];
    const expiry = new Date(
      Date.now() + selectedDurasi.days * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split("T")[0];

    // Generate PIN jika tidak diisi
    const generatedPin =
      form.pin_akses || String(Math.floor(100000 + Math.random() * 900000));

    // ── Pertemuan 13: Consume API ──────────────────────────────
    // Payload hanya berisi kolom yang memang ada di table zeusgym.member
    const buildPayload = (idMember) => ({
      id_member: idMember,
      nama_lengkap: form.nama_lengkap,
      jenis_kelamin: form.jenis_kelamin,
      tgl_lahir: form.tgl_lahir,
      no_hp: form.no_hp,
      alamat: form.alamat,
      tgl_gabung: today,
      tgl_berakhir: expiry,
      status_member: form.status_member,
      pin_akses: generatedPin,
      catatan_medis: form.catatan_medis || "Tidak ada",
      kontak_darurat: form.kontak_darurat,
      nama_kontak_darurat: form.nama_kontak_darurat,
      frekuensi_transaksi: 0,
      total_nominal_transaksi: 0,
    });

    try {
      setSubmitting(true);
      setSubmitError(null);

      // Ambil SEMUA id_member langsung dari Supabase (bukan dari state lokal
      // yang bisa basi), lalu cari angka terbesar secara NUMERIK di JavaScript.
      // Catatan: id_member adalah kolom text, jadi "ORDER BY id_member DESC"
      // di server akan mengurutkan secara string (mis. "M-999" > "M-2001"),
      // BUKAN secara angka — itu sebabnya perhitungan harus dilakukan di sini.
      // Catatan: Supabase membatasi maksimal 1000 baris per request (lihat
      // setting "Max rows" di Data API). Karena jumlah member sudah/akan
      // melebihi 1000, kita ambil semua id_member dengan paginasi memakai
      // header "Range" sampai tidak ada baris baru lagi.
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

      const existingNumbers = allIds
        .map((m) => parseInt((m.id_member || "").replace("M-", ""), 10))
        .filter((n) => !isNaN(n));
      const nextNumber =
        (existingNumbers.length ? Math.max(...existingNumbers) : 1000) + 1;
      const newIdMember = `M-${nextNumber}`;

      // POST ke REST API Supabase — "Prefer: return=representation" agar
      // baris yang baru dibuat dikembalikan oleh server (termasuk default value-nya).
      const res = await api.post("/member", buildPayload(newIdMember), {
        headers: { Prefer: "return=representation" },
      });

      const inserted = res.data[0] || buildPayload(newIdMember);
      setMembers([{ id: members.length + 1, ...inserted }, ...members]);
      setForm({
        nama_lengkap: "",
        jenis_kelamin: "L",
        tgl_lahir: "",
        no_hp: "",
        alamat: "",
        status_member: "aktif",
        pin_akses: "",
        catatan_medis: "",
        kontak_darurat: "",
        nama_kontak_darurat: "",
        durasi_membership: "1-bulan",
      });
      setShowModal(false);
      setSuccessAlert(
        `Member ${form.nama_lengkap} berhasil ditambahkan dengan ID ${newIdMember} dan tersimpan ke database.`,
      );
      setTimeout(() => setSuccessAlert(null), 4000);
    } catch (err) {
      console.error("Gagal menambahkan member:", err);
      const apiMessage = err.response?.data?.message || "";
      if (apiMessage.includes("duplicate key")) {
        setSubmitError(
          "ID Member yang digenerate ternyata sudah dipakai (kemungkinan ada penambahan data lain barengan). Silakan klik 'Simpan Member' sekali lagi.",
        );
      } else {
        setSubmitError(
          apiMessage ||
            "Gagal menyimpan member baru ke server. Periksa koneksi atau hak akses (GRANT INSERT).",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      {/* ── Page Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">Anggota Gym</h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Kelola semua data anggota Zeus Gym
          </p>
        </div>
        <Button type="primary" icon={Plus} onClick={() => setShowModal(true)}>
          Tambah Member
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Member"
          value={members.length}
          change="12.5%"
          trend="up"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={CalendarCheck}
          label="Member Aktif"
          value={totalActive}
          change="5.3%"
          trend="up"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={TrendingUp}
          label="Tidak Aktif"
          value={totalExpired}
          change="2.1%"
          trend="down"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={Wallet}
          label="Total Pendapatan"
          value={`Rp ${(totalRevenue / 1000000).toFixed(1)} Jt`}
          change="18.2%"
          trend="up"
          sub="dari bulan lalu"
        />
      </div>

      {/* ── Pertemuan 13: Alert error fetch API ── */}
      {fetchError && (
        <Alert variant="destructive" className="relative">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Gagal Memuat Data</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {/* ── Alert sukses tambah member (UI Component dari folder ui) ── */}
      {successAlert && (
        <Alert variant="success" className="relative">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Member Berhasil Ditambahkan!</AlertTitle>
          <AlertDescription>{successAlert}</AlertDescription>
          <button
            onClick={() => setSuccessAlert(null)}
            className="absolute top-3 right-3 text-green-600 hover:text-green-800 transition-colors"
          >
            ✕
          </button>
        </Alert>
      )}

      {/* ── Tabel ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        {/* Header tabel */}
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1616]">Daftar Member</p>
              <p className="text-xs text-[#9e7a6e]">
                {filtered.length} dari {members.length} member
              </p>
            </div>
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari nama / ID..."
              className="w-52"
            />
          </div>
          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">
              Filter:
            </span>
            <select
              value={filterStatus}
              onChange={handleFilterChange(setFilterStatus)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="tidak aktif">Tidak Aktif</option>
            </select>
            <select
              value={filterGender}
              onChange={handleFilterChange(setFilterGender)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Gender</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            {(filterStatus !== "all" || filterGender !== "all") && (
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterGender("all");
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold hover:bg-red-100 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-3 border-[#8C1007] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#9e7a6e]">
              Memuat data member dari server...
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table
                headers={[
                  "#",
                  "ID Member",
                  "Nama Lengkap",
                  "JK",
                  "No HP",
                  "Tgl Gabung",
                  "Tgl Berakhir",
                  "Status",
                  "Pin Akses",
                ]}
              >
                {currentItems.length === 0
                  ? null
                  : currentItems.map((item, idx) => {
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[#faf6f4] transition-colors"
                        >
                          <td className="px-6 py-3.5 text-xs text-[#9e7a6e] font-medium">
                            {indexOfFirstItem + idx + 1}
                          </td>

                          <td className="px-6 py-3.5 font-mono text-xs text-[#9e7a6e] font-semibold">
                            {item.id_member || item.code}
                          </td>

                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar
                                name={item.nama_lengkap || item.name}
                                size="sm"
                              />
                              <div>
                                <Link
                                  to={`/members/${item.id}`}
                                  className="font-semibold text-[#8C1007] hover:text-[#a01a0a] hover:underline transition-colors text-sm"
                                >
                                  {item.nama_lengkap || item.name}
                                </Link>
                                <p className="text-[10px] text-[#9e7a6e]">
                                  {item.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-3.5 text-xs text-[#5a3030] text-center">
                            <Badge
                              type={
                                item.jenis_kelamin === "L" ? "info" : "warning"
                              }
                            >
                              {item.jenis_kelamin === "L" ? "L" : "P"}
                            </Badge>
                          </td>

                          <td className="px-6 py-3.5 text-xs text-[#5a3030]">
                            {item.no_hp || item.phone}
                          </td>

                          <td className="px-6 py-3.5 text-xs text-[#5a3030]">
                            {item.tgl_gabung || item.joined}
                          </td>

                          <td className="px-6 py-3.5 text-xs text-[#5a3030]">
                            {item.tgl_berakhir || item.expiry}
                          </td>

                          <td className="px-6 py-3.5">
                            <Badge
                              type={
                                (item.status_member || item.status) ===
                                  "aktif" || item.status === "Active"
                                  ? "success"
                                  : "danger"
                              }
                              dot
                            >
                              {item.status_member || item.status}
                            </Badge>
                          </td>

                          <td className="px-6 py-3.5 font-mono text-xs text-[#8C1007] font-bold">
                            {item.pin_akses || "-"}
                          </td>
                        </tr>
                      );
                    })}
              </Table>
            </div>

            {currentItems.length === 0 && (
              <EmptyState
                icon="🔍"
                title="Member tidak ditemukan"
                message="Coba ubah kata kunci pencarian Anda."
              />
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-[#9e7a6e]">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filtered.length)} of{" "}
                  {filtered.length} results
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
                    // Tampilkan halaman pertama, terakhir, current, dan 2 halaman di sekitar current
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
                        <span
                          key={pageNumber}
                          className="text-xs text-gray-400"
                        >
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
          </>
        )}
      </div>

      {/* ── Modal Tambah Member ── */}
      <Modal
        open={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title="Tambah Member Baru"
        subtitle="Isi data member dengan lengkap (13 Atribut)"
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
              {submitting ? "Menyimpan..." : "Simpan Member"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* ── Pertemuan 13: Error simpan ke API ── */}
          {submitError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Gagal Menyimpan</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Data Pribadi */}
          <div className="bg-[#f8f3ee] p-3 rounded-lg border border-[#e8dfd6]">
            <p className="text-xs font-bold text-[#8C1007] mb-2">
              📋 DATA PRIBADI
            </p>
            <div className="space-y-3">
              <InputField
                label="Nama Lengkap"
                name="nama_lengkap"
                value={form.nama_lengkap}
                onChange={handleChange}
                placeholder="Nama lengkap member..."
                required
              />
              <SelectField
                label="Jenis Kelamin"
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
                options={[
                  { value: "L", label: "Laki-laki" },
                  { value: "P", label: "Perempuan" },
                ]}
              />
              <InputField
                label="Tanggal Lahir"
                name="tgl_lahir"
                type="date"
                value={form.tgl_lahir}
                onChange={handleChange}
                required
              />
              <InputField
                label="Nomor HP"
                name="no_hp"
                value={form.no_hp}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                required
              />
              <InputField
                label="Alamat Lengkap"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Jl. Nama Jalan No. XX, Kelurahan, Kota"
              />
            </div>
          </div>

          {/* Keanggotaan */}
          <div className="bg-[#f8f3ee] p-3 rounded-lg border border-[#e8dfd6]">
            <p className="text-xs font-bold text-[#8C1007] mb-2">
              🎫 KEANGGOTAAN
            </p>
            <div className="space-y-3">
              <SelectField
                label="Durasi Membership"
                name="durasi_membership"
                value={form.durasi_membership}
                onChange={handleChange}
                options={[
                  { value: "harian", label: "Harian — Rp 50.000" },
                  { value: "1-bulan", label: "1 Bulan — Rp 300.000" },
                  { value: "2-bulan", label: "2 Bulan — Rp 570.000" },
                  { value: "3-bulan", label: "3 Bulan — Rp 810.000" },
                  { value: "4-bulan", label: "4 Bulan — Rp 1.080.000" },
                  { value: "5-bulan", label: "5 Bulan — Rp 1.325.000" },
                  { value: "6-bulan", label: "6 Bulan — Rp 1.560.000" },
                  { value: "7-bulan", label: "7 Bulan — Rp 1.785.000" },
                  { value: "8-bulan", label: "8 Bulan — Rp 2.000.000" },
                  { value: "9-bulan", label: "9 Bulan — Rp 2.205.000" },
                  { value: "10-bulan", label: "10 Bulan — Rp 2.400.000" },
                  { value: "11-bulan", label: "11 Bulan — Rp 2.585.000" },
                  {
                    value: "12-bulan",
                    label: "12 Bulan / 1 Tahun — Rp 2.760.000",
                  },
                ]}
              />
              <SelectField
                label="Status Member"
                name="status_member"
                value={form.status_member}
                onChange={handleChange}
                options={[
                  { value: "aktif", label: "Aktif" },
                  { value: "tidak aktif", label: "Tidak Aktif" },
                ]}
              />
              <InputField
                label="PIN Akses (6 digit)"
                name="pin_akses"
                value={form.pin_akses}
                onChange={handleChange}
                placeholder="Kosongkan untuk generate otomatis"
                maxLength={6}
              />
            </div>
          </div>

          {/* Kontak Darurat & Medis */}
          <div className="bg-[#f8f3ee] p-3 rounded-lg border border-[#e8dfd6]">
            <p className="text-xs font-bold text-[#8C1007] mb-2">
              🏥 KONTAK DARURAT & MEDIS
            </p>
            <div className="space-y-3">
              <InputField
                label="Nama Kontak Darurat"
                name="nama_kontak_darurat"
                value={form.nama_kontak_darurat}
                onChange={handleChange}
                placeholder="Nama keluarga / kerabat"
              />
              <InputField
                label="Nomor Kontak Darurat"
                name="kontak_darurat"
                value={form.kontak_darurat}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
              <InputField
                label="Catatan Medis"
                name="catatan_medis"
                value={form.catatan_medis}
                onChange={handleChange}
                placeholder="Riwayat penyakit, alergi, dll (opsional)"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              ℹ️ <strong>Info:</strong> ID Member, tanggal gabung, dan tanggal
              berakhir akan dibuat otomatis berdasarkan durasi yang dipilih. PIN
              akan di-generate jika tidak diisi. Harga disesuaikan dengan durasi
              membership.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Members;
