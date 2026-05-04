import { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Data mentah untuk semua periode
const rawRevenueData = {
  daily: [
    { label: "Senin", value: 8450000 },
    { label: "Selasa", value: 9200000 },
    { label: "Rabu", value: 10500000 },
    { label: "Kamis", value: 11800000 },
    { label: "Jumat", value: 13200000 },
    { label: "Sabtu", value: 15600000 },
    { label: "Minggu", value: 14800000 },
  ],
  weekly: [
    { label: "Minggu 1", value: 84500000 },
    { label: "Minggu 2", value: 92000000 },
    { label: "Minggu 3", value: 105000000 },
    { label: "Minggu 4", value: 118000000 },
  ],
  monthly: [
    { label: "Jan", value: 85000000 },
    { label: "Feb", value: 92000000 },
    { label: "Mar", value: 105000000 },
    { label: "Apr", value: 118000000 },
    { label: "Mei", value: 132000000 },
    { label: "Jun", value: 148000000 },
    { label: "Jul", value: 165000000 },
    { label: "Agu", value: 182000000 },
    { label: "Sep", value: 198000000 },
    { label: "Okt", value: 215000000 },
    { label: "Nov", value: 230000000 },
    { label: "Des", value: 250000000 },
  ],
  yearly: [
    { label: "2021", value: 850000000 },
    { label: "2022", value: 1050000000 },
    { label: "2023", value: 1350000000 },
    { label: "2024", value: 1680000000 },
  ],
};

const rawMemberData = {
  daily: [
    { label: "Senin", value: 45 },
    { label: "Selasa", value: 52 },
    { label: "Rabu", value: 58 },
    { label: "Kamis", value: 62 },
    { label: "Jumat", value: 75 },
    { label: "Sabtu", value: 89 },
    { label: "Minggu", value: 78 },
  ],
  weekly: [
    { label: "Minggu 1", value: 420 },
    { label: "Minggu 2", value: 485 },
    { label: "Minggu 3", value: 512 },
    { label: "Minggu 4", value: 560 },
  ],
  monthly: [
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
  ],
  yearly: [
    { label: "2021", value: 450 },
    { label: "2022", value: 580 },
    { label: "2023", value: 720 },
    { label: "2024", value: 847 },
  ],
};

const rawAttendanceData = {
  daily: [
    { label: "Senin", value: 85 },
    { label: "Selasa", value: 92 },
    { label: "Rabu", value: 98 },
    { label: "Kamis", value: 105 },
    { label: "Jumat", value: 112 },
    { label: "Sabtu", value: 128 },
    { label: "Minggu", value: 115 },
  ],
  weekly: [
    { label: "Minggu 1", value: 420 },
    { label: "Minggu 2", value: 485 },
    { label: "Minggu 3", value: 512 },
    { label: "Minggu 4", value: 560 },
  ],
  monthly: [
    { label: "Jan", value: 1850 },
    { label: "Feb", value: 1920 },
    { label: "Mar", value: 2050 },
    { label: "Apr", value: 2180 },
    { label: "Mei", value: 2250 },
    { label: "Jun", value: 2350 },
    { label: "Jul", value: 2480 },
    { label: "Agu", value: 2560 },
    { label: "Sep", value: 2650 },
    { label: "Okt", value: 2720 },
    { label: "Nov", value: 2850 },
    { label: "Des", value: 2980 },
  ],
  yearly: [
    { label: "2021", value: 18500 },
    { label: "2022", value: 21200 },
    { label: "2023", value: 24500 },
    { label: "2024", value: 28500 },
  ],
};

// Komponen Animated Chart
const AnimatedReportChart = ({
  data,
  type = "line",
  title,
  color = "#8E1616",
}) => {
  const canvasRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    setAnimationProgress(0);
    let startTime = null;
    const duration = 1500;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      setAnimationProgress(progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => setAnimationProgress(0);
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.clientWidth);
    const height = (canvas.height = canvas.clientHeight);

    ctx.clearRect(0, 0, width, height);

    if (!data || data.length === 0) return;

    const values = data.map((d) => d.value);
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue;
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const stepX = chartWidth / (data.length - 1);

    // Draw grid lines
    ctx.strokeStyle = "#D84040";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "#9CA3AF";
      ctx.font = "10px Barlow";
      const value = Math.round(maxValue - (i / 4) * range);
      if (type === "revenue") {
        ctx.fillText(`Rp${(value / 1000000).toFixed(0)}M`, 5, y + 3);
      } else {
        ctx.fillText(value.toString(), 5, y + 3);
      }
    }

    if (type === "line") {
      // Draw line with animation
      const animatedValues = values.map(
        (v) => minValue + (v - minValue) * animationProgress,
      );

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;

      animatedValues.forEach((value, index) => {
        const x = padding.left + index * stepX;
        const y =
          padding.top +
          chartHeight -
          ((value - minValue) / range) * chartHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw area under line
      ctx.lineTo(
        padding.left + (data.length - 1) * stepX,
        padding.top + chartHeight,
      );
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.closePath();
      ctx.fillStyle = `${color}20`;
      ctx.fill();

      // Draw points with animation
      animatedValues.forEach((value, index) => {
        const x = padding.left + index * stepX;
        const y =
          padding.top +
          chartHeight -
          ((value - minValue) / range) * chartHeight;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (type === "bar") {
      const barWidth = stepX * 0.6;
      values.forEach((value, index) => {
        const animatedHeight =
          (value / maxValue) * chartHeight * animationProgress;
        const x = padding.left + index * stepX - barWidth / 2;
        const y = padding.top + chartHeight - animatedHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, animatedHeight);

        if (animationProgress > 0.9) {
          ctx.fillStyle = color;
          ctx.font = "bold 10px Barlow";
          if (type === "revenue") {
            ctx.fillText(
              `Rp${(value / 1000000).toFixed(0)}M`,
              x + barWidth / 2 - 20,
              y - 5,
            );
          } else {
            ctx.fillText(value.toString(), x + barWidth / 2 - 10, y - 5);
          }
        }
      });
    }

    // Draw X axis labels
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px Barlow";
    data.forEach((item, index) => {
      const x = padding.left + index * stepX - 15;
      const y = height - padding.bottom + 15;
      ctx.fillText(item.label, x, y);
    });

    // Draw title
    ctx.fillStyle = "#1D1616";
    ctx.font = "bold 12px Barlow";
    ctx.fillText(title, padding.left, 15);
  }, [data, type, animationProgress, color]);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <canvas ref={canvasRef} className="w-full h-80" />
    </div>
  );
};

// Komponen untuk menampilkan statistik berdasarkan periode
const StatCard = ({
  title,
  value,
  change,
  isPositive,
  prefix = "",
  suffix = "",
}) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
    <p className="text-xs text-gray-400">{title}</p>
    <p className="text-2xl font-bold text-[#1D1616] mt-1">
      {prefix}
      {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      {suffix}
    </p>
    <div className="flex items-center gap-1 mt-2">
      <span
        className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? "↑" : "↓"} {Math.abs(change)}%
      </span>
      <span className="text-xs text-gray-400">dari periode sebelumnya</span>
    </div>
  </div>
);

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
    if (reportType === "membership") return "#D84040";
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
    { value: "daily", label: "📅 Harian" },
    { value: "monthly", label: "📊 Bulanan" },
    { value: "yearly", label: "📈 Tahunan" },
  ];

  return (
    <div>
      <PageHeader
        title="Laporan & Analitik"
        breadcrumb={["Manajemen", "Laporan"]}
      >
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30 disabled:opacity-50"
        >
          <Download size={14} />{" "}
          {isExporting ? "Mengekspor..." : "Ekspor Laporan"}
        </button>
      </PageHeader>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "revenue", label: "💰 Pendapatan", icon: Wallet },
              { id: "membership", label: "👥 Keanggotaan", icon: Users },
              { id: "attendance", label: "📋 Absensi", icon: TrendingUp },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                    reportType === type.id
                      ? "bg-[#8E1616] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={16} />
                  {type.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <div className="flex gap-2">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    dateRange === option.value
                      ? "bg-[#8E1616] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
        <StatCard
          title="Total"
          value={formatStatValue()}
          change={getChangePercentage()}
          isPositive={true}
          prefix={getStatPrefix()}
          suffix={getStatSuffix()}
        />
        <StatCard
          title="Rata-rata"
          value={averageValue}
          change={getChangePercentage() - 5}
          isPositive={true}
          prefix={getStatPrefix()}
          suffix={getStatSuffix()}
        />
        <StatCard
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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-bold text-[#1D1616]">Data Detail</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Data lengkap per periode
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nilai
                </th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chartData.map((item, index) => {
                const percentage = (item.value / totalValue) * 100;
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-[#1D1616]">
                      {item.label}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-[#8E1616]">
                      {reportType === "revenue"
                        ? `Rp ${item.value.toLocaleString("id-ID")}`
                        : item.value.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-500">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td className="px-6 py-3 font-bold text-[#1D1616]">Total</td>
                <td className="px-6 py-3 text-right font-bold text-[#8E1616]">
                  {reportType === "revenue"
                    ? `Rp ${totalValue.toLocaleString("id-ID")}`
                    : totalValue.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-3 text-right font-bold text-[#1D1616]">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Real-time Summary */}
      <div className="bg-gradient-to-r from-[#8E1616]/5 to-[#D84040]/5 rounded-2xl p-5 border border-gray-200">
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
