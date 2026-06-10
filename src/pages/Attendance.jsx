import { useState, useEffect } from "react";
import QRCodeModal from "../components/QRCodeModal";
import {
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  Scan,
  Loader,
} from "lucide-react";

// ── Components ────────────────────────────────────────────────
import SearchBar from "../components/SearchBar";
import Badge from "../components/Badge";
import Table from "../components/Table";
import Avatar from "../components/Avatar";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";

// Import data dari file JSON
import attendanceData from "../data/attendanceData.js";

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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [scanning, setScanning] = useState(false);
  const [scannedMember, setScannedMember] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load data dari JSON saat komponen mount
  useEffect(() => {
    // Ambil data dari file attendanceData.js
    const data = Array.isArray(attendanceData)
      ? attendanceData
      : attendanceData.attendance || attendanceData.data || [];
    setAttendance(data);
    setLoading(false);
  }, []);

  const handleScanQR = () => {
    setScanning(true);
    setTimeout(() => {
      // Simulasi scan QR - ambil data dari member pertama yang aktif
      const today = new Date().toISOString().split("T")[0];
      const existingMember = attendance.find(
        (a) => a.memberId === "ZEUS-001" && a.date === today,
      );

      const fakeScan = { memberId: "ZEUS-001", memberName: "Alex Johnson" };
      setScannedMember(fakeScan);
      setScanning(false);

      const existing = attendance.find(
        (a) =>
          a.memberId === fakeScan.memberId &&
          a.date === new Date().toISOString().split("T")[0],
      );

      if (existing && existing.status === "Aktif") {
        const updated = attendance.map((a) =>
          a.id === existing.id
            ? {
                ...a,
                checkOut: new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                status: "Selesai",
              }
            : a,
        );
        setAttendance(updated);
        alert(`Check-out berhasil untuk ${fakeScan.memberName}`);
      } else if (!existing || existing.status === "Selesai") {
        const newAttendance = {
          id: `ATT-${String(attendance.length + 1).padStart(3, "0")}`,
          memberId: fakeScan.memberId,
          memberName: fakeScan.memberName,
          checkIn: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          checkOut: "-",
          status: "Aktif",
          date: new Date().toISOString().split("T")[0],
        };
        setAttendance([newAttendance, ...attendance]);
        alert(`Check-in berhasil untuk ${fakeScan.memberName}`);
      }
    }, 1500);
  };

  const handleShowQR = (member) => {
    setSelectedMember(member);
    setShowQRModal(true);
  };

  const filtered = attendance.filter((a) => {
    const matchSearch = a.memberName?.toLowerCase().includes(search.toLowerCase()) ||
      a.memberId?.toLowerCase().includes(search.toLowerCase());
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
        <button
          onClick={handleScanQR}
          disabled={scanning}
          className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 bg-[#8C1007] hover:bg-[#a01a0a] text-white shadow-md shadow-[#8C1007]/30 px-4 py-2.5 text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Scan size={15} />
          {scanning ? "Memindai..." : "Pindai QR Code"}
        </button>
      </div>

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
              ? currentItems.map((record, idx) => {
                  const StatusIcon = statusConfig[record.status]?.icon || Clock;
                  const statusStyle =
                    statusConfig[record.status] || statusConfig.Absen;
                  const statusType =
                    record.status === "Aktif"
                      ? "success"
                      : record.status === "Selesai"
                        ? "info"
                        : "danger";
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-[#faf6f4] transition-colors group"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-gray-500 font-semibold">
                        {record.memberId}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={record.memberName || "?"} size="sm" />
                          <span className="font-semibold text-[#1D1616] text-sm">
                            {record.memberName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        {record.checkIn !== "-" ? (
                          <Badge type="success">
                            <Clock size={10} className="mr-1" />
                            {record.checkIn}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        {record.checkOut !== "-" ? (
                          <Badge type="info">
                            <CheckCircle size={10} className="mr-1" />
                            {record.checkOut}
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
                        <button
                          onClick={() =>
                            handleShowQR({
                              id: record.memberId,
                              name: record.memberName,
                            })
                          }
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8E1616]/20 transition-colors"
                          title="Tampilkan QR Code"
                        >
                          <QrCode size={14} className="text-[#8E1616]" />
                        </button>
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

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        member={selectedMember}
      />
    </div>
  );
};

export default Attendance;
