import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import {
  Plus,
  X,
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
  Search, 
} from "lucide-react";

// Import data dari file JSON
import paymentsData from "../data/paymentsData.js";

// ── Components Pertemuan 10 ───────────────────────────────────
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import EmptyState from "../components/EmptyState";

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
    gradientFrom: "from-[#8E1616]/5",
    gradientTo: "to-[#8E1616]/10",
    textColor: "text-[#8E1616]",
  },
  Bulanan: {
    className: "bg-[#D84040]/10 text-[#D84040] border border-[#D84040]/20",
    icon: Calendar,
    label: "Bulanan",
    priceRange: "Rp 500.000 - 1.000.000",
    gradientFrom: "from-[#D84040]/5",
    gradientTo: "to-[#D84040]/10",
    textColor: "text-[#D84040]",
  },
  Tahunan: {
    className: "bg-[#1D1616]/10 text-[#1D1616] border border-[#1D1616]/20",
    icon: CalendarDays,
    label: "Tahunan",
    priceRange: "Rp 1.200.000 - 2.500.000",
    gradientFrom: "from-[#1D1616]/5",
    gradientTo: "to-[#1D1616]/10",
    textColor: "text-[#1D1616]",
  },
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    memberName: "",
    amount: "",
    method: "QRIS",
    subscriptionType: "Bulanan",
  });

  // Load data dari JSON saat komponen mount
  useEffect(() => {
    // Ambil data dari file paymentsData.js
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

    setForm({
      ...form,
      subscriptionType: subType,
      amount: suggestedAmount,
    });
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

  const filtered = payments.filter(
    (p) =>
      p.memberName?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = payments
    .filter((p) => p.status === "Selesai")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = payments
    .filter((p) => p.status === "Menunggu")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const failedAmount = payments
    .filter((p) => p.status === "Gagal")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Statistik berdasarkan tipe langganan
  const subscriptionStats = {
    Harian: payments.filter(
      (p) => p.subscriptionType === "Harian" && p.status === "Selesai",
    ).length,
    Bulanan: payments.filter(
      (p) => p.subscriptionType === "Bulanan" && p.status === "Selesai",
    ).length,
    Tahunan: payments.filter(
      (p) => p.subscriptionType === "Tahunan" && p.status === "Selesai",
    ).length,
  };

  // Statistik metode pembayaran
  const methodStats = {
    QRIS: payments.filter((p) => p.method === "QRIS" && p.status === "Selesai")
      .length,
    "Transfer Bank": payments.filter(
      (p) => p.method === "Transfer Bank" && p.status === "Selesai",
    ).length,
    "Dompet Digital": payments.filter(
      (p) => p.method === "Dompet Digital" && p.status === "Selesai",
    ).length,
    "Kartu Kredit": payments.filter(
      (p) => p.method === "Kartu Kredit" && p.status === "Selesai",
    ).length,
  };

  // Tampilkan loading state
  if (loading) {
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
    <div>
      <PageHeader title="Pembayaran" breadcrumb={["Manajemen", "Pembayaran"]}>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <Plus size={14} /> Pembayaran Baru
        </button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Total Pendapatan
              </p>
              <p className="text-2xl font-bold text-[#8E1616] mt-1">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </p>
              <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle size={10} /> Dari transaksi selesai
              </p>
            </div>
            <div className="w-10 h-10 bg-[#8E1616]/10 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-[#8E1616]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Pembayaran Tertunda
              </p>
              <p className="text-2xl font-bold text-[#D84040] mt-1">
                Rp {pendingAmount.toLocaleString("id-ID")}
              </p>
              <p className="text-[10px] text-yellow-600 mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> Menunggu konfirmasi
              </p>
            </div>
            <div className="w-10 h-10 bg-[#D84040]/10 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} className="text-[#D84040]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Pembayaran Gagal
              </p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                Rp {failedAmount.toLocaleString("id-ID")}
              </p>
              <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1">
                <XCircle size={10} /> Perlu ditindaklanjuti
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Total Transaksi
              </p>
              <p className="text-2xl font-bold text-[#1D1616] mt-1">
                {payments.length}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">Semua transaksi</p>
            </div>
            <div className="w-10 h-10 bg-[#1D1616]/10 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-[#1D1616]" />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Stats Cards - Updated with theme colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className={`bg-gradient-to-r ${subscriptionConfig.Harian.gradientFrom} ${subscriptionConfig.Harian.gradientTo} rounded-xl p-4 border border-[#8E1616]/20 shadow-sm hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#8E1616] font-semibold">
                Langganan Harian
              </p>
              <p
                className={`text-2xl font-bold ${subscriptionConfig.Harian.textColor} mt-1`}
              >
                {subscriptionStats.Harian}
              </p>
              <p className="text-xs text-gray-500 mt-1">Member aktif</p>
            </div>
            <Clock size={32} className="text-[#8E1616] opacity-60" />
          </div>
        </div>

        <div
          className={`bg-gradient-to-r ${subscriptionConfig.Bulanan.gradientFrom} ${subscriptionConfig.Bulanan.gradientTo} rounded-xl p-4 border border-[#D84040]/20 shadow-sm hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#D84040] font-semibold">
                Langganan Bulanan
              </p>
              <p
                className={`text-2xl font-bold ${subscriptionConfig.Bulanan.textColor} mt-1`}
              >
                {subscriptionStats.Bulanan}
              </p>
              <p className="text-xs text-gray-500 mt-1">Member aktif</p>
            </div>
            <Calendar size={32} className="text-[#D84040] opacity-60" />
          </div>
        </div>

        <div
          className={`bg-gradient-to-r ${subscriptionConfig.Tahunan.gradientFrom} ${subscriptionConfig.Tahunan.gradientTo} rounded-xl p-4 border border-[#1D1616]/20 shadow-sm hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#1D1616] font-semibold">
                Langganan Tahunan
              </p>
              <p
                className={`text-2xl font-bold ${subscriptionConfig.Tahunan.textColor} mt-1`}
              >
                {subscriptionStats.Tahunan}
              </p>
              <p className="text-xs text-gray-500 mt-1">Member aktif</p>
            </div>
            <CalendarDays size={32} className="text-[#1D1616] opacity-60" />
          </div>
        </div>
      </div>

      {/* Method Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
          <QrCode size={16} className="text-[#8E1616] mx-auto mb-1" />
          <p className="text-lg font-bold text-[#1D1616]">{methodStats.QRIS}</p>
          <p className="text-[10px] text-gray-500">QRIS</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
          <CreditCard size={16} className="text-[#D84040] mx-auto mb-1" />
          <p className="text-lg font-bold text-[#1D1616]">
            {methodStats["Transfer Bank"]}
          </p>
          <p className="text-[10px] text-gray-500">Transfer Bank</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
          <Wallet size={16} className="text-purple-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-[#1D1616]">
            {methodStats["Dompet Digital"]}
          </p>
          <p className="text-[10px] text-gray-500">Dompet Digital</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
          <Smartphone size={16} className="text-orange-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-[#1D1616]">
            {methodStats["Kartu Kredit"]}
          </p>
          <p className="text-[10px] text-gray-500">Kartu Kredit</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-bold text-[#1D1616]">
              Transaksi Pembayaran
            </p>
            <p className="text-xs text-gray-400">{filtered.length} transaksi</p>
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pembayaran..."
              className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] w-44"
            />
          </div>
        </div>

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
                  Tipe Langganan
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Jumlah
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Metode
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((payment) => {
                  const MethodIcon =
                    methodConfig[payment.method]?.icon || CreditCard;
                  const methodStyle =
                    methodConfig[payment.method] || methodConfig.QRIS;
                  const SubIcon =
                    subscriptionConfig[payment.subscriptionType]?.icon ||
                    Calendar;
                  const subStyle =
                    subscriptionConfig[payment.subscriptionType] ||
                    subscriptionConfig.Bulanan;
                  const StatusIcon =
                    statusConfig[payment.status]?.icon || CheckCircle;
                  const statusStyle =
                    statusConfig[payment.status] || statusConfig.Selesai;

                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-gray-500 font-semibold">
                        {payment.id}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#8E1616]/20 flex items-center justify-center text-[#8E1616] text-xs font-bold shadow-sm">
                            {payment.memberName?.charAt(0) || "?"}
                          </div>
                          <span className="font-semibold text-[#1D1616] text-sm">
                            {payment.memberName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${subStyle.className}`}
                        >
                          <SubIcon size={10} /> {subStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-[#8E1616]">
                        Rp {(payment.amount || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${methodStyle.className}`}
                        >
                          <MethodIcon size={10} /> {methodStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusStyle.className}`}
                        >
                          <StatusIcon size={10} /> {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-400">
                        {payment.date}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={40} className="text-gray-300" />
                      <p className="text-gray-500 font-medium">
                        Tidak ada transaksi ditemukan
                      </p>
                      <p className="text-xs text-gray-400">
                        Coba dengan kata kunci lain atau tambah transaksi baru
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#1D1616]">
                  Proses Pembayaran
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Pilih tipe langganan dan metode pembayaran
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
                  Nama Anggota
                </label>
                <input
                  name="memberName"
                  type="text"
                  value={form.memberName}
                  onChange={handleChange}
                  placeholder="Masukkan nama anggota"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Tipe Langganan
                </label>
                <select
                  name="subscriptionType"
                  value={form.subscriptionType}
                  onChange={handleSubscriptionChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                >
                  <option value="Harian">Harian (Rp 25.000 - 50.000)</option>
                  <option value="Bulanan">
                    Bulanan (Rp 500.000 - 1.000.000)
                  </option>
                  <option value="Tahunan">
                    Tahunan (Rp 1.200.000 - 2.500.000)
                  </option>
                </select>
                {form.subscriptionType && (
                  <p className="text-xs text-gray-400 mt-1">
                    *Kisaran harga:{" "}
                    {subscriptionConfig[form.subscriptionType]?.priceRange}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Jumlah (Rp)
                </label>
                <input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Metode Pembayaran
                </label>
                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                >
                  <option>QRIS</option>
                  <option>Transfer Bank</option>
                  <option>Dompet Digital</option>
                  <option>Kartu Kredit</option>
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
                className="flex-1 bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-md shadow-[#8E1616]/30"
              >
                Proses Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
