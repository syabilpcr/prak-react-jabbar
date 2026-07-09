import React, { useState, useEffect } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  Wallet,
  Activity,
  Award,
} from "lucide-react";

// ── Components ────────────────────────────────────────────────
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import ReportStatCard from "../components/ReportStatCard";
import AnimatedReportChart from "../components/AnimatedReportChart";
import api from "../lib/api";

const Reports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("monthly");
  const [isExporting, setIsExporting] = useState(false);

  // Database states
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch all paginated data from Supabase on mount
  useEffect(() => {
    const fetchAllPaginated = async (path) => {
      let allRows = [];
      let from = 0;
      const pageSize = 1000;
      while (true) {
        const res = await api.get(path, {
          headers: { Range: `${from}-${from + pageSize - 1}` },
        });
        allRows = allRows.concat(res.data || []);
        if (res.data.length < pageSize) break;
        from += pageSize;
      }
      return allRows;
    };

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const [memberRows, transaksiRows, presensiRows] = await Promise.all([
          fetchAllPaginated("/member"),
          fetchAllPaginated("/transaksi"),
          fetchAllPaginated("/absensi"),
        ]);
        setMembers(memberRows);
        setPayments(transaksiRows);
        setAttendance(presensiRows);
      } catch (err) {
        console.error("Gagal mengambil data laporan:", err);
        setFetchError("Gagal memuat data dari server. Periksa koneksi API Anda.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getChartData = () => {
    let sourceData = [];
    let dateField = "";

    if (reportType === "revenue") {
      sourceData = payments;
      dateField = "tgl_transaksi";
    } else if (reportType === "membership") {
      sourceData = members;
      dateField = "tgl_gabung";
    } else {
      sourceData = attendance;
      dateField = "tgl_absensi";
    }

    if (sourceData.length === 0) {
      return [{ label: "No Data", value: 0 }];
    }

    if (dateRange === "daily") {
      // Last 7 days aggregation
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split("T")[0];

        const rows = sourceData.filter((item) => {
          const itemDate = item[dateField] ? item[dateField].split("T")[0] : "";
          return itemDate === dayStr;
        });

        let val = 0;
        if (reportType === "revenue") {
          val = rows.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
        } else {
          val = rows.length;
        }

        const label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        result.push({ label, value: val });
      }
      return result;
    } else if (dateRange === "monthly") {
      // Jan - Dec monthly aggregation
      const currentYear = new Date().getFullYear();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
      
      return monthNames.map((name, index) => {
        const rows = sourceData.filter((item) => {
          if (!item[dateField]) return false;
          const d = new Date(item[dateField]);
          return d.getFullYear() === currentYear && d.getMonth() === index;
        });

        let val = 0;
        if (reportType === "revenue") {
          val = rows.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
        } else {
          val = rows.length;
        }

        return { label: name, value: val };
      });
    } else {
      // Past 3 years calendar aggregation
      const currentYear = new Date().getFullYear();
      const years = [currentYear - 2, currentYear - 1, currentYear];

      return years.map((y) => {
        const rows = sourceData.filter((item) => {
          if (!item[dateField]) return false;
          const d = new Date(item[dateField]);
          return d.getFullYear() === y;
        });

        let val = 0;
        if (reportType === "revenue") {
          val = rows.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
        } else {
          val = rows.length;
        }

        return { label: String(y), value: val };
      });
    }
  };

  const getChartTitle = () => {
    const periodText = {
      daily: "Harian (7 Hari Terakhir)",
      monthly: "Bulanan (Tahun Ini)",
      yearly: "Tahunan (3 Tahun Terakhir)",
    };
    const typeText = {
      revenue: "Grafik Pendapatan",
      membership: "Grafik Pertumbuhan Anggota",
      attendance: "Grafik Kunjungan Absensi",
    };
    return `${typeText[reportType]} - ${periodText[dateRange]}`;
  };

  const getChartType = () => {
    if (reportType === "membership") return "line";
    return "bar";
  };

  const getChartColor = () => {
    if (reportType === "revenue") return "#8C1007";
    if (reportType === "membership") return "#D84040";
    return "#8C1007";
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
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[#8C1007] rounded-full animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        {fetchError}
      </div>
    );
  }

  const chartData = getChartData();
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const averageValue = Math.round(totalValue / chartData.length);
  const highestItem = chartData.reduce((max, item) => (item.value > max.value ? item : max), chartData[0] || { label: "-", value: 0 });

  // Demographics and top spenders indicators
  const totalActive = members.filter((m) => m.status_member === "aktif" || m.status === "Active" || m.status === "aktif").length;
  const maleCount = members.filter((m) => m.jenis_kelamin === "L").length;
  const femaleCount = members.filter((m) => m.jenis_kelamin === "P").length;
  
  const topSpenders = [...members]
    .sort((a, b) => Number(b.total_nominal_transaksi || 0) - Number(a.total_nominal_transaksi || 0))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6 bg-[#f5f0eb] min-h-screen">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616] tracking-tight uppercase">
            Laporan & Analitik
          </h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5 font-medium">
            Monitor metrik performa keuangan, demografi anggota, dan pola kehadiran
          </p>
        </div>
        <Button
          type="primary"
          icon={Download}
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "Mengekspor..." : "Ekspor CSV"}
        </Button>
      </div>

      {/* Filter Options */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "revenue", label: "Pendapatan", icon: Wallet },
              { id: "membership", label: "Pertumbuhan Member", icon: Users },
              { id: "attendance", label: "Kunjungan Absensi", icon: TrendingUp },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    reportType === type.id
                      ? "bg-[#8C1007] text-[#FFF0C4]"
                      : "bg-[#f8f3ee] text-[#5a3030] border border-[#e8dfd6] hover:bg-[#f0e8e4]"
                  }`}
                >
                  <Icon size={14} />
                  {type.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={15} className="text-[#9e7a6e]" />
            <div className="flex gap-2">
              {[
                { value: "daily", label: "Harian" },
                { value: "monthly", label: "Bulanan" },
                { value: "yearly", label: "Tahunan" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    dateRange === option.value
                      ? "bg-[#8C1007] text-[#FFF0C4]"
                      : "bg-[#f8f3ee] text-[#5a3030] border border-[#e8dfd6] hover:bg-[#f0e8e4]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportStatCard
          title={`Total ${reportType === "revenue" ? "Pendapatan" : reportType === "membership" ? "Pendaftaran" : "Kunjungan"}`}
          value={totalValue}
          change={12.4}
          isPositive={true}
          prefix={reportType === "revenue" ? "Rp " : ""}
          suffix={reportType === "revenue" ? "" : reportType === "membership" ? " orang" : " kali"}
        />
        <ReportStatCard
          title="Nilai Rata-rata"
          value={averageValue}
          change={5.2}
          isPositive={true}
          prefix={reportType === "revenue" ? "Rp " : ""}
          suffix={reportType === "revenue" ? "" : reportType === "membership" ? " orang" : " kali"}
        />
        <ReportStatCard
          title={`Tertinggi (${highestItem.label})`}
          value={highestItem.value}
          change={18.1}
          isPositive={true}
          prefix={reportType === "revenue" ? "Rp " : ""}
          suffix={reportType === "revenue" ? "" : reportType === "membership" ? " orang" : " kali"}
        />
      </div>

      {/* Grid: Main Chart & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (Left/Center) */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatedReportChart
            data={chartData}
            type={getChartType()}
            title={getChartTitle()}
            color={getChartColor()}
          />
        </div>

        {/* Demographics / Quick Summary (Right) */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold text-[#1D1616] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={16} className="text-[#8C1007]" /> Demografi Anggota
            </h3>
            <div className="space-y-4">
              {/* Active status bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Anggota Aktif</span>
                  <span className="text-[#1D1616]">{totalActive} / {members.length}</span>
                </div>
                <ProgressBar
                  value={members.length > 0 ? (totalActive / members.length) * 100 : 0}
                  color="#8C1007"
                />
              </div>

              {/* Laki-laki bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Laki-laki (L)</span>
                  <span className="text-[#1D1616]">{maleCount} orang</span>
                </div>
                <ProgressBar
                  value={members.length > 0 ? (maleCount / members.length) * 100 : 0}
                  color="#3b82f6"
                />
              </div>

              {/* Perempuan bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Perempuan (P)</span>
                  <span className="text-[#1D1616]">{femaleCount} orang</span>
                </div>
                <ProgressBar
                  value={members.length > 0 ? (femaleCount / members.length) * 100 : 0}
                  color="#ec4899"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Data Anggota Terdaftar
            </p>
            <p className="text-2xl font-black text-[#1D1616] mt-1">
              {members.length} <span className="text-xs font-medium text-gray-500">total orang</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Detail Table & Top Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-[#1D1616] uppercase tracking-wider">Detail Data Laporan</h3>
            <p className="text-[11px] text-[#9e7a6e] mt-0.5">
              Rincian angka detail per periode yang dipilih
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#3E0703]">
                  <th className="text-left px-6 py-3.5 font-bold text-[#FFF0C4]/70 uppercase tracking-widest">
                    Periode
                  </th>
                  <th className="text-right px-6 py-3.5 font-bold text-[#FFF0C4]/70 uppercase tracking-widest">
                    Nilai
                  </th>
                  <th className="text-right px-6 py-3.5 font-bold text-[#FFF0C4]/70 uppercase tracking-widest">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chartData.map((item, index) => {
                  const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                  return (
                    <tr key={index} className="hover:bg-[#faf6f4] transition-colors">
                      <td className="px-6 py-3.5 font-bold text-[#1D1616]">
                        {item.label}
                      </td>
                      <td className="px-6 py-3.5 text-right font-black text-[#8C1007]">
                        {reportType === "revenue"
                          ? `Rp ${item.value.toLocaleString("id-ID")}`
                          : item.value.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-3.5 text-right text-[#9e7a6e]">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#8C1007] rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="font-bold">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-[#f8f3ee] border-t border-[#e8dfd6]">
                <tr className="font-black text-[#1D1616]">
                  <td className="px-6 py-3.5">Total</td>
                  <td className="px-6 py-3.5 text-right text-[#8C1007]">
                    {reportType === "revenue"
                      ? `Rp ${totalValue.toLocaleString("id-ID")}`
                      : totalValue.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-3.5 text-right">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#1D1616] uppercase tracking-wider flex items-center gap-2">
            <Award size={16} className="text-[#8C1007]" /> Kontributor Terbesar
          </h3>
          <p className="text-[11px] text-[#9e7a6e] font-medium leading-relaxed">
            Daftar 5 anggota dengan nominal transaksi perpanjangan membership tertinggi.
          </p>
          <div className="divide-y divide-gray-100">
            {topSpenders.map((m, idx) => (
              <div key={m.id_member || idx} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1D1616]">
                    {m.nama_lengkap}
                  </p>
                  <p className="text-[9px] text-gray-400 font-mono mt-0.5">
                    ID: {m.id_member}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#8C1007]">
                    Rp {Number(m.total_nominal_transaksi || 0).toLocaleString("id-ID")}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium">
                    {m.frekuensi_transaksi || 0}x perpanjangan
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
