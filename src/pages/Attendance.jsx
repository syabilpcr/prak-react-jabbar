import { useState, useEffect } from "react";
import QRCodeModal from "../components/QRCodeModal";
import {
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  Scan,
  Loader,
  LogOut,
  Trash2,
} from "lucide-react";

// ── Components ────────────────────────────────────────────────
import SearchBar from "../components/SearchBar";
import Badge from "../components/Badge";
import Table from "../components/Table";
import Avatar from "../components/Avatar";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import SelectField from "../components/SelectField";
import Button from "../components/Button";

// ── Data absensi & member diambil dari REST API Supabase (schema "zeusgym") ──
import api from "../lib/api";

const statusConfig = {
  Aktif: {
    className: "bg-green-100 text-green-700 border border-green-200",
    icon: Clock,
    label: "Aktif",
  },
  Selesai: {
    className: "bg-blue-100 text-blue-700 border border-blue-200",
    icon: CheckCircle,
    label: "Selesai",
  },
  Absen: {
    className: "bg-red-100 text-red-700 border border-red-200",
    icon: XCircle,
    label: "Absen",
  },
};

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [memberMap, setMemberMap] = useState({}); // { id_member: nama_lengkap }
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [scannedMember, setScannedMember] = useState(null);

  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ── State modal check-in (pilih member dari dropdown) ──
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  // ── Ambil data absensi & member dari Supabase saat komponen mount ──
  // Supabase membatasi 1000 baris per request, jadi diambil bertahap (paginasi)
  // memakai header "Range" sampai semua baris terambil.
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
        const [memberRows, absensiRows] = await Promise.all([
          fetchAllPaginated("/member", { select: "id_member,nama_lengkap" }),
          fetchAllPaginated("/absensi"),
        ]);

        const lookup = {};
        memberRows.forEach((m) => {
          lookup[m.id_member] = m.nama_lengkap;
        });
        setMemberMap(lookup);

        // Urutkan terbaru dulu (berdasarkan tanggal, lalu jam masuk)
        absensiRows.sort((a, b) => {
          const d = new Date(b.tgl_absensi) - new Date(a.tgl_absensi);
          if (d !== 0) return d;
          return (b.jam_masuk || "").localeCompare(a.jam_masuk || "");
        });
        setAttendance(absensiRows);
      } catch (err) {
        console.error("Gagal mengambil data absensi:", err);
        setFetchError(
          "Gagal memuat data absensi dari server. Periksa koneksi atau pastikan tabel 'absensi' sudah dibuat.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const jamSekarang = () =>
    new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ── CREATE: Check-in member terpilih ke Supabase ──────────────
  // Alur: pilih member dari dropdown → kalau sudah ada sesi "Aktif"
  // hari ini, tolak (harus check-out dulu). Kalau belum, buat record baru.
  const handleCheckIn = async () => {
    if (!selectedMemberId) {
      setModalError("Pilih anggota terlebih dahulu.");
      return;
    }

    const namaMember = memberMap[selectedMemberId];
    const today = new Date().toISOString().split("T")[0];

    // Cegah check-in ganda saat masih ada sesi aktif hari ini
    const sudahAktif = attendance.find(
      (a) =>
        a.id_member === selectedMemberId &&
        a.tgl_absensi === today &&
        a.status === "Aktif",
    );
    if (sudahAktif) {
      setModalError(
        `${namaMember} masih punya sesi aktif hari ini. Lakukan check-out dulu.`,
      );
      return;
    }

    const jam = jamSekarang();
    const newRecord = {
      id_absensi: `ATT-${Date.now()}`,
      id_member: selectedMemberId,
      tgl_absensi: today,
      jam_masuk: jam,
      jam_keluar: "-",
      status: "Aktif",
    };

    try {
      setSubmitting(true);
      setModalError(null);
      const res = await api.post("/absensi", newRecord, {
        headers: { Prefer: "return=representation" },
      });
      const inserted = res.data[0] || newRecord;
      setAttendance((prev) => [inserted, ...prev]);
      setScannedMember({ memberId: selectedMemberId, memberName: namaMember });
      setShowCheckInModal(false);
      setSelectedMemberId("");
    } catch (err) {
      console.error("Gagal check-in:", err);
      setModalError(
        err.response?.data?.message ||
          "Gagal menyimpan absensi. Periksa koneksi atau hak akses (GRANT/RLS).",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── UPDATE: Check-out (isi jam keluar + status Selesai) ──────
  const handleCheckout = async (record) => {
    const jam = jamSekarang();
    try {
      const res = await api.patch(
        "/absensi",
        { jam_keluar: jam, status: "Selesai" },
        {
          params: { id_absensi: `eq.${record.id_absensi}` },
          headers: { Prefer: "return=representation" },
        },
      );
      const updated = res.data[0] || {
        ...record,
        jam_keluar: jam,
        status: "Selesai",
      };
      setAttendance((prev) =>
        prev.map((a) => (a.id_absensi === record.id_absensi ? updated : a)),
      );
    } catch (err) {
      console.error("Gagal check-out:", err);
      setFetchError(
        err.response?.data?.message ||
          "Gagal melakukan check-out. Periksa koneksi atau hak akses.",
      );
    }
  };

  // ── DELETE: Hapus record absensi ─────────────────────────────
  const handleDelete = async (record) => {
    const namaMember = memberMap[record.id_member] || record.id_member;
    const ok = window.confirm(
      `Hapus catatan absensi ${namaMember} (${record.tgl_absensi})? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!ok) return;
    try {
      await api.delete("/absensi", {
        params: { id_absensi: `eq.${record.id_absensi}` },
      });
      setAttendance((prev) =>
        prev.filter((a) => a.id_absensi !== record.id_absensi),
      );
    } catch (err) {
      console.error("Gagal menghapus absensi:", err);
      setFetchError(
        err.response?.data?.message ||
          "Gagal menghapus catatan absensi. Periksa koneksi atau hak akses.",
      );
    }
  };

  const openCheckInModal = () => {
    setSelectedMemberId("");
    setModalError(null);
    setShowCheckInModal(true);
  };

  const handleShowQR = (member) => {
    setSelectedMember(member);
    setShowQRModal(true);
  };

  const filtered = attendance.filter((a) => {
    const namaMember = memberMap[a.id_member] || "";
    const q = search.toLowerCase();
    const matchSearch =
      namaMember.toLowerCase().includes(q) ||
      (a.id_member || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
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

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const activeCount = attendance.filter((a) => a.status === "Aktif").length;
  const completedCount = attendance.filter(
    (a) => a.status === "Selesai",
  ).length;

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader
            size={40}
            className="text-[#8E1616] animate-spin mx-auto mb-4"
          />
          <p className="text-gray-500">Memuat data absensi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      {/* ── Page Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">Absensi</h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Kelola data kehadiran anggota Zeus Gym
          </p>
        </div>
        <Button type="primary" icon={Scan} onClick={openCheckInModal}>
          Catat Absensi
        </Button>
      </div>

      {/* Alert error fetch / simpan */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">
              Terjadi Kesalahan
            </p>
            <p className="text-xs text-red-600 mt-0.5">{fetchError}</p>
          </div>
          <button
            onClick={() => setFetchError(null)}
            className="text-xs text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Scanned Member Notification */}
      {scannedMember && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-semibold text-[#1D1616]">
                Terpindai: {scannedMember.memberName}
              </p>
              <p className="text-xs text-[#9e7a6e]">
                ID Anggota: {scannedMember.memberId}
              </p>
            </div>
            <button
              onClick={() => setScannedMember(null)}
              className="ml-auto text-xs text-[#9e7a6e] hover:text-[#1D1616]"
            >
              Bersihkan
            </button>
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Sedang Aktif"
          value={activeCount}
          change="+5.3%"
          trend="up"
          sub="member berolahraga"
        />
        <StatCard
          icon={CheckCircle}
          label="Check-in Hari Ini"
          value={completedCount + activeCount}
          change="+12.5%"
          trend="up"
          sub="total hadir"
        />
        <StatCard
          icon={CheckCircle}
          label="Selesai"
          value={completedCount}
          change="+8.2%"
          trend="up"
          sub="telah checkout"
        />
        <StatCard
          icon={Clock}
          label="Tingkat Kehadiran"
          value={`${attendance.length > 0 ? Math.round(((completedCount + activeCount) / attendance.length) * 100) : 0}%`}
          change="+3.1%"
          trend="up"
          sub="dari total member"
        />
      </div>

      {/* Attendance Table */}
      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1616]">Absensi Hari Ini</p>
              <p className="text-xs text-[#9e7a6e]">{filtered.length} dari {attendance.length} catatan</p>
            </div>
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari absensi..."
              className="w-52"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">Filter:</span>
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
            </select>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold hover:bg-red-100 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table
            headers={[
              "ID Anggota",
              "Nama Anggota",
              "Check In",
              "Check Out",
              "Status",
              "Aksi",
            ]}
          >
            {currentItems.length > 0
              ? currentItems.map((record) => {
                  const statusStyle =
                    statusConfig[record.status] || statusConfig.Absen;
                  const statusType =
                    record.status === "Aktif"
                      ? "success"
                      : record.status === "Selesai"
                        ? "info"
                        : "danger";
                  const namaMember =
                    memberMap[record.id_member] || "Member tidak ditemukan";
                  return (
                    <tr
                      key={record.id_absensi}
                      className="hover:bg-[#faf6f4] transition-colors group"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-gray-500 font-semibold">
                        {record.id_member}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={namaMember} size="sm" />
                          <span className="font-semibold text-[#1D1616] text-sm">
                            {namaMember}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        {record.jam_masuk && record.jam_masuk !== "-" ? (
                          <Badge type="success">
                            <Clock size={10} className="mr-1" />
                            {record.jam_masuk}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        {record.jam_keluar && record.jam_keluar !== "-" ? (
                          <Badge type="info">
                            <CheckCircle size={10} className="mr-1" />
                            {record.jam_keluar}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge type={statusType} dot>
                          {statusStyle.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {record.status === "Aktif" && (
                            <button
                              onClick={() => handleCheckout(record)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-semibold"
                              title="Check-out sekarang"
                            >
                              <LogOut size={13} /> Check-out
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleShowQR({
                                id: record.id_member,
                                name: namaMember,
                              })
                            }
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8E1616]/20 transition-colors"
                            title="Tampilkan QR Code"
                          >
                            <QrCode size={14} className="text-[#8E1616]" />
                          </button>
                          <button
                            onClick={() => handleDelete(record)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-100 transition-colors"
                            title="Hapus catatan"
                          >
                            <Trash2 size={14} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </Table>
          {currentItems.length === 0 && (
            <EmptyState
              icon="🔍"
              title="Tidak ada data absensi ditemukan"
              message="Coba dengan kata kunci lain atau refresh halaman"
            />
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-[#9e7a6e]">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filtered.length)} of {filtered.length} results
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
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
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
                    return <span key={pageNumber} className="text-xs text-gray-400">...</span>;
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
      </div>

      {/* ── Modal Catat Absensi (pilih member dari dropdown) ── */}
      <Modal
        open={showCheckInModal}
        onClose={() => !submitting && setShowCheckInModal(false)}
        title="Catat Absensi"
        subtitle="Pilih anggota untuk check-in hari ini"
        footer={
          <div className="flex gap-3">
            <Button
              type="secondary"
              fullWidth
              disabled={submitting}
              onClick={() => setShowCheckInModal(false)}
            >
              Batal
            </Button>
            <Button
              type="primary"
              fullWidth
              disabled={submitting}
              onClick={handleCheckIn}
            >
              {submitting ? "Menyimpan..." : "Check-in"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {modalError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">
              {modalError}
            </div>
          )}
          <SelectField
            label="Pilih Anggota"
            name="id_member"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            options={[
              { value: "", label: "-- Pilih anggota --" },
              ...Object.entries(memberMap)
                .sort((a, b) => a[1].localeCompare(b[1]))
                .map(([id, nama]) => ({
                  value: id,
                  label: `${nama} (${id})`,
                })),
            ]}
          />
          {selectedMemberId && (
            <div className="flex items-center gap-2.5 bg-[#f8f3ee] rounded-xl p-3">
              <Avatar name={memberMap[selectedMemberId]} size="sm" />
              <div>
                <p className="text-sm font-semibold text-[#1D1616]">
                  {memberMap[selectedMemberId]}
                </p>
                <p className="text-xs text-[#9e7a6e]">{selectedMemberId}</p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        member={selectedMember}
      />
    </div>
  );
};

export default Attendance;
