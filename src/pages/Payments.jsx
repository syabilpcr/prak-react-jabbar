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
} from "lucide-react";

// Import data dari file JSON
import paymentsData from "../data/paymentsData.js";

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

const methodConfig = {
  QRIS: {
    className: "bg-[#8E1616]/10 text-[#8E1616] border border-[#8E1616]/20",
    icon: QrCode,
    label: "QRIS",
  },
  "Transfer Bank": {
    className: "bg-[#D84040]/10 text-[#D84040] border border-[#D84040]/20",
    icon: CreditCard,
    label: "Transfer Bank",
  },
  "Dompet Digital": {
    className: "bg-purple-100 text-purple-700 border border-purple-200",
    icon: Wallet,
    label: "Dompet Digital",
  },
  "Kartu Kredit": {
    className: "bg-orange-100 text-orange-700 border border-orange-200",
    icon: Smartphone,
    label: "Kartu Kredit",
  },
};

const statusConfig = {
  Selesai: {
    className: "bg-green-100 text-green-700 border border-green-200",
    icon: CheckCircle,
    label: "Selesai",
  },
  Menunggu: {
    className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    icon: AlertCircle,
    label: "Menunggu",
  },
  Gagal: {
    className: "bg-red-100 text-red-700 border border-red-200",
    icon: XCircle,
    label: "Gagal",
  },
};

const subscriptionConfig = {
  Harian: {
    className: "bg-[#8E1616]/10 text-[#8E1616] border border-[#8E1616]/20",
    icon: Clock,
    label: "Harian",
    priceRange: "Rp 25.000 - 50.000",
  },
  Bulanan: {
    className: "bg-[#D84040]/10 text-[#D84040] border border-[#D84040]/20",
    icon: Calendar,
    label: "Bulanan",
    priceRange: "Rp 500.000 - 1.000.000",
  },
  Tahunan: {
    className: "bg-[#1D1616]/10 text-[#1D1616] border border-[#1D1616]/20",
    icon: CalendarDays,
    label: "Tahunan",
    priceRange: "Rp 1.200.000 - 2.500.000",
  },
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterSub, setFilterSub] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [form, setForm] = useState({
    memberName: "",
    amount: "",
    method: "QRIS",
    subscriptionType: "Bulanan",
  });

  useEffect(() => {
    const data = Array.isArray(paymentsData)
      ? paymentsData
      : paymentsData.payments || paymentsData.data || [];
    setPayments(data);
    setLoading(false);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubscriptionChange = (e) => {
    const subType = e.target.value;
    let suggestedAmount = "";
    switch (subType) {
      case "Harian":
        suggestedAmount = "25000";
        break;
      case "Bulanan":
        suggestedAmount = "850000";
        break;
      case "Tahunan":
        suggestedAmount = "1200000";
        break;
      default:
        suggestedAmount = "";
    }
    setForm({ ...form, subscriptionType: subType, amount: suggestedAmount });
  };

  const handleSubmit = () => {
    if (!form.memberName || !form.amount) return;
    const newPayment = {
      id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
      ...form,
      amount: Number(form.amount),
      status: "Menunggu",
      date: new Date().toISOString().split("T")[0],
    };
    setPayments([newPayment, ...payments]);
    setForm({
      memberName: "",
      amount: "",
      method: "QRIS",
      subscriptionType: "Bulanan",
    });
    setShowModal(false);
  };

  const filtered = payments.filter((p) => {
    const matchSearch = p.memberName?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchMethod = filterMethod === "all" || p.method === filterMethod;
    const matchSub = filterSub === "all" || p.subscriptionType === filterSub;
    return matchSearch && matchStatus && matchMethod && matchSub;
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

  const totalRevenue = payments
    .filter((p) => p.status === "Selesai")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = payments
    .filter((p) => p.status === "Menunggu")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const failedAmount = payments
    .filter((p) => p.status === "Gagal")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader size={40} className="text-[#8E1616] animate-spin mx-auto mb-4" />
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

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CreditCard}
          label="Total Pendapatan"
          value={`Rp ${(totalRevenue / 1000000).toFixed(1)} Jt`}
          change="+18.2%"
          trend="up"
          sub="transaksi selesai"
        />
        <StatCard
          icon={AlertCircle}
          label="Pembayaran Tertunda"
          value={`Rp ${(pendingAmount / 1000000).toFixed(1)} Jt`}
          change="+3.1%"
          trend="up"
          sub="menunggu konfirmasi"
        />
        <StatCard
          icon={XCircle}
          label="Pembayaran Gagal"
          value={`Rp ${(failedAmount / 1000000).toFixed(1)} Jt`}
          change="-2.5%"
          trend="down"
          sub="perlu tindak lanjut"
        />
        <StatCard
          icon={Wallet}
          label="Total Transaksi"
          value={payments.length}
          change="+12.5%"
          trend="up"
          sub="semua transaksi"
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
              <p className="text-sm font-bold text-[#1D1616]">Transaksi Pembayaran</p>
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
            <span className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">Filter:</span>
            <select
              value={filterStatus}
              onChange={handleFilterChange(setFilterStatus)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Gagal">Gagal</option>
            </select>
            <select
              value={filterMethod}
              onChange={handleFilterChange(setFilterMethod)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Metode</option>
              <option value="QRIS">QRIS</option>
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="Dompet Digital">Dompet Digital</option>
              <option value="Kartu Kredit">Kartu Kredit</option>
            </select>
            <select
              value={filterSub}
              onChange={handleFilterChange(setFilterSub)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Tipe</option>
              <option value="Harian">Harian</option>
              <option value="Bulanan">Bulanan</option>
              <option value="Tahunan">Tahunan</option>
            </select>
            {(filterStatus !== "all" || filterMethod !== "all" || filterSub !== "all") && (
              <button
                onClick={() => { 
                  setFilterStatus("all"); 
                  setFilterMethod("all"); 
                  setFilterSub("all"); 
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
            headers={["ID", "Anggota", "Tipe Langganan", "Jumlah", "Metode", "Status", "Tanggal"]}
          >
            {currentItems.length === 0
              ? null
              : currentItems.map((payment) => {
                  const MethodIcon = methodConfig[payment.method]?.icon || CreditCard;
                  const methodStyle = methodConfig[payment.method] || methodConfig.QRIS;
                  const SubIcon = subscriptionConfig[payment.subscriptionType]?.icon || Calendar;
                  const subStyle = subscriptionConfig[payment.subscriptionType] || subscriptionConfig.Bulanan;

                  return (
                    <tr key={payment.id} className="hover:bg-[#faf6f4] transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs text-[#9e7a6e] font-semibold">
                        {payment.id}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={payment.memberName || "?"} size="sm" />
                          <span className="font-semibold text-[#1D1616] text-sm">
                            {payment.memberName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge type={payment.subscriptionType === "Harian" ? "primary" : payment.subscriptionType === "Bulanan" ? "warning" : "secondary"} dot>
                          {subStyle.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-[#8C1007]">
                        Rp {(payment.amount || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge type="info" dot>
                          {methodStyle.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge
                          type={
                            payment.status === "Selesai"
                              ? "success"
                              : payment.status === "Menunggu"
                                ? "warning"
                                : "danger"
                          }
                          dot
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-[#9e7a6e]">
                        {payment.date}
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

      {/* ── Modal Tambah Pembayaran ── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Proses Pembayaran"
        subtitle="Pilih tipe langganan dan metode pembayaran"
        footer={
          <div className="flex gap-3">
            <Button type="secondary" fullWidth onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="primary" fullWidth onClick={handleSubmit}>
              Proses Pembayaran
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Input Component dari folder ui - komponen UI Shadcn */}
          <div>
            <label className="block text-xs font-bold text-[#9e7a6e] mb-1.5 uppercase tracking-wide">
              Nama Anggota <span className="text-[#8C1007] ml-1">*</span>
            </label>
            <Input
              name="memberName"
              value={form.memberName}
              onChange={handleChange}
              placeholder="Masukkan nama anggota"
              required
              className="bg-[#f8f3ee] border-[#e8dfd6]"
            />
          </div>
          <SelectField
            label="Tipe Langganan"
            name="subscriptionType"
            value={form.subscriptionType}
            onChange={handleSubscriptionChange}
            options={[
              { value: "Harian", label: "Harian (Rp 25.000 - 50.000)" },
              { value: "Bulanan", label: "Bulanan (Rp 500.000 - 1.000.000)" },
              { value: "Tahunan", label: "Tahunan (Rp 1.200.000 - 2.500.000)" },
            ]}
          />
          <div>
            <label className="block text-xs font-bold text-[#9e7a6e] mb-1.5 uppercase tracking-wide">
              Jumlah (Rp) <span className="text-[#8C1007] ml-1">*</span>
            </label>
            <Input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="0"
              required
              className="bg-[#f8f3ee] border-[#e8dfd6]"
            />
          </div>
          <SelectField
            label="Metode Pembayaran"
            name="method"
            value={form.method}
            onChange={handleChange}
            options={["QRIS", "Transfer Bank", "Dompet Digital", "Kartu Kredit"]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Payments;
