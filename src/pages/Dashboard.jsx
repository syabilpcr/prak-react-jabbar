import { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import {
  Users,
  Wallet,
  CalendarCheck,
  TrendingUp,
  Dumbbell,
  MapPin,
  Navigation,
  Plus,
  Minus,
} from "lucide-react";

const statsData = [
  {
    icon: Users,
    iconBg: "bg-[#8E1616]/10",
    iconColor: "text-[#8E1616]",
    label: "TOTAL ANGGOTA",
    value: "847",
    change: "+12.5%",
  },
  {
    icon: Wallet,
    iconBg: "bg-[#8E1616]/10",
    iconColor: "text-[#8E1616]",
    label: "PENDAPATAN (MTD)",
    value: "Rp 184,5 Jt",
    change: "+18.2%",
  },
  {
    icon: CalendarCheck,
    iconBg: "bg-[#8E1616]/10",
    iconColor: "text-[#8E1616]",
    label: "ANGGOTA AKTIF",
    value: "623",
    change: "+5.3%",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-[#8E1616]/10",
    iconColor: "text-[#8E1616]",
    label: "TINGKAT RETENSI",
    value: "86%",
    change: "+4.1%",
  },
];

const monthlyData = [
  { month: "Jan", members: 120, revenue: 85 },
  { month: "Feb", members: 135, revenue: 92 },
  { month: "Mar", members: 148, revenue: 105 },
  { month: "Apr", members: 162, revenue: 118 },
  { month: "Mei", members: 175, revenue: 132 },
  { month: "Jun", members: 189, revenue: 148 },
  { month: "Jul", members: 210, revenue: 165 },
  { month: "Agu", members: 235, revenue: 182 },
  { month: "Sep", members: 258, revenue: 198 },
  { month: "Okt", members: 275, revenue: 215 },
  { month: "Nov", members: 290, revenue: 230 },
  { month: "Des", members: 310, revenue: 250 },
];

const recentActivities = [
  {
    id: 1,
    member: "Alex Johnson",
    action: "Check-in",
    time: "2 menit lalu",
    avatar: "A",
    location: "Area Cardio",
  },
  {
    id: 2,
    member: "Sarah Williams",
    action: "Perpanjang keanggotaan",
    time: "15 menit lalu",
    avatar: "S",
    location: "-",
  },
  {
    id: 3,
    member: "Mike Chen",
    action: "Pendaftaran anggota baru",
    time: "1 jam lalu",
    avatar: "M",
    location: "-",
  },
  {
    id: 4,
    member: "Jessica Lee",
    action: "Upgrade ke Gold",
    time: "3 jam lalu",
    avatar: "J",
    location: "-",
  },
  {
    id: 5,
    member: "David Kim",
    action: "Check-in",
    time: "4 jam lalu",
    avatar: "D",
    location: "Area Angkat Beban",
  },
];

const AnimatedLineChart = ({ data, title, color = "#8E1616" }) => {
  const canvasRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  useEffect(() => {
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
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.clientWidth);
    const height = (canvas.height = canvas.clientHeight);
    ctx.clearRect(0, 0, width, height);
    if (!data || data.length === 0) return;
    const values = data.map((d) => d.members);
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue;
    const padding = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const stepX = chartWidth / (data.length - 1);
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
      ctx.fillText(value.toString(), 5, y + 3);
    }
    const animatedValues = values.map(
      (v) => minValue + (v - minValue) * animationProgress,
    );
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    animatedValues.forEach((value, index) => {
      const x = padding.left + index * stepX;
      const y =
        padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.lineTo(
      padding.left + (data.length - 1) * stepX,
      padding.top + chartHeight,
    );
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = `${color}20`;
    ctx.fill();
    animatedValues.forEach((value, index) => {
      const x = padding.left + index * stepX;
      const y =
        padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px Barlow";
    data.forEach((item, index) => {
      const x = padding.left + index * stepX - 10;
      const y = height - padding.bottom + 15;
      ctx.fillText(item.month, x, y);
    });
    ctx.fillStyle = "#1D1616";
    ctx.font = "bold 12px Barlow";
    ctx.fillText(title, padding.left, 15);
  }, [data, animationProgress, color]);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <canvas ref={canvasRef} className="w-full h-64" />
    </div>
  );
};

const AnimatedBarChart = ({ data, title, color = "#8E1616" }) => {
  const canvasRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  useEffect(() => {
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
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.clientWidth);
    const height = (canvas.height = canvas.clientHeight);
    ctx.clearRect(0, 0, width, height);
    if (!data || data.length === 0) return;
    const values = data.map((d) => d.revenue);
    const maxValue = Math.max(...values, 1);
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = (chartWidth / data.length) * 0.7;
    const barSpacing = (chartWidth / data.length) * 0.3;
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
      const value = Math.round(maxValue - (i / 4) * maxValue);
      ctx.fillText(value.toString(), 5, y + 3);
    }
    values.forEach((value, index) => {
      const animatedHeight =
        (value / maxValue) * chartHeight * animationProgress;
      const x = padding.left + index * (barWidth + barSpacing);
      const y = padding.top + chartHeight - animatedHeight;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, animatedHeight);
      if (animationProgress > 0.9) {
        ctx.fillStyle = color;
        ctx.font = "bold 10px Barlow";
        ctx.fillText(`Rp${value}J`, x + barWidth / 2 - 15, y - 5);
      }
    });
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px Barlow";
    data.forEach((item, index) => {
      const x =
        padding.left + index * (barWidth + barSpacing) + barWidth / 2 - 8;
      const y = height - padding.bottom + 15;
      ctx.fillText(item.month, x, y);
    });
    ctx.fillStyle = "#1D1616";
    ctx.font = "bold 12px Barlow";
    ctx.fillText(title, padding.left, 15);
  }, [data, animationProgress, color]);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <canvas ref={canvasRef} className="w-full h-64" />
    </div>
  );
};

const GoogleMap = () => {
  const [zoom, setZoom] = useState(17);
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 21));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 3));
  
  // Updated coordinates for Zeus Gym Rumbai
  // Based on Google Maps data: 0.5868, 101.4350 (area Rumbai, Pekanbaru)
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.123456789012!2d101.4330!3d0.5868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5abb3ffef3c55%3A0x310ecab0318e1b24!2sZeus%20Gym!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#8E1616]" />
          <h3 className="text-sm font-bold text-[#1D1616]">
            Lokasi Zeus Gym - Rumbai, Pekanbaru
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-[#8E1616]/10 hover:bg-[#8E1616]/20 transition-colors"
            title="Perbesar"
          >
            <Plus size={16} className="text-[#8E1616]" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-[#8E1616]/10 hover:bg-[#8E1616]/20 transition-colors"
            title="Perkecil"
          >
            <Minus size={16} className="text-[#8E1616]" />
          </button>
        </div>
      </div>
      <div className="relative h-[400px] w-full">
        <iframe
          title="Zeus Gym Rumbai Location"
          src={mapSrc}
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-[#1D1616]">
              Zeus Gym - Rumbai
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Rumbai, Pekanbaru, Riau
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
              🟢 Buka
            </span>
            <span className="text-[9px] text-gray-400">07:00 - 22:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-gradient-to-r from-[#8E1616]/10 to-[#D84040]/10 rounded-xl p-3 text-center border border-[#8E1616]/20">
      <p className="text-2xl font-bold text-[#8E1616]">
        {time.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {time.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
};

const Dashboard = () => {
  const [selectedChart, setSelectedChart] = useState("members");
  return (
    <div className="space-y-6">
      <PageHeader title="Beranda" breadcrumb={["Beranda", "Dashboard"]}>
        <button className="border border-[#8E1616]/30 text-[#8E1616] font-semibold px-4 py-2 rounded-xl hover:bg-[#8E1616]/10 transition-colors text-xs tracking-wide">
          STATUS LANGSUNG
        </button>
      </PageHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:shadow-[#8E1616]/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.iconBg} p-2.5 rounded-xl`}>
                  <Icon size={18} className={stat.iconColor} />
                </div>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase bg-gray-100 px-2 py-1 rounded-lg">
                  BULAN INI
                </span>
              </div>
              <p className="text-2xl font-black text-[#1D1616] leading-tight mb-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">
                {stat.label}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
                  {stat.change}
                </span>
                <span className="text-[10px] text-gray-400">
                  dibanding bulan lalu
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedChart("members")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedChart === "members" ? "bg-[#8E1616] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
        >
          📈 Pertumbuhan Anggota
        </button>
        <button
          onClick={() => setSelectedChart("revenue")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedChart === "revenue" ? "bg-[#8E1616] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
        >
          💰 Pendapatan Bulanan
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          {selectedChart === "members" ? (
            <AnimatedLineChart
              data={monthlyData}
              title="Pertumbuhan Anggota (2024)"
              color="#8E1616"
            />
          ) : (
            <AnimatedBarChart
              data={monthlyData}
              title="Pendapatan Bulanan (Juta Rp)"
              color="#8E1616"
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-[#1D1616] mb-4 flex items-center gap-2">
              <Dumbbell size={16} className="text-[#D84040]" /> Aktivitas
              Terbaru
            </h3>
            <div className="space-y-4 max-h-[280px] overflow-y-auto custom-scrollbar">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#8E1616]/20 flex items-center justify-center text-[#8E1616] font-bold text-xs">
                    {activity.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1D1616]">
                      {activity.member}
                    </p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                    {activity.location !== "-" && (
                      <p className="text-[10px] text-gray-400">
                        📍 {activity.location}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <GoogleMap />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <LiveClock />
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Check-in Hari Ini</p>
              <p className="text-2xl font-bold text-[#1D1616]">127</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400">Rata-rata per Jam</p>
              <p className="text-2xl font-bold text-[#1D1616]">16</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400">Jam Sibuk</p>
              <p className="text-2xl font-bold text-[#D84040]">18:00 - 20:00</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400">Tingkat Hunian</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-[#1D1616]">68%</p>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[68%] h-full bg-[#8E1616] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#8E1616] to-[#D84040] rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              📱 Pendaftaran Digital Sekarang Dibuka!
            </h3>
            <p className="text-white/80 mt-1">
              Daftar online dan dapatkan kode QR instan. Lewati antrian!
            </p>
          </div>
          <button className="bg-white text-[#8E1616] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
            Daftar Sekarang →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
