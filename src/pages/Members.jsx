import { useState } from "react";
import PageHeader from "../components/PageHeader";
import QRCodeModal from "../components/QRCodeModal";
import {
  Plus,
  X,
  Search,
  QrCode,
  Bell,
  Mail,
  Filter,
  UserCheck,
  Calendar,
  Phone,
  Mail as MailIcon,
  Clock,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  AlertCircle,
} from "lucide-react";

const initialMembers = [
  {
    id: "ZEUS-001",
    name: "Alex Johnson",
    email: "alex@email.com",
    phone: "081234567890",
    package: "yearly",
    packageLabel: "1 Tahun",
    status: "Aktif",
    joinDate: "2024-01-15",
    expiryDate: "2025-01-15",
    price: 1200000,
  },
  {
    id: "ZEUS-002",
    name: "Sarah Williams",
    email: "sarah@email.com",
    phone: "081234567891",
    package: "monthly",
    packageLabel: "1 Bulan",
    status: "Aktif",
    joinDate: "2024-02-20",
    expiryDate: "2025-02-20",
    price: 350000,
  },
  {
    id: "ZEUS-003",
    name: "Mike Chen",
    email: "mike@email.com",
    phone: "081234567892",
    package: "quarterly",
    packageLabel: "3 Bulan",
    status: "Aktif",
    joinDate: "2024-03-10",
    expiryDate: "2024-06-10",
    price: 850000,
  },
  {
    id: "ZEUS-004",
    name: "Jessica Lee",
    email: "jessica@email.com",
    phone: "081234567893",
    package: "daily",
    packageLabel: "Harian",
    status: "Aktif",
    joinDate: "2024-12-04",
    expiryDate: "2024-12-05",
    price: 50000,
  },
  {
    id: "ZEUS-005",
    name: "David Kim",
    email: "david@email.com",
    phone: "081234567894",
    package: "monthly",
    packageLabel: "1 Bulan",
    status: "Tidak Aktif",
    joinDate: "2024-05-12",
    expiryDate: "2024-06-12",
    price: 350000,
  },
];

const packageConfig = {
  daily: {
    className: "bg-blue-100 text-blue-700 border border-blue-200",
    icon: Clock,
    label: "Harian",
    duration: 1,
    durationUnit: "hari",
    price: 50000,
  },
  monthly: {
    className: "bg-purple-100 text-purple-700 border border-purple-200",
    icon: CalendarDays,
    label: "1 Bulan",
    duration: 30,
    durationUnit: "hari",
    price: 350000,
  },
  quarterly: {
    className: "bg-orange-100 text-orange-700 border border-orange-200",
    icon: CalendarRange,
    label: "3 Bulan",
    duration: 90,
    durationUnit: "hari",
    price: 850000,
  },
  yearly: {
    className: "bg-green-100 text-green-700 border border-green-200",
    icon: CalendarClock,
    label: "1 Tahun",
    duration: 365,
    durationUnit: "hari",
    price: 1200000,
  },
};

const statusConfig = {
  Aktif: { className: "bg-green-100 text-green-700 border border-green-200" },
  "Akan Kadaluarsa": {
    className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  },
  "Tidak Aktif": { className: "bg-red-100 text-red-700 border border-red-200" },
};

const packageOptions = [
  {
    value: "daily",
    label: "Harian",
    price: 50000,
    duration: "1 hari",
    durationDays: 1,
  },
  {
    value: "monthly",
    label: "1 Bulan",
    price: 350000,
    duration: "30 hari",
    durationDays: 30,
  },
  {
    value: "quarterly",
    label: "3 Bulan",
    price: 850000,
    duration: "90 hari",
    durationDays: 90,
  },
  {
    value: "yearly",
    label: "1 Tahun",
    price: 1200000,
    duration: "365 hari",
    durationDays: 365,
  },
];

// Fungsi untuk memformat tanggal ke format Indonesia
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Fungsi untuk menghitung sisa hari
const getDaysRemaining = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Fungsi untuk mendapatkan warna berdasarkan sisa hari
const getDaysRemainingColor = (days) => {
  if (days < 0) return "text-red-600";
  if (days <= 3) return "text-orange-600";
  if (days <= 7) return "text-yellow-600";
  return "text-green-600";
};

const Members = () => {
  const [members, setMembers] = useState(initialMembers);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    package: "monthly",
  });

  // Hitung tanggal kadaluarsa berdasarkan paket dari tanggal join
  const calculateExpiryDate = (packageType, startDate = null) => {
    const start = startDate ? new Date(startDate) : new Date();
    let expiryDate = new Date(start);

    switch (packageType) {
      case "daily":
        expiryDate.setDate(start.getDate() + 1);
        break;
      case "monthly":
        expiryDate.setMonth(start.getMonth() + 1);
        break;
      case "quarterly":
        expiryDate.setMonth(start.getMonth() + 3);
        break;
      case "yearly":
        expiryDate.setFullYear(start.getFullYear() + 1);
        break;
      default:
        expiryDate.setMonth(start.getMonth() + 1);
    }

    return expiryDate.toISOString().split("T")[0];
  };

  // Update status berdasarkan tanggal
  const updateMemberStatus = (member) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(member.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      return "Tidak Aktif";
    } else if (
      expiryDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    ) {
      return "Akan Kadaluarsa";
    } else {
      return "Aktif";
    }
  };

  const getPackagePrice = (packageType) => {
    const pkg = packageOptions.find((p) => p.value === packageType);
    return pkg ? pkg.price : 350000;
  };

  const getPackageLabel = (packageType) => {
    const pkg = packageOptions.find((p) => p.value === packageType);
    return pkg ? pkg.label : "1 Bulan";
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return;

    const joinDate = new Date().toISOString().split("T")[0];
    const expiryDate = calculateExpiryDate(form.package);
    const price = getPackagePrice(form.package);
    const packageLabel = getPackageLabel(form.package);

    const newMember = {
      id: `ZEUS-${String(members.length + 1).padStart(3, "0")}`,
      ...form,
      packageLabel: packageLabel,
      status: "Aktif",
      joinDate: joinDate,
      expiryDate: expiryDate,
      price: price,
    };
    setMembers([newMember, ...members]);
    setForm({ name: "", email: "", phone: "", package: "monthly" });
    setShowModal(false);
  };

  const handleExtendMembership = (member) => {
    const newExpiryDate = calculateExpiryDate(
      member.package,
      member.expiryDate,
    );
    const updatedMembers = members.map((m) =>
      m.id === member.id
        ? { ...m, expiryDate: newExpiryDate, status: "Aktif" }
        : m,
    );
    setMembers(updatedMembers);
    alert(
      `Keanggotaan ${member.name} telah diperpanjang hingga ${formatDate(newExpiryDate)}`,
    );
  };

  const handleSendReminder = (member) => {
    const daysLeft = getDaysRemaining(member.expiryDate);
    alert(
      `Pengingat dikirim ke ${member.name}!\n\n` +
        `Keanggotaan akan berakhir pada: ${formatDate(member.expiryDate)}\n` +
        `Sisa waktu: ${daysLeft} hari lagi.\n\n` +
        `Segera perpanjang keanggotaan untuk terus menikmati fasilitas Zeus Gym!`,
    );
  };

  const handleSendEmail = (member) =>
    alert(`Email dikirim ke ${member.email} untuk member ${member.name}.`);

  const handleShowQR = (member) => {
    setSelectedMember(member);
    setShowQRModal(true);
  };

  // Update status semua member secara berkala
  const getUpdatedMembers = () => {
    return members.map((member) => ({
      ...member,
      status: updateMemberStatus(member),
    }));
  };

  // Fungsi pencarian yang ditingkatkan
  const filtered = getUpdatedMembers().filter((member) => {
    if (statusFilter !== "all" && member.status !== statusFilter) return false;
    if (packageFilter !== "all" && member.package !== packageFilter)
      return false;
    if (search === "") return true;

    const searchLower = search.toLowerCase();
    switch (searchType) {
      case "name":
        return member.name.toLowerCase().includes(searchLower);
      case "email":
        return member.email.toLowerCase().includes(searchLower);
      case "id":
        return member.id.toLowerCase().includes(searchLower);
      case "phone":
        return member.phone.includes(search);
      default:
        return (
          member.name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower) ||
          member.id.toLowerCase().includes(searchLower) ||
          member.phone.includes(search)
        );
    }
  });

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "name":
        return "Nama";
      case "email":
        return "Email";
      case "id":
        return "ID";
      case "phone":
        return "Telepon";
      default:
        return "Semua";
    }
  };

  // Statistik berdasarkan paket
  const currentMembers = getUpdatedMembers();
  const statsByPackage = {
    daily: currentMembers.filter((m) => m.package === "daily").length,
    monthly: currentMembers.filter((m) => m.package === "monthly").length,
    quarterly: currentMembers.filter((m) => m.package === "quarterly").length,
    yearly: currentMembers.filter((m) => m.package === "yearly").length,
  };

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

      {/* Summary Cards - Total & Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Total Anggota</p>
          <p className="text-2xl font-bold text-[#1D1616]">
            {currentMembers.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Anggota Aktif</p>
          <p className="text-2xl font-bold text-green-600">
            {currentMembers.filter((m) => m.status === "Aktif").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Akan Kadaluarsa</p>
          <p className="text-2xl font-bold text-yellow-600">
            {
              currentMembers.filter((m) => m.status === "Akan Kadaluarsa")
                .length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Tidak Aktif</p>
          <p className="text-2xl font-bold text-red-600">
            {currentMembers.filter((m) => m.status === "Tidak Aktif").length}
          </p>
        </div>
      </div>

      {/* Package Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Harian</span>
          </div>
          <p className="text-xl font-bold text-blue-800 mt-1">
            {statsByPackage.daily}
          </p>
          <p className="text-[10px] text-blue-600">anggota</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">
              1 Bulan
            </span>
          </div>
          <p className="text-xl font-bold text-purple-800 mt-1">
            {statsByPackage.monthly}
          </p>
          <p className="text-[10px] text-purple-600">anggota</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center gap-2">
            <CalendarRange size={16} className="text-orange-600" />
            <span className="text-xs font-semibold text-orange-700">
              3 Bulan
            </span>
          </div>
          <p className="text-xl font-bold text-orange-800 mt-1">
            {statsByPackage.quarterly}
          </p>
          <p className="text-[10px] text-orange-600">anggota</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-200">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700">
              1 Tahun
            </span>
          </div>
          <p className="text-xl font-bold text-green-800 mt-1">
            {statsByPackage.yearly}
          </p>
          <p className="text-[10px] text-green-600">anggota</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Cari anggota berdasarkan ${getSearchTypeLabel().toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
              >
                <option value="all">Semua Field</option>
                <option value="name">Nama</option>
                <option value="email">Email</option>
                <option value="id">ID Anggota</option>
                <option value="phone">Telepon</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                  showFilters ||
                  statusFilter !== "all" ||
                  packageFilter !== "all"
                    ? "bg-[#8E1616] text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Filter size={16} />
                <span className="text-sm hidden sm:inline">Filter</span>
                {(statusFilter !== "all" || packageFilter !== "all") && (
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 font-medium">
                    Status:
                  </span>
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === "all" ? "bg-[#8E1616] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setStatusFilter("Aktif")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === "Aktif" ? "bg-green-600 text-white" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                  >
                    Aktif
                  </button>
                  <button
                    onClick={() => setStatusFilter("Akan Kadaluarsa")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === "Akan Kadaluarsa" ? "bg-yellow-600 text-white" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"}`}
                  >
                    Akan Kadaluarsa
                  </button>
                  <button
                    onClick={() => setStatusFilter("Tidak Aktif")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === "Tidak Aktif" ? "bg-red-600 text-white" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                  >
                    Tidak Aktif
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 font-medium">
                    Paket:
                  </span>
                  <button
                    onClick={() => setPackageFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${packageFilter === "all" ? "bg-[#8E1616] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setPackageFilter("daily")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${packageFilter === "daily" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                  >
                    Harian
                  </button>
                  <button
                    onClick={() => setPackageFilter("monthly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${packageFilter === "monthly" ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-600 hover:bg-purple-100"}`}
                  >
                    1 Bulan
                  </button>
                  <button
                    onClick={() => setPackageFilter("quarterly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${packageFilter === "quarterly" ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}
                  >
                    3 Bulan
                  </button>
                  <button
                    onClick={() => setPackageFilter("yearly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${packageFilter === "yearly" ? "bg-green-600 text-white" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                  >
                    1 Tahun
                  </button>
                </div>

                {(statusFilter !== "all" || packageFilter !== "all") && (
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setPackageFilter("all");
                    }}
                    className="px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕ Hapus Semua Filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search Result Info */}
        <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserCheck size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">
              Menampilkan{" "}
              <strong className="text-[#1D1616]">{filtered.length}</strong> dari{" "}
              <strong>{currentMembers.length}</strong> anggota
            </span>
          </div>
          {(search || statusFilter !== "all" || packageFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSearchType("all");
                setStatusFilter("all");
                setPackageFilter("all");
              }}
              className="text-xs text-[#8E1616] hover:text-[#D84040] transition-colors"
            >
              Hapus Pencarian & Filter
            </button>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
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
                  Telepon
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Paket
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Tanggal Bergabung
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Berakhir
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Sisa Hari
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((member) => {
                  const s = statusConfig[member.status] || statusConfig.Aktif;
                  const pkg =
                    packageConfig[member.package] || packageConfig.monthly;
                  const PackageIcon = pkg.icon;
                  const daysRemaining = getDaysRemaining(member.expiryDate);
                  const daysColor = getDaysRemainingColor(daysRemaining);

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
                      <td className="px-6 py-3.5 text-xs text-gray-500">
                        {member.phone}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${pkg.className}`}
                        >
                          <PackageIcon size={10} />
                          {member.packageLabel}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${s.className}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-500">
                        {formatDate(member.joinDate)}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-500">
                        {formatDate(member.expiryDate)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-xs font-semibold ${daysColor}`}>
                          {daysRemaining < 0
                            ? "Kadaluarsa"
                            : `${daysRemaining} hari`}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShowQR(member)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8E1616]/20 transition-colors"
                            title="Tampilkan QR Code"
                          >
                            <QrCode size={14} className="text-[#8E1616]" />
                          </button>
                          <button
                            onClick={() => handleSendReminder(member)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8E1616]/20 transition-colors"
                            title="Kirim Pengingat"
                          >
                            <Bell size={14} className="text-[#8E1616]" />
                          </button>
                          <button
                            onClick={() => handleSendEmail(member)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8E1616]/20 transition-colors"
                            title="Kirim Email"
                          >
                            <Mail size={14} className="text-[#8E1616]" />
                          </button>
                          {member.status !== "Tidak Aktif" && (
                            <button
                              onClick={() => handleExtendMembership(member)}
                              className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                              title="Perpanjang Keanggotaan"
                            >
                              <CalendarClock
                                size={14}
                                className="text-green-600"
                              />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={40} className="text-gray-300" />
                      <p className="text-gray-500 font-medium">
                        Tidak ada anggota ditemukan
                      </p>
                      <p className="text-xs text-gray-400">
                        Coba dengan kata kunci lain atau hapus filter
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pendaftaran Digital */}
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
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Nama Lengkap
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Alamat Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Nomor Telepon
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="081234567890"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Pilih Paket Keanggotaan
                </label>
                <select
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                >
                  {packageOptions.map((pkg) => (
                    <option key={pkg.value} value={pkg.value}>
                      {pkg.label} - Rp {pkg.price.toLocaleString("id-ID")}{" "}
                      (Berlaku {pkg.duration})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  * Masa berlaku akan dihitung otomatis dari hari ini sesuai
                  paket yang dipilih
                </p>
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
