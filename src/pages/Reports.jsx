import { useState } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

// ── Components ────────────────────────────────────────────────
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import ReportStatCard from "../components/ReportStatCard";
import AnimatedReportChart from "../components/AnimatedReportChart";

// ── Data ──────────────────────────────────────────────────────
import { rawRevenueData, rawMemberData, rawAttendanceData } from "../data/reportsData";

// Komponen AnimatedReportChart dan ReportStatCard diimport dari folder components

const Reports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("monthly");
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const getChartData = () => {
    switch (reportType) {
      case "revenue":
        return rawRevenueData[dateRange];
      case "membership":
        return rawMemberData[dateRange];
      case "attendance":
        return rawAttendanceData[dateRange];
      default:
        return rawRevenueData[dateRange];
    }
  };

  const getChartTitle = () => {
    const periodText = {
      daily: "Harian",
      monthly: "Bulanan",
      yearly: "Tahunan",
    };
    const typeText = {
      revenue: "Pendapatan",
      membership: "Pertumbuhan Anggota",
      attendance: "Absensi",
    };
    return `${typeText[reportType]} - ${periodText[dateRange]} (2024)`;
  };

  const getChartType = () => {
    if (reportType === "membership") return "line";
    if (reportType === "attendance") return "bar";
    return "bar";
  };

  const getChartColor = () => {
    if (reportType === "revenue") return "#8E1616";
    if (reportType === "membership") return "#000000";
    return "#8E1616";
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const data = getChartData();
      const csvContent = [
        ["Periode", "Nilai"],
        ...data.map((item) => [item.label, item.value]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan_${reportType}_${dateRange}_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      alert("Laporan berhasil diekspor!");
    }, 500);
  };

  // Hitung total berdasarkan data
  const chartData = getChartData();
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const averageValue = totalValue / chartData.length;

  // Simulasi persentase perubahan
  const getChangePercentage = () => {
    const changes = {
      daily: { revenue: 12.5, membership: 8.3, attendance: 15.2 },
      weekly: { revenue: 18.2, membership: 12.5, attendance: 20.1 },
      monthly: { revenue: 22.8, membership: 15.7, attendance: 25.3 },
      yearly: { revenue: 35.6, membership: 28.4, attendance: 32.9 },
    };
    return changes[dateRange]?.[reportType] || 15.5;
  };

  const getStatPrefix = () => {
    if (reportType === "revenue") return "Rp ";
    return "";
  };

  const getStatSuffix = () => {
    if (reportType === "revenue") return "";
    if (reportType === "attendance") return " kali";
    return " orang";
  };

  const formatStatValue = () => {
    if (reportType === "revenue") return totalValue;
    return totalValue;
  };

  const periodOptions = [
    { value: "daily", label: "Harian" },
    { value: "monthly", label: "Bulanan" },
    { value: "yearly", label: "Tahunan" },
  ];

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      {/* ── Page Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">
            Laporan & Analitik
          </h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Analisis data pendapatan, keanggotaan, dan absensi
          </p>
        </div>
        <Button
          type="primary"
          icon={Download}
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "Mengekspor..." : "Ekspor Laporan"}
        </Button>
      </div>

      {/* Filter Section */}
      <div
        className="bg-white rounded-2xl border border-[#E8C999]/50 p-4"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
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
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                    reportType === type.id
                      ? "bg-[#8E1616] text-[#F8EEDF]"
                      : "bg-[#F8EEDF] text-[#5a3030] border border-[#E8C999] hover:bg-[#f0e3cf]"
                  }`}
                >
                  <Icon size={16} />
                  {type.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-[#9e7a6e]" />
            <div className="flex gap-2">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    dateRange === option.value
                      ? "bg-[#8E1616] text-[#F8EEDF]"
                      : "bg-[#F8EEDF] text-[#5a3030] border border-[#E8C999] hover:bg-[#f0e3cf]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ReportStatCard
          title="Total"
          value={formatStatValue()}
          change={getChangePercentage()}
          isPositive={true}
          prefix={getStatPrefix()}
          suffix={getStatSuffix()}
        />
        <ReportStatCard
          title="Rata-rata"
          value={averageValue}
          change={getChangePercentage() - 5}
          isPositive={true}
          prefix={getStatPrefix()}
          suffix={getStatSuffix()}
        />
        <ReportStatCard
          title={`Tertinggi (${chartData.reduce((max, item) => (item.value > max.value ? item : max), chartData[0]).label})`}
          value={Math.max(...chartData.map((d) => d.value))}
          change={getChangePercentage() + 3}
          isPositive={true}
          prefix={getStatPrefix()}
          suffix={getStatSuffix()}
        />
      </div>

      {/* Main Chart */}
      <div className="mb-6">
        <AnimatedReportChart
          data={chartData}
          type={getChartType()}
          title={getChartTitle()}
          color={getChartColor()}
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-[#E8C999]/50 overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="px-6 py-4 border-b border-[#E8C999]/40">
          <p className="text-sm font-bold text-[#1D1616]">Data Detail</p>
          <p className="text-xs text-[#9e7a6e] mt-0.5">
            Data lengkap per periode
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#000000]">
                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-[#F8EEDF]/70 uppercase tracking-widest">
                  Periode
                </th>
                <th className="text-right px-6 py-3.5 text-[10px] font-bold text-[#F8EEDF]/70 uppercase tracking-widest">
                  Nilai
                </th>
                <th className="text-right px-6 py-3.5 text-[10px] font-bold text-[#F8EEDF]/70 uppercase tracking-widest">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f0eb]">
              {chartData.map((item, index) => {
                const percentage = (item.value / totalValue) * 100;
                return (
                  <tr
                    key={index}
                    className="hover:bg-[#faf6f4] transition-colors"
                  >
                    <td className="px-6 py-3.5 font-medium text-[#1D1616]">
                      {item.label}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-[#8E1616]">
                      {reportType === "revenue"
                        ? `Rp ${item.value.toLocaleString("id-ID")}`
                        : item.value.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3.5 text-right text-[#9e7a6e]">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#8E1616] rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#F8EEDF] border-t border-[#E8C999]">
              <tr>
                <td className="px-6 py-3.5 font-bold text-[#1D1616]">Total</td>
                <td className="px-6 py-3.5 text-right font-bold text-[#8E1616]">
                  {reportType === "revenue"
                    ? `Rp ${totalValue.toLocaleString("id-ID")}`
                    : totalValue.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-3.5 text-right font-bold text-[#1D1616]">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Real-time Summary */}
      <div className="bg-gradient-to-r from-[#8E1616]/5 to-[#E8C999]/15 rounded-2xl p-5 border border-[#E8C999]/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1D1616] flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Ringkasan Langsung
          </h3>
          <span className="text-xs text-gray-400">
            Terakhir diperbarui: {new Date().toLocaleTimeString("id-ID")}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400">Periode Aktif</p>
            <p className="text-lg font-bold text-[#1D1616] capitalize">
              {dateRange}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Jumlah Data</p>
            <p className="text-lg font-bold text-[#1D1616]">
              {chartData.length} periode
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Nilai Tertinggi</p>
            <p className="text-lg font-bold text-green-600">
              {reportType === "revenue"
                ? `Rp ${Math.max(...chartData.map((d) => d.value)).toLocaleString("id-ID")}`
                : Math.max(...chartData.map((d) => d.value)).toLocaleString(
                    "id-ID",
                  )}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Nilai Terendah</p>
            <p className="text-lg font-bold text-orange-600">
              {reportType === "revenue"
                ? `Rp ${Math.min(...chartData.map((d) => d.value)).toLocaleString("id-ID")}`
                : Math.min(...chartData.map((d) => d.value)).toLocaleString(
                    "id-ID",
                  )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
