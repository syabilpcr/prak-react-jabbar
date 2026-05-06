import { useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  Plus,
  X,
  Search,
  CreditCard,
  QrCode,
  Wallet,
  Smartphone,
  Calendar,
  CalendarDays,
  Clock,
} from "lucide-react";

const initialPayments = [
  {
    id: "PAY-001",
    memberName: "Alex Johnson",
    amount: 850000,
    method: "QRIS",
    status: "Selesai",
    date: "2024-12-01",
    subscriptionType: "Bulanan",
  },
  {
    id: "PAY-002",
    memberName: "Sarah Williams",
    amount: 1200000,
    method: "Transfer Bank",
    status: "Selesai",
    date: "2024-12-02",
    subscriptionType: "Tahunan",
  },
  {
    id: "PAY-003",
    memberName: "Mike Chen",
    amount: 500000,
    method: "Dompet Digital",
    status: "Menunggu",
    date: "2024-12-03",
    subscriptionType: "Bulanan",
  },
  {
    id: "PAY-004",
    memberName: "Jessica Lee",
    amount: 850000,
    method: "QRIS",
    status: "Selesai",
    date: "2024-12-04",
    subscriptionType: "Tahunan",
  },
  {
    id: "PAY-005",
    memberName: "David Kim",
    amount: 25000,
    method: "Kartu Kredit",
    status: "Gagal",
    date: "2024-12-05",
    subscriptionType: "Harian",
  },
];

const methodConfig = {
  QRIS: {
    className: "bg-green-100 text-green-700 border border-green-200",
    icon: QrCode,
    label: "QRIS",
  },
  "Transfer Bank": {
    className: "bg-blue-100 text-blue-700 border border-blue-200",
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
  Selesai: "bg-green-100 text-green-700 border border-green-200",
  Menunggu: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Gagal: "bg-red-100 text-red-700 border border-red-200",
};

const subscriptionConfig = {
  Harian: {
    className: "bg-cyan-100 text-cyan-700 border border-cyan-200",
    icon: Clock,
    label: "Harian",
    priceRange: "Rp 25.000 - 50.000",
  },
  Bulanan: {
    className: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    icon: Calendar,
    label: "Bulanan",
    priceRange: "Rp 500.000 - 1.000.000",
  },
  Tahunan: {
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: CalendarDays,
    label: "Tahunan",
    priceRange: "Rp 1.200.000 - 2.500.000",
  },
};

const Payments = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    memberName: "",
    amount: "",
    method: "QRIS",
    subscriptionType: "Bulanan",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubscriptionChange = (e) => {
    const subType = e.target.value;
    let suggestedAmount = "";
    
    switch(subType) {
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
      amount: suggestedAmount 
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
      subscriptionType: "Bulanan" 
    });
    setShowModal(false);
  };

  const filtered = payments.filter(
    (p) =>
      p.memberName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = payments
    .filter((p) => p.status === "Selesai")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "Menunggu")
    .reduce((sum, p) => sum + p.amount, 0);

  // Statistik berdasarkan tipe langganan
  const subscriptionStats = {
    Harian: payments.filter(p => p.subscriptionType === "Harian" && p.status === "Selesai").length,
    Bulanan: payments.filter(p => p.subscriptionType === "Bulanan" && p.status === "Selesai").length,
    Tahunan: payments.filter(p => p.subscriptionType === "Tahunan" && p.status === "Selesai").length,
  };

  return (
    <div>
      <PageHeader title="Pembayaran" breadcrumb={["Manajemen", "Pembayaran"]}>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <Plus size={14} /> Pembayaran Baru
        </button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm md:col-span-2">
          <p className="text-xs text-gray-400">Total Pendapatan</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm md:col-span-2">
          <p className="text-xs text-gray-400">Pembayaran Tertunda</p>
          <p className="text-2xl font-bold text-yellow-600">
            Rp {pendingAmount.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Total Transaksi</p>
          <p className="text-2xl font-bold text-[#8E1616]">
            {payments.length}
          </p>
        </div>
      </div>

      {/* Subscription Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-700 font-semibold">Langganan Harian</p>
              <p className="text-2xl font-bold text-cyan-800">{subscriptionStats.Harian}</p>
              <p className="text-xs text-cyan-600 mt-1">Member aktif</p>
            </div>
            <Clock size={32} className="text-cyan-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-700 font-semibold">Langganan Bulanan</p>
              <p className="text-2xl font-bold text-indigo-800">{subscriptionStats.Bulanan}</p>
              <p className="text-xs text-indigo-600 mt-1">Member aktif</p>
            </div>
            <Calendar size={32} className="text-indigo-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-semibold">Langganan Tahunan</p>
              <p className="text-2xl font-bold text-emerald-800">{subscriptionStats.Tahunan}</p>
              <p className="text-xs text-emerald-600 mt-1">Member aktif</p>
            </div>
            <CalendarDays size={32} className="text-emerald-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
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
              <tr className="bg-gray-50">
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
              {filtered.map((payment) => {
                const MethodIcon =
                  methodConfig[payment.method]?.icon || CreditCard;
                const methodStyle =
                  methodConfig[payment.method] || methodConfig.QRIS;
                const SubIcon = subscriptionConfig[payment.subscriptionType]?.icon || Calendar;
                const subStyle = subscriptionConfig[payment.subscriptionType] || subscriptionConfig.Bulanan;
                return (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-500 font-semibold">
                      {payment.id}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-[#1D1616] text-sm">
                      {payment.memberName}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${subStyle.className}`}
                      >
                        <SubIcon size={10} />
                        {subStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-[#8E1616]">
                      Rp {payment.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${methodStyle.className}`}
                      >
                        <MethodIcon size={10} />
                        {methodStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusConfig[payment.status]}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-400">
                      {payment.date}
                    </td>
                  </tr>
                );
              })}
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
                  <option value="Bulanan">Bulanan (Rp 500.000 - 1.000.000)</option>
                  <option value="Tahunan">Tahunan (Rp 1.200.000 - 2.500.000)</option>
                </select>
                {form.subscriptionType && (
                  <p className="text-xs text-gray-400 mt-1">
                    *Kisaran harga: {subscriptionConfig[form.subscriptionType]?.priceRange}
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
                className="flex-1 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
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