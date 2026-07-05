import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Wallet,
  CalendarCheck,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  TrendingDown
} from "lucide-react";
import StatCard from "../components/StatCard";

// Raw Member Data matching Power BI table exactly
const rawMembers = [
  { id: "M-1001", nominal: 10600000, transaksi: 7, status: "Aktif", paket: "Perpanjangan 3 Bulan", bulan: "Maret" },
  { id: "M-1002", nominal: 12700000, transaksi: 13, status: "Aktif", paket: "Perpanjangan 6 Bulan", bulan: "April" },
  { id: "M-1003", nominal: 12000000, transaksi: 9, status: "Tidak Aktif", paket: "Perpanjangan 3 Bulan", bulan: "Mei" },
  { id: "M-1004", nominal: 13400000, transaksi: 13, status: "Aktif", paket: "Perpanjangan 6 Bulan", bulan: "Juni" },
  { id: "M-1005", nominal: 20700000, transaksi: 14, status: "Aktif", paket: "Perpanjangan 6 Bulan", bulan: "Juni" },
  { id: "M-1006", nominal: 38500000, transaksi: 25, status: "Aktif", paket: "Perpanjangan 1 Tahun", bulan: "Mei" },
  { id: "M-1007", nominal: 28700000, transaksi: 21, status: "Aktif", paket: "Perpanjangan 1 Tahun", bulan: "Juni" },
  { id: "M-1008", nominal: 41900000, transaksi: 25, status: "Aktif", paket: "Perpanjangan 1 Tahun", bulan: "Juni" },
  { id: "M-1009", nominal: 25400000, transaksi: 23, status: "Aktif", paket: "Perpanjangan 6 Bulan", bulan: "April" },
  { id: "M-1010", nominal: 11700000, transaksi: 12, status: "Tidak Aktif", paket: "Perpanjangan 1 Bulan", bulan: "Januari" },
  { id: "M-1011", nominal: 30900000, transaksi: 21, status: "Aktif", paket: "Perpanjangan 1 Tahun", bulan: "Juni" },
  { id: "M-1012", nominal: 13400000, transaksi: 13, status: "Aktif", paket: "Perpanjangan 6 Bulan", bulan: "Februari" },
  { id: "M-1013", nominal: 32000000, transaksi: 23, status: "Aktif", paket: "Perpanjangan 1 Tahun", bulan: "Mei" },
  { id: "M-1014", nominal: 2800000, transaksi: 2, status: "Tidak Aktif", paket: "Perpanjangan 1 Bulan", bulan: "Januari" },
  { id: "M-1015", nominal: 17400000, transaksi: 11, status: "Aktif", paket: "Perpanjangan 3 Bulan", bulan: "Maret" },
  { id: "M-1016", nominal: 7300000, transaksi: 8, status: "Tidak Aktif", paket: "Perpanjangan 1 Bulan", bulan: "Februari" },
  { id: "M-1017", nominal: 20500000, transaksi: 17, status: "Aktif", paket: "Perpanjangan 6 Bulan", bulan: "April" },
  { id: "M-1018", nominal: 23700000, transaksi: 17, status: "Aktif", paket: "Perpanjangan 6 Bulan", bulan: "Mei" },
  { id: "M-1019", nominal: 16300000, transaksi: 12, status: "Aktif", paket: "Perpanjangan 3 Bulan", bulan: "Maret" },
  { id: "M-1020", nominal: 32100000, transaksi: 24, status: "Aktif", paket: "Perpanjangan 1 Tahun", bulan: "Juni" }
];

// Product revenue totals representing Power BI chart data
const productData = [
  { label: "Perpanjangan 1 Tahun", value: 8200000000, count: 4800 },
  { label: "Perpanjangan 6 Bulan", value: 4800000000, count: 3200 },
  { label: "Perpanjangan 3 Bulan", value: 2200000000, count: 2500 },
  { label: "Perpanjangan 1 Bulan", value: 929900000, count: 2042 }
];

// Monthly revenue totals matching Power BI trend
const monthlyRevenueData = [
  { label: "January", value: 1200000000 },
  { label: "February", value: 1300000000 },
  { label: "March", value: 1700000000 },
  { label: "April", value: 1800000000 },
  { label: "May", value: 2100000000 },
  { label: "June", value: 2600000000 },
  { label: "July", value: 900000000 },
  { label: "August", value: 950000000 },
  { label: "September", value: 1000000000 },
  { label: "October", value: 1100000000 },
  { label: "November", value: 1200000000 },
  { label: "December", value: 1300000000 }
];

export default function Dashboard() {
  const [filterPaket, setFilterPaket] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBulan, setFilterBulan] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Calculate dynamic metrics based on filters
  const filteredMembers = rawMembers.filter(m => {
    const matchesSearch = m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPaket = filterPaket === "All" || m.paket === filterPaket;
    const matchesStatus = filterStatus === "All" || m.status === filterStatus;
    const matchesBulan = filterBulan === "All" || m.bulan === filterBulan;
    return matchesSearch && matchesPaket && matchesStatus && matchesBulan;
  });

  // Calculate totals
  const totalPendapatan = filteredMembers.reduce((acc, curr) => acc + curr.nominal, 0);
  const totalTransaksi = filteredMembers.reduce((acc, curr) => acc + curr.transaksi, 0);
  const totalMember = filteredMembers.length;
  const avgTransaksi = totalMember > 0 ? Math.round(totalPendapatan / totalMember) : 0;

  // Format currency helpers matching Power BI cards
  const formatPendapatan = (val) => {
    if (val >= 1000000000) {
      return (val / 1000000000).toFixed(2) + "bn";
    }
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + "M";
    }
    return val.toLocaleString("id-ID");
  };

  const formatAvgTransaksi = (val) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(2) + "M";
    }
    return val.toLocaleString("id-ID");
  };

  // Stagger configurations for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const handleResetFilters = () => {
    setFilterPaket("All");
    setFilterStatus("All");
    setFilterBulan("All");
    setSearchQuery("");
  };

  return (
    <div className="p-6 space-y-6 bg-[#f5f0eb] min-h-screen">
      
      {/* ── Dashboard Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-down">
        <div>
          <h1 className="text-[24px] font-black text-[#1D1616] tracking-tight uppercase flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#8C1007] rounded-full inline-block" />
            Zeus Power BI Analytics
          </h1>
          <p className="text-[12px] text-[#9e7a6e] font-semibold mt-0.5">
            Laporan Real-time Interaktif Sinkron dengan Dashboard Power BI
          </p>
        </div>

        {/* Dynamic Reset Filter Button */}
        {(filterPaket !== "All" || filterStatus !== "All" || filterBulan !== "All" || searchQuery !== "") && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#8C1007] text-[#FFF0C4] rounded-xl text-xs font-bold hover:bg-[#a01a0a] transition-all hover:scale-[1.02] shadow-md shadow-[#8C1007]/20"
          >
            <RefreshCw size={13} className="animate-spin-slow" />
            Reset Filter
          </button>
        )}
      </div>

      {/* ── Filters Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-scale-in delay-75">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">Cari Member ID</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="M-1001..."
              className="w-full pl-9 pr-4 py-2 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl text-xs text-[#1D1616] placeholder-gray-400 font-semibold focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">Pilihan Paket</label>
          <select
            value={filterPaket}
            onChange={(e) => setFilterPaket(e.target.value)}
            className="px-3 py-2 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl text-xs text-[#5a3030] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
          >
            <option value="All">All Paket</option>
            <option value="Perpanjangan 1 Tahun">Perpanjangan 1 Tahun</option>
            <option value="Perpanjangan 6 Bulan">Perpanjangan 6 Bulan</option>
            <option value="Perpanjangan 3 Bulan">Perpanjangan 3 Bulan</option>
            <option value="Perpanjangan 1 Bulan">Perpanjangan 1 Bulan</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">Status Member</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl text-xs text-[#5a3030] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
          >
            <option value="All">All Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">Bulan Transaksi</label>
          <select
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            className="px-3 py-2 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl text-xs text-[#5a3030] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
          >
            <option value="All">All Bulan</option>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
          </select>
        </div>
      </div>

      {/* ── KPI cards Row ── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-5 hover-lift relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-extrabold text-[#9e7a6e] uppercase tracking-wider">Total Pendapatan</span>
            <div className="w-8 h-8 rounded-lg bg-[#8C1007]/10 flex items-center justify-center">
              <Wallet size={14} className="text-[#8C1007]" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#1D1616] tracking-tight">{formatPendapatan(totalPendapatan)}</h2>
          <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
            <span>Rp {totalPendapatan.toLocaleString("id-ID")}</span>
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-5 hover-lift relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-extrabold text-[#9e7a6e] uppercase tracking-wider">Total Transaksi</span>
            <div className="w-8 h-8 rounded-lg bg-[#8C1007]/10 flex items-center justify-center">
              <TrendingUp size={14} className="text-[#8C1007]" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#1D1616] tracking-tight">{totalTransaksi.toLocaleString("id-ID")}</h2>
          <p className="text-[10px] text-[#9e7a6e] font-bold mt-2">Frekuensi Total</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-5 hover-lift relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-extrabold text-[#9e7a6e] uppercase tracking-wider">Total Member</span>
            <div className="w-8 h-8 rounded-lg bg-[#8C1007]/10 flex items-center justify-center">
              <Users size={14} className="text-[#8C1007]" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#1D1616] tracking-tight">{totalMember}</h2>
          <p className="text-[10px] text-green-600 font-bold mt-2">1K Total di Power BI</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-5 hover-lift relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-extrabold text-[#9e7a6e] uppercase tracking-wider">Rata-rata Transaksi</span>
            <div className="w-8 h-8 rounded-lg bg-[#8C1007]/10 flex items-center justify-center">
              <CalendarCheck size={14} className="text-[#8C1007]" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#1D1616] tracking-tight">{formatAvgTransaksi(avgTransaksi)}</h2>
          <p className="text-[10px] text-[#9e7a6e] font-bold mt-2">Avg: Rp {avgTransaksi.toLocaleString("id-ID")}</p>
        </motion.div>
      </motion.div>

      {/* ── Main Dashboard Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Member Detail Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up delay-150 flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase text-[#1D1616] tracking-wider">Daftar Transaksi Member</h3>
                <p className="text-[10px] text-[#9e7a6e] font-semibold mt-0.5">Menampilkan {filteredMembers.length} Baris Data</p>
              </div>
              <div className="flex items-center gap-1 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl px-2.5 py-1">
                <span className="text-[9px] font-bold text-[#8C1007] tracking-widest uppercase">TABLE-SYNC</span>
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-[#3E0703] text-[#FFF0C4]/80 text-[9px] uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-3">id_member</th>
                    <th className="px-4 py-3 text-right">Sum of nominal</th>
                    <th className="px-4 py-3 text-right">Count of id_transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f0eb]">
                  <AnimatePresence>
                    {filteredMembers.map((m) => (
                      <motion.tr
                        key={m.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="hover:bg-[#faf6f4] transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-[#8C1007]">{m.id}</td>
                        <td className="px-4 py-3 text-right font-mono font-medium text-[#1D1616]">
                          {m.nominal.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-[#9e7a6e]">{m.transaksi}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer matching total exactly */}
          <div className="bg-[#f8f3ee] px-4 py-3 border-t border-[#e8dfd6] flex items-center justify-between text-[11px] font-black text-[#1D1616]">
            <span>Total</span>
            <div className="flex gap-6 font-mono">
              <span>{totalPendapatan.toLocaleString("id-ID")}</span>
              <span className="text-[#8C1007]">{totalTransaksi}</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Charts & Analytics */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Chart 1: Pendapatan Tiap Produk */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover-lift animate-slide-up delay-200">
              <h4 className="text-xs font-black uppercase text-[#1D1616] tracking-wider mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#8C1007] rounded-full inline-block" />
                Pendapatan Tiap Produk
              </h4>
              <div className="space-y-4">
                {productData.map((p, idx) => {
                  // Calculate dynamic percentage
                  const maxVal = Math.max(...productData.map(pd => pd.value));
                  const percentage = (p.value / maxVal) * 100;
                  return (
                    <div key={p.label} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-[#5a3030]">
                        <span>{p.label}</span>
                        <span className="text-[#1D1616]">Rp {(p.value / 1000000000).toFixed(1)}bn</span>
                      </div>
                      <div className="h-3 bg-[#f8f3ee] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#3e0703] to-[#8c1007] rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Status Member */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover-lift animate-slide-up delay-200">
              <h4 className="text-xs font-black uppercase text-[#1D1616] tracking-wider mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#8C1007] rounded-full inline-block" />
                Status Member
              </h4>
              <div className="flex flex-col justify-center h-full space-y-6 pb-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#5a3030]">
                    <span>Aktif</span>
                    <span className="text-[#1D1616]">830 Members (83%)</span>
                  </div>
                  <div className="h-4 bg-[#f8f3ee] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "83%" }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-[#8C1007] rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#5a3030]">
                    <span>Tidak Aktif</span>
                    <span className="text-[#1D1616]">170 Members (17%)</span>
                  </div>
                  <div className="h-4 bg-[#f8f3ee] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "17%" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-[#9e7a6e] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 3: Pendapatan Tiap Bulan */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover-lift animate-slide-up delay-250">
            <h4 className="text-xs font-black uppercase text-[#1D1616] tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#8C1007] rounded-full inline-block" />
              Pendapatan Tiap Bulan
            </h4>
            <div className="h-44 flex items-end justify-between gap-1 pt-6 px-2">
              {monthlyRevenueData.map((d, idx) => {
                const maxVal = Math.max(...monthlyRevenueData.map(md => md.value));
                const percentage = (d.value / maxVal) * 100;
                return (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    <div className="relative w-full h-full flex items-end justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                        className="w-full bg-[#8C1007] rounded-t-md hover:bg-[#a01a0a] transition-colors"
                        title={`${d.label}: Rp ${(d.value / 1000000000).toFixed(2)}bn`}
                      />
                    </div>
                    <span className="text-[8px] text-[#9e7a6e] font-bold block transform -rotate-45 md:rotate-0 whitespace-nowrap">
                      {d.label.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 4: Performa Transaksi Member (Scatter Plot) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover-lift animate-slide-up delay-300">
            <h4 className="text-xs font-black uppercase text-[#1D1616] tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#8C1007] rounded-full inline-block" />
              Performa Transaksi Member (Nominal vs Frekuensi)
            </h4>
            <div className="relative h-48 border-l border-b border-gray-200 mt-6 mx-4">
              {/* Grid Lines */}
              <div className="absolute left-0 right-0 top-0 border-t border-dashed border-gray-100" />
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-gray-100" />
              
              {/* Y-Axis Label */}
              <span className="absolute -left-7 top-0 text-[8px] font-bold text-gray-400">40M</span>
              <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-[8px] font-bold text-gray-400">20M</span>
              <span className="absolute -left-7 bottom-0 text-[8px] font-bold text-gray-400">0M</span>

              {/* X-Axis Label */}
              <span className="absolute left-0 -bottom-5 text-[8px] font-bold text-gray-400">0</span>
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 text-[8px] font-bold text-gray-400">10</span>
              <span className="absolute right-0 -bottom-5 text-[8px] font-bold text-gray-400">20+</span>

              {/* Scatter Points mapping each rawMember */}
              {rawMembers.map((m, idx) => {
                // Calculate position percentages
                // nominal max ~45,000,000
                const bottomPct = (m.nominal / 45000000) * 100;
                // transaksi max ~26
                const leftPct = (m.transaksi / 26) * 100;

                return (
                  <motion.div
                    key={m.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ type: "spring", delay: idx * 0.05 }}
                    style={{ bottom: `${bottomPct}%`, left: `${leftPct}%` }}
                    className="absolute w-2.5 h-2.5 bg-[#8C1007] rounded-full hover:bg-orange-500 hover:scale-150 hover:opacity-100 cursor-pointer transition-all duration-200 shadow-sm"
                    title={`${m.id}: Rp ${m.nominal.toLocaleString("id-ID")} (${m.transaksi}x)`}
                  />
                );
              })}
            </div>
            <p className="text-center text-[9px] font-bold text-[#9e7a6e] mt-6 tracking-wide">
              X-Axis: Count of id_transaksi  |  Y-Axis: Sum of nominal
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
