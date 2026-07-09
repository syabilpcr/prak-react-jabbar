import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  Users,
  Wallet,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
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

// ── Durasi & harga config (reusable) ─────────────────────────
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

const priceConfig = {
  harian: 50000,
  "1-bulan": 300000,
  "2-bulan": 570000,
  "3-bulan": 810000,
  "4-bulan": 1080000,
  "5-bulan": 1325000,
  "6-bulan": 1560000,
  "7-bulan": 1785000,
  "8-bulan": 2000000,
  "9-bulan": 2205000,
  "10-bulan": 2400000,
  "11-bulan": 2585000,
  "12-bulan": 2760000,
};

const emptyForm = {
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
  promo_code: "",
};

// ── Main Component ────────────────────────────────────────────
const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [successAlert, setSuccessAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ── Modal Tambah ──
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ── Modal Edit ──
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // member yang sedang diedit
  const [editForm, setEditForm] = useState({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // ── Modal Konfirmasi Hapus ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // member yang akan dihapus
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // ── Fetch semua member dari Supabase (dengan paginasi) ──────
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setFetchError(null);

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

        allRows.sort((a, b) => {
          const numA = parseInt((a.id_member || "").replace("M-", ""), 10);
          const numB = parseInt((b.id_member || "").replace("M-", ""), 10);
          return numA - numB;
        });

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

  // ── Filter & Pagination ──────────────────────────────────────
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

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ── Stat helpers ─────────────────────────────────────────────
  const totalActive = members.filter(
    (m) => (m.status_member || m.status) === "aktif" || m.status === "Active",
  ).length;
  const totalExpired = members.filter(
    (m) =>
      (m.status_member || m.status) === "tidak aktif" ||
      m.status === "Expired",
  ).length;
  const totalRevenue = members.reduce(
    (s, m) => s + (m.total_nominal_transaksi ?? m.price ?? 0),
    0,
  );

  // ── Helper: show success alert ────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessAlert(msg);
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  // ══════════════════════════════════════════════════════════════
  // CREATE — Tambah Member
  // ══════════════════════════════════════════════════════════════
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nama_lengkap || !form.no_hp || !form.tgl_lahir) {
      alert("Nama lengkap, nomor HP, dan tanggal lahir wajib diisi!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const selectedDurasi =
      durasiConfig[form.durasi_membership] || durasiConfig["1-bulan"];
    const expiry = new Date(
      Date.now() + selectedDurasi.days * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split("T")[0];

    const generatedPin =
      form.pin_akses || String(Math.floor(100000 + Math.random() * 900000));

    let basePrice = priceConfig[form.durasi_membership] || 300000;
    let finalPrice = basePrice;
    let promoNote = form.catatan_medis || "Tidak ada";

    let isReferralApplied = false;
    let refDataToUpdate = null;

    if (form.promo_code && form.promo_code.trim()) {
      const codeTrimmed = form.promo_code.trim().toUpperCase();
      
      // 1. Coba cari di program referral terlebih dahulu
      const referralConfig = localStorage.getItem("zeus_referral_config");
      if (referralConfig) {
        const refData = JSON.parse(referralConfig);
        if (refData.active && codeTrimmed === refData.code.toUpperCase()) {
          isReferralApplied = true;
          promoNote = `Referral: ${refData.code}. ${form.catatan_medis || ""}`.trim();
          finalPrice = Math.max(0, basePrice * 0.8); // 20% discount sesuai aturan program referral
          
          // Siapkan data teman diajak untuk ditambahkan
          const newFriend = {
            id: Date.now(),
            friendName: form.nama_lengkap,
            date: today,
            status: "Aktif",
            reward: "Rp 25.000"
          };
          
          refDataToUpdate = {
            ...refData,
            history: [newFriend, ...refData.history]
          };
        }
      }

      // 2. Jika bukan referral, cari di promosi umum
      if (!isReferralApplied) {
        const savedPromos = localStorage.getItem("zeus_promotions_v3");
        if (savedPromos) {
          const promoList = JSON.parse(savedPromos);
          const found = promoList.find(
            (p) =>
              p.code.toLowerCase() === form.promo_code.trim().toLowerCase() &&
              p.status === "Aktif",
          );
          if (found) {
            promoNote = `Promo: ${found.code}. ${form.catatan_medis || ""}`.trim();
            const discStr = String(found.discount || "");
            if (discStr.includes("%")) {
              const percent = parseFloat(discStr.replace("%", ""));
              finalPrice = Math.max(0, basePrice * (1 - percent / 100));
            } else {
              const amount = parseFloat(discStr.replace(/[^0-9]/g, ""));
              finalPrice = Math.max(0, basePrice - amount);
            }
          }
        }
      }
    }

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
      catatan_medis: promoNote,
      kontak_darurat: form.kontak_darurat,
      nama_kontak_darurat: form.nama_kontak_darurat,
      frekuensi_transaksi: 1,
      total_nominal_transaksi: finalPrice,
    });

    try {
      setSubmitting(true);
      setSubmitError(null);

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

      const res = await api.post("/member", buildPayload(newIdMember), {
        headers: { Prefer: "return=representation" },
      });

      const inserted = res.data[0] || buildPayload(newIdMember);
      setMembers([{ id: members.length + 1, ...inserted }, ...members]);
      
      // Jika kode referral berhasil diproses, simpan data riwayat baru
      if (isReferralApplied && refDataToUpdate) {
        localStorage.setItem("zeus_referral_config", JSON.stringify(refDataToUpdate));
        window.dispatchEvent(new Event("local-storage-promo-update"));
      }

      setForm(emptyForm);
      setShowModal(false);
      showSuccess(
        `Member ${form.nama_lengkap} berhasil ditambahkan dengan ID ${newIdMember} dan tersimpan ke database.`,
      );
    } catch (err) {
      console.error("Gagal menambahkan member:", err);
      const apiMessage = err.response?.data?.message || "";
      if (apiMessage.includes("duplicate key")) {
        setSubmitError(
          "ID Member yang digenerate ternyata sudah dipakai. Silakan klik 'Simpan Member' sekali lagi.",
        );
      } else {
        setSubmitError(
          apiMessage ||
            "Gagal menyimpan member baru ke server. Periksa koneksi atau hak akses.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // UPDATE — Edit Member
  // ══════════════════════════════════════════════════════════════
  const openEditModal = (member) => {
    setEditTarget(member);
    setEditForm({
      nama_lengkap: member.nama_lengkap || "",
      jenis_kelamin: member.jenis_kelamin || "L",
      tgl_lahir: member.tgl_lahir || "",
      no_hp: member.no_hp || "",
      alamat: member.alamat || "",
      tgl_berakhir: member.tgl_berakhir || "",
      status_member: member.status_member || "aktif",
      pin_akses: member.pin_akses || "",
      catatan_medis: member.catatan_medis || "",
      kontak_darurat: member.kontak_darurat || "",
      nama_kontak_darurat: member.nama_kontak_darurat || "",
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSubmit = async () => {
    if (!editForm.nama_lengkap || !editForm.no_hp) {
      alert("Nama lengkap dan nomor HP wajib diisi!");
      return;
    }

    try {
      setEditSubmitting(true);
      setEditError(null);

      // PATCH ke Supabase: filter by id_member
      await api.patch(
        "/member",
        {
          nama_lengkap: editForm.nama_lengkap,
          jenis_kelamin: editForm.jenis_kelamin,
          tgl_lahir: editForm.tgl_lahir,
          no_hp: editForm.no_hp,
          alamat: editForm.alamat,
          tgl_berakhir: editForm.tgl_berakhir,
          status_member: editForm.status_member,
          pin_akses: editForm.pin_akses,
          catatan_medis: editForm.catatan_medis,
          kontak_darurat: editForm.kontak_darurat,
          nama_kontak_darurat: editForm.nama_kontak_darurat,
        },
        {
          params: { id_member: `eq.${editTarget.id_member}` },
          headers: { Prefer: "return=representation" },
        },
      );

      // Update state lokal
      setMembers((prev) =>
        prev.map((m) =>
          m.id_member === editTarget.id_member
            ? { ...m, ...editForm }
            : m,
        ),
      );

      setShowEditModal(false);
      setEditTarget(null);
      showSuccess(
        `Data member ${editForm.nama_lengkap} (${editTarget.id_member}) berhasil diperbarui.`,
      );
    } catch (err) {
      console.error("Gagal mengupdate member:", err);
      setEditError(
        err.response?.data?.message ||
          "Gagal menyimpan perubahan ke server. Periksa koneksi atau hak akses.",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // DELETE — Hapus Member
  // ══════════════════════════════════════════════════════════════
  const openDeleteModal = (member) => {
    setDeleteTarget(member);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteSubmitting(true);
      setDeleteError(null);

      const idMember = deleteTarget.id_member;

      // ── Langkah 1: Hapus dulu semua data absensi yang terkait member ini
      // (foreign key: absensi.id_member → member.id_member)
      try {
        await api.delete("/absensi", {
          params: { id_member: `eq.${idMember}` },
        });
      } catch (e) {
        // Jika tabel absensi tidak ada atau tidak ada data, lanjut saja
        console.warn("Hapus absensi (opsional):", e?.response?.data?.message || e.message);
      }

      // ── Langkah 2: Hapus dulu semua data transaksi yang terkait member ini
      // (foreign key: transaksi.id_member → member.id_member)
      try {
        await api.delete("/transaksi", {
          params: { id_member: `eq.${idMember}` },
        });
      } catch (e) {
        // Jika tabel transaksi tidak ada atau tidak ada data, lanjut saja
        console.warn("Hapus transaksi (opsional):", e?.response?.data?.message || e.message);
      }

      // ── Langkah 3: Baru hapus member-nya dari Supabase
      await api.delete("/member", {
        params: { id_member: `eq.${idMember}` },
      });

      // ── Update state lokal
      setMembers((prev) =>
        prev.filter((m) => m.id_member !== idMember),
      );

      setShowDeleteModal(false);
      showSuccess(
        `Member ${deleteTarget.nama_lengkap} (${idMember}) beserta data absensi & transaksinya berhasil dihapus dari database.`,
      );
      setDeleteTarget(null);
    } catch (err) {
      console.error("Gagal menghapus member:", err);
      setDeleteError(
        err.response?.data?.message ||
          "Gagal menghapus member dari server. Periksa koneksi atau hak akses.",
      );
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      {/* ── Page Title ── */}
      <div className="flex items-center justify-between animate-slide-down">
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
        <div className="animate-scale-in delay-75 hover-lift">
          <StatCard
            icon={Users}
            label="Total Member"
            value={members.length}
            change="12.5%"
            trend="up"
            sub="dari bulan lalu"
          />
        </div>
        <div className="animate-scale-in delay-100 hover-lift">
          <StatCard
            icon={CalendarCheck}
            label="Member Aktif"
            value={totalActive}
            change="5.3%"
            trend="up"
            sub="dari bulan lalu"
          />
        </div>
        <div className="animate-scale-in delay-150 hover-lift">
          <StatCard
            icon={TrendingUp}
            label="Tidak Aktif"
            value={totalExpired}
            change="2.1%"
            trend="down"
            sub="dari bulan lalu"
          />
        </div>
        <div className="animate-scale-in delay-200 hover-lift">
          <StatCard
            icon={Wallet}
            label="Total Pendapatan"
            value={`Rp ${(totalRevenue / 1000000).toFixed(1)} Jt`}
            change="18.2%"
            trend="up"
            sub="dari bulan lalu"
          />
        </div>
      </div>

      {/* ── Alert error fetch API ── */}
      {fetchError && (
        <Alert variant="destructive" className="relative animate-slide-up-alert">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Gagal Memuat Data</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {/* ── Alert sukses ── */}
      {successAlert && (
        <Alert variant="success" className="relative animate-slide-up-alert">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Berhasil!</AlertTitle>
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
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-slide-up delay-250"
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
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 transition-all duration-200"
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="tidak aktif">Tidak Aktif</option>
            </select>
            <select
              value={filterGender}
              onChange={handleFilterChange(setFilterGender)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20 transition-all duration-200"
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
          <div className="px-6 py-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center justify-between py-3 border-b border-gray-50 animate-pulse">
                <div className="h-4 bg-gray-150 rounded w-8 skeleton" />
                <div className="h-4 bg-gray-150 rounded w-20 skeleton" />
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-8 h-8 bg-gray-150 rounded-full skeleton" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-150 rounded w-3/4 skeleton" />
                    <div className="h-3 bg-gray-150 rounded w-1/2 skeleton" />
                  </div>
                </div>
                <div className="h-4 bg-gray-150 rounded w-6 skeleton" />
                <div className="h-4 bg-gray-150 rounded w-24 skeleton" />
                <div className="h-4 bg-gray-150 rounded w-20 skeleton" />
                <div className="h-4 bg-gray-150 rounded w-20 skeleton" />
                <div className="h-6 bg-gray-150 rounded-full w-16 skeleton" />
                <div className="h-4 bg-gray-150 rounded w-12 skeleton" />
                <div className="h-6 bg-gray-150 rounded w-16 skeleton" />
              </div>
            ))}
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
                  "Aksi",
                ]}
              >
                {currentItems.length === 0
                  ? null
                  : currentItems.map((item, idx) => {
                      return (
                        <tr
                          key={item.id_member}
                          className="hover:bg-[#faf6f4] hover:translate-x-1 hover:shadow-[inset_3px_0_0_0_#8C1007] transition-all duration-200"
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
                                  to={`/members/${encodeURIComponent(item.id_member || item.id)}`}
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

                          {/* ── Kolom Aksi ── */}
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-1.5">
                              {/* Tombol Edit */}
                              <button
                                onClick={() => openEditModal(item)}
                                title="Edit member"
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-150"
                              >
                                <Pencil size={13} />
                              </button>

                              {/* Tombol Delete */}
                              <button
                                onClick={() => openDeleteModal(item)}
                                title="Hapus member"
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-110 transition-all duration-150"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
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

      {/* ══════════════════════════════════════════════════════
          MODAL: Tambah Member (Create)
      ══════════════════════════════════════════════════════ */}
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
              <InputField
                label="Kode Promo (Opsional)"
                name="promo_code"
                value={form.promo_code}
                onChange={handleChange}
                placeholder="Masukkan kode promo aktif..."
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

      {/* ══════════════════════════════════════════════════════
          MODAL: Edit Member (Update)
      ══════════════════════════════════════════════════════ */}
      <Modal
        open={showEditModal}
        onClose={() => !editSubmitting && setShowEditModal(false)}
        title={`Edit Member — ${editTarget?.id_member}`}
        subtitle={`Perbarui data anggota ${editTarget?.nama_lengkap}`}
        footer={
          <div className="flex gap-3">
            <Button
              type="secondary"
              fullWidth
              disabled={editSubmitting}
              onClick={() => setShowEditModal(false)}
            >
              Batal
            </Button>
            <Button
              type="primary"
              fullWidth
              onClick={handleEditSubmit}
              disabled={editSubmitting}
            >
              {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {editError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Gagal Menyimpan</AlertTitle>
              <AlertDescription>{editError}</AlertDescription>
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
                value={editForm.nama_lengkap || ""}
                onChange={handleEditChange}
                placeholder="Nama lengkap member..."
                required
              />
              <SelectField
                label="Jenis Kelamin"
                name="jenis_kelamin"
                value={editForm.jenis_kelamin || "L"}
                onChange={handleEditChange}
                options={[
                  { value: "L", label: "Laki-laki" },
                  { value: "P", label: "Perempuan" },
                ]}
              />
              <InputField
                label="Tanggal Lahir"
                name="tgl_lahir"
                type="date"
                value={editForm.tgl_lahir || ""}
                onChange={handleEditChange}
              />
              <InputField
                label="Nomor HP"
                name="no_hp"
                value={editForm.no_hp || ""}
                onChange={handleEditChange}
                placeholder="08xxxxxxxxxx"
                required
              />
              <InputField
                label="Alamat Lengkap"
                name="alamat"
                value={editForm.alamat || ""}
                onChange={handleEditChange}
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
              <InputField
                label="Tanggal Berakhir"
                name="tgl_berakhir"
                type="date"
                value={editForm.tgl_berakhir || ""}
                onChange={handleEditChange}
              />
              <SelectField
                label="Status Member"
                name="status_member"
                value={editForm.status_member || "aktif"}
                onChange={handleEditChange}
                options={[
                  { value: "aktif", label: "Aktif" },
                  { value: "tidak aktif", label: "Tidak Aktif" },
                ]}
              />
              <InputField
                label="PIN Akses (6 digit)"
                name="pin_akses"
                value={editForm.pin_akses || ""}
                onChange={handleEditChange}
                placeholder="PIN akses member"
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
                value={editForm.nama_kontak_darurat || ""}
                onChange={handleEditChange}
                placeholder="Nama keluarga / kerabat"
              />
              <InputField
                label="Nomor Kontak Darurat"
                name="kontak_darurat"
                value={editForm.kontak_darurat || ""}
                onChange={handleEditChange}
                placeholder="08xxxxxxxxxx"
              />
              <InputField
                label="Catatan Medis"
                name="catatan_medis"
                value={editForm.catatan_medis || ""}
                onChange={handleEditChange}
                placeholder="Riwayat penyakit, alergi, dll (opsional)"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ══════════════════════════════════════════════════════
          MODAL: Konfirmasi Hapus (Delete)
      ══════════════════════════════════════════════════════ */}
      <Modal
        open={showDeleteModal}
        onClose={() => !deleteSubmitting && setShowDeleteModal(false)}
        title="Konfirmasi Hapus Member"
        subtitle="Tindakan ini tidak dapat dibatalkan"
        footer={
          <div className="flex gap-3">
            <Button
              type="secondary"
              fullWidth
              disabled={deleteSubmitting}
              onClick={() => setShowDeleteModal(false)}
            >
              Batal
            </Button>
            <button
              onClick={handleDelete}
              disabled={deleteSubmitting}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all"
            >
              {deleteSubmitting ? "Menghapus..." : "Ya, Hapus Member"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {deleteError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Gagal Menghapus</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          {/* Tampilkan info member yang akan dihapus */}
          <div className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8C1007] to-[#D84040] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {deleteTarget?.nama_lengkap?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-bold text-[#1D1616] text-sm">
                {deleteTarget?.nama_lengkap}
              </p>
              <p className="text-xs text-[#9e7a6e] font-mono">
                {deleteTarget?.id_member}
              </p>
              <p className="text-xs text-[#9e7a6e] mt-0.5">
                {deleteTarget?.no_hp} · Status:{" "}
                <span
                  className={
                    deleteTarget?.status_member === "aktif"
                      ? "text-green-600 font-semibold"
                      : "text-rose-600 font-semibold"
                  }
                >
                  {deleteTarget?.status_member}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs text-amber-700 font-medium">
              ⚠️ <strong>Perhatian:</strong> Menghapus member ini akan
              menghapusnya dari database Supabase secara permanen. Data di
              halaman Pembayaran dan Absensi yang terkait member ini juga tidak
              akan tampil lagi.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Members;
