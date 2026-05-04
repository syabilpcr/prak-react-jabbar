import { useState } from "react";
import PageHeader from "../components/PageHeader";
import QRCodeModal from "../components/QRCodeModal";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  Scan,
} from "lucide-react";

const initialAttendance = [
  {
    id: "ATT-001",
    memberId: "ZEUS-001",
    memberName: "Alex Johnson",
    checkIn: "07:30",
    checkOut: "09:00",
    status: "Selesai",
    date: "2024-12-10",
  },
  {
    id: "ATT-002",
    memberId: "ZEUS-002",
    memberName: "Sarah Williams",
    checkIn: "08:15",
    checkOut: "-",
    status: "Aktif",
    date: "2024-12-10",
  },
  {
    id: "ATT-003",
    memberId: "ZEUS-003",
    memberName: "Mike Chen",
    checkIn: "06:45",
    checkOut: "08:30",
    status: "Selesai",
    date: "2024-12-10",
  },
  {
    id: "ATT-004",
    memberId: "ZEUS-004",
    memberName: "Jessica Lee",
    checkIn: "-",
    checkOut: "-",
    status: "Absen",
    date: "2024-12-10",
  },
  {
    id: "ATT-005",
    memberId: "ZEUS-005",
    memberName: "David Kim",
    checkIn: "09:00",
    checkOut: "-",
    status: "Aktif",
    date: "2024-12-10",
  },
];

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
  const [attendance, setAttendance] = useState(initialAttendance);
  const [search, setSearch] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedMember, setScannedMember] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleScanQR = () => {
    setScanning(true);
    setTimeout(() => {
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
      a.memberName.toLowerCase().includes(search.toLowerCase()) ||
      a.memberId.toLowerCase().includes(search.toLowerCase()),
  );
  const activeCount = attendance.filter((a) => a.status === "Aktif").length;
  const completedCount = attendance.filter(
    (a) => a.status === "Selesai",
  ).length;

  return (
    <div>
      <PageHeader title="Absensi" breadcrumb={["Manajemen", "Absensi"]}>
        <button
          onClick={handleScanQR}
          disabled={scanning}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <Scan size={14} />
          {scanning ? "Memindai..." : "Pindai QR Code"}
        </button>
      </PageHeader>
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
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Sedang Aktif</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Check-in Hari Ini</p>
          <p className="text-2xl font-bold text-blue-600">
            {completedCount + activeCount}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#1D1616]">Absensi Hari Ini</p>
            <p className="text-xs text-gray-400">{filtered.length} catatan</p>
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari absensi..."
              className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] w-44"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  ID Anggota
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Nama Anggota
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Check In
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Check Out
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((record) => {
                const StatusIcon = statusConfig[record.status]?.icon || Clock;
                const statusStyle =
                  statusConfig[record.status] || statusConfig.Absen;
                return (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-500 font-semibold">
                      {record.memberId}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-[#1D1616] text-sm">
                      {record.memberName}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      {record.checkIn}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      {record.checkOut}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusStyle.className}`}
                      >
                        <StatusIcon size={10} />
                        {statusStyle.label}
                      </span>
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
                      >
                        <QrCode size={14} className="text-[#8E1616]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
