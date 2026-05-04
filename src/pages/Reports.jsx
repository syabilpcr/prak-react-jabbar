import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ReportChart from "../components/ReportChart";
import { Download, Calendar, TrendingUp, Users, Wallet } from "lucide-react";

const revenueData = [
  { label: "Jan", value: 85 },
  { label: "Feb", value: 92 },
  { label: "Mar", value: 105 },
  { label: "Apr", value: 118 },
  { label: "Mei", value: 132 },
  { label: "Jun", value: 148 },
  { label: "Jul", value: 165 },
  { label: "Agu", value: 182 },
  { label: "Sep", value: 198 },
  { label: "Okt", value: 215 },
  { label: "Nov", value: 230 },
  { label: "Des", value: 250 },
];
const memberGrowthData = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 135 },
  { label: "Mar", value: 148 },
  { label: "Apr", value: 162 },
  { label: "Mei", value: 175 },
  { label: "Jun", value: 189 },
  { label: "Jul", value: 210 },
  { label: "Agu", value: 235 },
  { label: "Sep", value: 258 },
  { label: "Okt", value: 275 },
  { label: "Nov", value: 290 },
  { label: "Des", value: 310 },
];
const attendanceData = [
  { label: "Minggu 1", value: 420 },
  { label: "Minggu 2", value: 485 },
  { label: "Minggu 3", value: 512 },
  { label: "Minggu 4", value: 560 },
];

const Reports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("monthly");
  const handleExport = () => alert("Mengekspor data laporan...");
  const getChartTitle = () => {
    switch (reportType) {
      case "revenue":
        return "Laporan Pendapatan (2024)";
      case "membership":
        return "Pertumbuhan Anggota (2024)";
      case "attendance":
        return "Absensi Mingguan";
      default:
        return "Laporan";
    }
  };
  const getChartData = () => {
    switch (reportType) {
      case "revenue":
        return revenueData;
      case "membership":
        return memberGrowthData;
      case "attendance":
        return attendanceData;
      default:
        return revenueData;
    }
  };
  const getChartType = () => (reportType === "membership" ? "line" : "bar");

  return (
    <div>
      <PageHeader
        title="Laporan & Analitik"
        breadcrumb={["Manajemen", "Laporan"]}
      >
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <Download size={14} /> Ekspor Laporan
        </button>
      </PageHeader>
      <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {[
              { id: "revenue", label: "Pendapatan", icon: Wallet },
              { id: "membership", label: "Keanggotaan", icon: Users },
              { id: "attendance", label: "Absensi", icon: TrendingUp },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${reportType === type.id ? "bg-[#8E1616] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  <Icon size={14} />
                  {type.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1D1616]"
            >
              <option>harian</option>
              <option>mingguan</option>
              <option>bulanan</option>
              <option>tahunan</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <ReportChart
          data={getChartData()}
          type={getChartType()}
          title={getChartTitle()}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Total Pendapatan (YTD)</p>
          <p className="text-2xl font-bold text-[#8E1616]">Rp 680.000.000</p>
          <span className="text-xs text-green-600 mt-2 inline-block">
            ↑ +18.5% dari tahun lalu
          </span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Anggota Aktif</p>
          <p className="text-2xl font-bold text-[#1D1616]">623</p>
          <span className="text-xs text-green-600 mt-2 inline-block">
            ↑ +5.3% dari bulan lalu
          </span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400">Tingkat Retensi</p>
          <p className="text-2xl font-bold text-[#1D1616]">86%</p>
          <span className="text-xs text-green-600 mt-2 inline-block">
            ↑ +4.1% dari bulan lalu
          </span>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1D1616]">
            Ringkasan Keuangan Langsung
          </h3>
          <span className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            Langsung
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400">Pendapatan Hari Ini</p>
            <p className="text-lg font-bold text-[#1D1616]">Rp 8.450.000</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Minggu Ini</p>
            <p className="text-lg font-bold text-[#1D1616]">Rp 42.300.000</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Bulan Ini</p>
            <p className="text-lg font-bold text-[#1D1616]">Rp 148.000.000</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Pembayaran Tertunda</p>
            <p className="text-lg font-bold text-yellow-600">Rp 12.500.000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
