import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import QRCodeModal from "../components/QRCodeModal";
import {
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  Scan,
  Loader,
} from "lucide-react";

// ── Components Pertemuan 10 ───────────────────────────────────
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
  const [scanning, setScanning] = useState(false);
  const [scannedMember, setScannedMember] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

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

  const filtered = attendance.filter(
    (a) =>
      a.memberName?.toLowerCase().includes(search.toLowerCase()) ||
      a.memberId?.toLowerCase().includes(search.toLowerCase()),
  );

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
    <div>
      <PageHeader title="Absensi" breadcrumb={["Manajemen", "Absensi"]}>
        <button
          onClick={handleScanQR}
          disabled={scanning}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <Scan size={14} />
          {scanning ? "Memindai..." : "Pindai QR Code"}
        </button>
      </PageHeader>

      {/* Scanned Member Notification */}
      {scannedMember && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-semibold text-[#1D1616]">
                Terpindai: {scannedMember.memberName}
              </p>
              <p className="text-xs text-gray-500">
                ID Anggota: {scannedMember.memberId}
              </p>
            </div>
            <button
              onClick={() => setScannedMember(null)}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600"
            >
              Bersihkan
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Sedang Aktif</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {activeCount}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Member sedang berolahraga
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Check-in Hari Ini
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {completedCount + activeCount}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Total member hadir
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Selesai</p>
              <p className="text-2xl font-bold text-[#1D1616] mt-1">
                {completedCount}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">Telah checkout</p>
            </div>
            <div className="w-10 h-10 bg-[#8E1616]/10 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-[#8E1616]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Tingkat Kehadiran
              </p>
              <p className="text-2xl font-bold text-[#D84040] mt-1">
                {attendance.length > 0
                  ? Math.round(
                      ((completedCount + activeCount) / attendance.length) *
                        100,
                    )
                  : 0}
                %
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Dari total member
              </p>
            </div>
            <div className="w-10 h-10 bg-[#D84040]/10 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-[#D84040]" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-bold text-[#1D1616]">Absensi Hari Ini</p>
            <p className="text-xs text-gray-400">{filtered.length} catatan</p>
          </div>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari absensi..."
            className="w-44"
          />
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
            {filtered.length > 0
              ? filtered.map((record) => {
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
                      className="hover:bg-gray-50 transition-colors group"
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
          {filtered.length === 0 && (
            <EmptyState
              icon="🔍"
              title="Tidak ada data absensi ditemukan"
              message="Coba dengan kata kunci lain atau refresh halaman"
            />
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
