import { useState } from "react";
import PageHeader from "../components/PageHeader";
import QRCodeModal from "../components/QRCodeModal";
import { Plus, X, Search, QrCode, Bell, Mail } from "lucide-react";

const initialMembers = [
  {
    id: "ZEUS-001",
    name: "Alex Johnson",
    email: "alex@email.com",
    phone: "081234567890",
    membership: "Gold",
    status: "Aktif",
    joinDate: "2024-01-15",
    expiryDate: "2025-01-15",
  },
  {
    id: "ZEUS-002",
    name: "Sarah Williams",
    email: "sarah@email.com",
    phone: "081234567891",
    membership: "Platinum",
    status: "Aktif",
    joinDate: "2024-02-20",
    expiryDate: "2025-02-20",
  },
  {
    id: "ZEUS-003",
    name: "Mike Chen",
    email: "mike@email.com",
    phone: "081234567892",
    membership: "Silver",
    status: "Aktif",
    joinDate: "2024-03-10",
    expiryDate: "2025-03-10",
  },
  {
    id: "ZEUS-004",
    name: "Jessica Lee",
    email: "jessica@email.com",
    phone: "081234567893",
    membership: "Gold",
    status: "Akan Kadaluarsa",
    joinDate: "2024-04-05",
    expiryDate: "2024-12-05",
  },
  {
    id: "ZEUS-005",
    name: "David Kim",
    email: "david@email.com",
    phone: "081234567894",
    membership: "Basic",
    status: "Tidak Aktif",
    joinDate: "2024-05-12",
    expiryDate: "2024-11-12",
  },
];

const membershipConfig = {
  Platinum: {
    className: "bg-purple-100 text-purple-700 border border-purple-200",
    dot: "bg-purple-500",
  },
  Gold: {
    className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-500",
  },
  Silver: {
    className: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
  },
  Basic: {
    className: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
};

const statusConfig = {
  Aktif: { className: "bg-green-100 text-green-700 border border-green-200" },
  "Akan Kadaluarsa": {
    className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  },
  "Tidak Aktif": { className: "bg-red-100 text-red-700 border border-red-200" },
};

const Members = () => {
  const [members, setMembers] = useState(initialMembers);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    membership: "Basic",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return;
    const newMember = {
      id: `ZEUS-${String(members.length + 1).padStart(3, "0")}`,
      ...form,
      status: "Aktif",
      joinDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
    };
    setMembers([newMember, ...members]);
    setForm({ name: "", email: "", phone: "", membership: "Basic" });
    setShowModal(false);
  };

  const handleSendReminder = (member) =>
    alert(
      `Pengingat dikirim ke ${member.name} tentang perpanjangan keanggotaan.`,
    );
  const handleShowQR = (member) => {
    setSelectedMember(member);
    setShowQRModal(true);
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Anggota" breadcrumb={["Manajemen", "Anggota"]}>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <Plus size={14} /> Pendaftaran Digital
        </button>
      </PageHeader>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Total Anggota</p>
          <p className="text-2xl font-bold text-[#1D1616]">{members.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Anggota Aktif</p>
          <p className="text-2xl font-bold text-green-600">
            {members.filter((m) => m.status === "Aktif").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Akan Kadaluarsa</p>
          <p className="text-2xl font-bold text-yellow-600">
            {members.filter((m) => m.status === "Akan Kadaluarsa").length}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#1D1616]">Database Anggota</p>
            <p className="text-xs text-gray-400">
              {filtered.length} total anggota
            </p>
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari anggota..."
              className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] w-44"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  ID
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Anggota
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Email
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Keanggotaan
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Tgl Kadaluarsa
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((member) => {
                const m =
                  membershipConfig[member.membership] || membershipConfig.Basic;
                const s = statusConfig[member.status] || statusConfig.Aktif;
                return (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-500 font-semibold">
                      {member.id}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-[#8E1616]/20 flex items-center justify-center text-[#8E1616] text-xs font-bold shadow-sm">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-[#1D1616] text-sm">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      {member.email}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${m.className}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                        {member.membership}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${s.className}`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-400">
                      {member.expiryDate}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShowQR(member)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8E1616]/20 transition-colors"
                        >
                          <QrCode size={14} className="text-[#8E1616]" />
                        </button>
                        <button
                          onClick={() => handleSendReminder(member)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8E1616]/20 transition-colors"
                        >
                          <Bell size={14} className="text-[#8E1616]" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8E1616]/20 transition-colors">
                          <Mail size={14} className="text-[#8E1616]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#1D1616]">
                  Pendaftaran Digital
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Daftarkan anggota baru ke database
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Nama Lengkap",
                  name: "name",
                  type: "text",
                  placeholder: "John Doe",
                },
                {
                  label: "Alamat Email",
                  name: "email",
                  type: "email",
                  placeholder: "john@example.com",
                },
                {
                  label: "Nomor Telepon",
                  name: "phone",
                  type: "tel",
                  placeholder: "081234567890",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Tipe Keanggotaan
                </label>
                <select
                  name="membership"
                  value={form.membership}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                >
                  <option>Basic</option>
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-[#8E1616]/30"
              >
                Daftarkan Anggota
              </button>
            </div>
          </div>
        </div>
      )}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        member={selectedMember}
      />
    </div>
  );
};

export default Members;
