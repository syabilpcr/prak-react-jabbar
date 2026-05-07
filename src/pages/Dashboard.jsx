import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
  Users,
  Wallet,
  CalendarCheck,
  TrendingUp,
  Dumbbell,
  MapPin,
  Plus,
  Minus,
  Bell,
  MessageSquare,
  Search,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const statsData = [
  {
    icon: Users,
    label: "Total Anggota",
    value: "847",
    change: "+12.5%",
    trend: "up",
    sub: "dari bulan lalu",
  },
  {
    icon: Wallet,
    label: "Pendapatan MTD",
    value: "Rp 184,5 Jt",
    change: "+18.2%",
    trend: "up",
    sub: "dari bulan lalu",
  },
  {
    icon: CalendarCheck,
    label: "Anggota Aktif",
    value: "623",
    change: "+5.3%",
    trend: "up",
    sub: "dari bulan lalu",
  },
  {
    icon: TrendingUp,
    label: "Tingkat Retensi",
    value: "86%",
    change: "-2.1%",
    trend: "down",
    sub: "dari bulan lalu",
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
  { id: 1, member: "Alex Johnson", action: "Check-in", time: "2 menit lalu", avatar: "AJ", location: "Area Cardio", type: "checkin" },
  { id: 2, member: "Sarah Williams", action: "Perpanjang keanggotaan", time: "15 menit lalu", avatar: "SW", location: null, type: "renew" },
  { id: 3, member: "Mike Chen", action: "Pendaftaran anggota baru", time: "1 jam lalu", avatar: "MC", location: null, type: "new" },
  { id: 4, member: "Jessica Lee", action: "Upgrade ke Gold", time: "3 jam lalu", avatar: "JL", location: null, type: "upgrade" },
  { id: 5, member: "David Kim", action: "Check-in", time: "4 jam lalu", avatar: "DK", location: "Area Angkat Beban", type: "checkin" },
];

const membershipData = [
  { label: "Basic", value: 312, change: "+8.2%" },
  { label: "Silver", value: 298, change: "+12.4%" },
  { label: "Gold", value: 187, change: "+21.3%" },
  { label: "Platinum", value: 50, change: "+5.0%" },
];

const activityBadge = {
  checkin: { bg: "bg-[#fceaea]", text: "text-[#8C1007]", label: "Check-in" },
  renew: { bg: "bg-amber-50", text: "text-amber-700", label: "Perpanjang" },
  new: { bg: "bg-green-50", text: "text-green-700", label: "Baru" },
  upgrade: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Upgrade" },
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────

const Topbar = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-10">
      <span className="text-[15px] font-bold text-[#1D1616] flex-1">Ikhtisar Gym</span>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl px-3 py-2 w-52">
        <Search size={13} className="text-[#9e7a6e]" />
        <span className="text-xs text-[#c0a89e]">Cari anggota, laporan...</span>
      </div>

      {/* Icons */}
      <button className="w-9 h-9 rounded-xl bg-[#f8f3ee] border border-[#e8dfd6] flex items-center justify-center">
        <MessageSquare size={15} className="text-[#7a3a3a]" />
      </button>
      <button className="relative w-9 h-9 rounded-xl bg-[#f8f3ee] border border-[#e8dfd6] flex items-center justify-center">
        <Bell size={15} className="text-[#7a3a3a]" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8C1007] text-[#FFF0C4] text-[8px] font-bold rounded-full flex items-center justify-center">13</span>
      </button>

      {/* Admin */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#8C1007] flex items-center justify-center text-[#FFF0C4] text-xs font-bold">SY</div>
        <div>
          <p className="text-[12px] font-bold text-[#1D1616] leading-tight">Syabil Admin</p>
          <p className="text-[10px] text-[#9e7a6e]">Admin</p>
        </div>
        <ChevronDown size={13} className="text-[#9e7a6e]" />
      </div>
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  const isUp = stat.trend === "up";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-[#8C1007]/8 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#8C1007]/10 flex items-center justify-center">
          <Icon size={18} className="text-[#8C1007]" />
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <p className="text-2xl font-black text-[#1D1616] tracking-tight leading-none mb-1">{stat.value}</p>
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">{stat.label}</p>
      <div className="flex items-center gap-1.5">
        <span className={`flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-md
          ${isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {stat.change}
        </span>
        <span className="text-[10px] text-gray-400">{stat.sub}</span>
      </div>
    </div>
  );
};

// ─── BAR CHART ────────────────────────────────────────────────────────────────

const BarChart = ({ data, activeTab }) => {
  const [hovered, setHovered] = useState(null);
  const values = data.map((d) => activeTab === "members" ? d.members : d.revenue);
  const max = Math.max(...values);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold text-[#1D1616]">
          {activeTab === "members" ? "Pertumbuhan Anggota" : "Pendapatan Bulanan"}
        </span>
        <button className="text-gray-300"><MoreHorizontal size={16} /></button>
      </div>
      <div className="flex gap-1 items-end h-44 relative">
        {/* Y-axis hint */}
        <div className="flex flex-col justify-between h-full pr-2 text-right">
          {[max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0].map((v, i) => (
            <span key={i} className="text-[9px] text-gray-300 leading-none">{v}</span>
          ))}
        </div>
        {/* Bars */}
        {data.map((d, i) => {
          const val = activeTab === "members" ? d.members : d.revenue;
          const pct = (val / max) * 100;
          const isHovered = hovered === i;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full mb-1 bg-[#1D1616] text-[#FFF0C4] text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none"
                  style={{ transform: `translateX(0)` }}>
                  {d.month} · {val}{activeTab === "revenue" ? "Jt" : ""}
                </div>
              )}
              <div className="relative w-full flex items-end justify-center h-full">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${isHovered ? "bg-[#8C1007]" : "bg-[#8C1007]/20"}`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-400">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── DONUT CHART ──────────────────────────────────────────────────────────────

const DonutChart = () => {
  const total = 847;
  const segments = [
    { label: "Aktif", value: 623, color: "#8C1007" },
    { label: "Baru", value: 112, color: "#c8a020" },
    { label: "Non-aktif", value: 112, color: "#3E0703" },
  ];

  const r = 46;
  const cx = 60;
  const cy = 60;
  const circ = 2 * Math.PI * r;

  let cumulative = 0;
  const slices = segments.map((s) => {
    const pct = s.value / total;
    const dash = pct * circ;
    const offset = -cumulative * circ;
    cumulative += pct;
    return { ...s, dash, offset };
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-bold text-[#1D1616]">Info Keanggotaan</span>
        <button className="text-gray-300"><MoreHorizontal size={16} /></button>
      </div>
      <div className="flex justify-center my-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {slices.map((s, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${s.dash} ${circ - s.dash}`}
              strokeDashoffset={s.offset}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
            />
          ))}
          <text x="60" y="56" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1D1616" fontFamily="inherit">{total}</text>
          <text x="60" y="70" textAnchor="middle" fontSize="8.5" fill="#9e7a6e" fontFamily="inherit">Total Anggota</text>
        </svg>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-[12px] text-[#5a3030] flex-1">{s.label}</span>
            <span className="text-[12px] font-bold text-[#1D1616]">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MEMBERSHIP TYPE ──────────────────────────────────────────────────────────

const MembershipPanel = () => (
  <div className="bg-[#3E0703] rounded-2xl p-5">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[14px] font-bold text-[#FFF0C4]/90">Tipe Keanggotaan</span>
      <button className="text-[#FFF0C4]/30"><MoreHorizontal size={16} /></button>
    </div>
    <div className="grid grid-cols-2 gap-2.5">
      {membershipData.map((m) => (
        <div key={m.label} className="bg-[#FFF0C4]/8 border border-[#FFF0C4]/15 rounded-xl p-3">
          <p className="text-[19px] font-black text-[#FFF0C4]">{m.value}</p>
          <p className="text-[9px] text-[#FFF0C4]/50 uppercase tracking-widest mt-0.5">{m.label}</p>
          <p className="text-[10.5px] text-green-300 font-bold mt-1.5">{m.change}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────

const ActivityFeed = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[14px] font-bold text-[#1D1616]">Aktivitas Terbaru</span>
      <button className="text-gray-300"><MoreHorizontal size={16} /></button>
    </div>
    <div className="space-y-2.5">
      {recentActivities.map((a) => {
        const badge = activityBadge[a.type];
        return (
          <div key={a.id} className="flex items-center gap-3 bg-[#faf6f4] rounded-xl px-3 py-2.5 border border-[#f0e8e4]">
            <div className="w-9 h-9 rounded-full bg-[#8C1007] flex items-center justify-center text-[#FFF0C4] text-xs font-bold flex-shrink-0">
              {a.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-bold text-[#1D1616] truncate">{a.member}</p>
              <p className="text-[10.5px] text-[#9e7a6e]">{a.action}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`inline-flex items-center text-[9.5px] font-bold px-2 py-0.5 rounded-md ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
              <p className="text-[9.5px] text-gray-400 mt-1">{a.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── LIVE STATS BAR ───────────────────────────────────────────────────────────

const LiveStats = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const items = [
    { label: "Check-in Hari Ini", value: "127", color: "text-[#1D1616]" },
    { label: "Rata-rata / Jam", value: "16", color: "text-[#1D1616]" },
    { label: "Jam Sibuk", value: "18:00 - 20:00", color: "text-[#8C1007]" },
    { label: "Tingkat Hunian", value: "68%", color: "text-[#1D1616]", bar: 68 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold text-[#1D1616]">Status Real-time</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-gray-400 font-semibold">LIVE</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {/* Clock */}
        <div className="bg-[#8C1007]/5 rounded-xl p-3 text-center border border-[#8C1007]/15">
          <p className="text-[18px] font-black text-[#8C1007]">
            {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
          <p className="text-[9px] text-gray-400 mt-1">
            {time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
          </p>
        </div>
        {/* Stats */}
        {items.map((item, i) => (
          <div key={i} className="border-l border-gray-100 pl-4">
            <p className="text-[10px] text-gray-400 mb-1">{item.label}</p>
            <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
            {item.bar && (
              <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                <div className="h-full bg-[#8C1007] rounded-full" style={{ width: `${item.bar}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAP ──────────────────────────────────────────────────────────────────────

const GoogleMap = () => {
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.123456789012!2d101.4330!3d0.5868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5abb3ffef3c55%3A0x310ecab0318e1b24!2sZeus%20Gym!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-[#8C1007]" />
          <span className="text-[13px] font-bold text-[#1D1616]">Lokasi Zeus Gym — Rumbai, Pekanbaru</span>
        </div>
        <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">🟢 Buka 07:00 - 22:00</span>
      </div>
      <div className="relative h-72">
        <iframe
          title="Zeus Gym Location"
          src={mapSrc}
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
};

// ─── AREA USAGE ───────────────────────────────────────────────────────────────

const AreaUsage = () => {
  const areas = [
    { label: "Area Cardio", pct: 78 },
    { label: "Angkat Beban", pct: 64 },
    { label: "Area Yoga", pct: 45 },
    { label: "Kolam Renang", pct: 32 },
    { label: "Ruang Kelas", pct: 55 },
  ];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold text-[#1D1616]">Penggunaan Area</span>
        <button className="text-gray-300"><MoreHorizontal size={16} /></button>
      </div>
      <div className="space-y-3">
        {areas.map((a) => (
          <div key={a.label} className="flex items-center gap-3">
            <span className="text-[12px] text-[#1D1616] w-28 flex-shrink-0">{a.label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${a.pct}%`, background: `#8C1007` }}
              />
            </div>
            <span className="text-[11px] font-bold text-[#1D1616] w-8 text-right">{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TODAY CLASSES ────────────────────────────────────────────────────────────

const TodayClasses = () => {
  const classes = [
    { name: "Yoga Pagi", time: "06:00 – 07:00", participants: 18, max: 18, icon: "🧘" },
    { name: "Strength Training", time: "09:00 – 10:30", participants: 12, max: 18, icon: "🏋️" },
    { name: "Cardio Blast", time: "16:00 – 17:00", participants: 8, max: 18, icon: "🏃" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold text-[#1D1616]">Kelas Hari Ini</span>
        <button className="text-gray-300"><MoreHorizontal size={16} /></button>
      </div>
      <div className="space-y-2.5">
        {classes.map((c) => {
          const isFull = c.participants >= c.max;
          return (
            <div key={c.name} className="flex items-center gap-3 bg-[#faf6f4] rounded-xl px-3 py-2.5 border border-[#f0e8e4]">
              <div className="w-9 h-9 rounded-xl bg-[#8C1007]/8 flex items-center justify-center text-base flex-shrink-0">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-bold text-[#1D1616]">{c.name}</p>
                <p className="text-[10px] text-[#9e7a6e]">{c.time} · {c.participants} peserta</p>
              </div>
              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md
                ${isFull ? "bg-green-50 text-green-700" : "bg-[#fceaea] text-[#8C1007]"}`}>
                {isFull ? "Penuh" : `${c.max - c.participants} slot`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("members");

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f0eb]">
      <Topbar />

      <div className="p-6 space-y-5">
        {/* Page title + date */}
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-black text-[#1D1616]">Dashboard Beranda</h1>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-[12.5px] text-[#5a3030] font-medium hover:bg-gray-50 transition-colors">
            <span>📅</span>
            Jan 2026 – Mei 2026
            <ChevronDown size={13} className="text-[#9e7a6e]" />
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((s, i) => <StatCard key={i} stat={s} />)}
        </div>

        {/* Chart Tabs */}
        <div className="flex gap-2">
          {["members", "revenue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all
                ${activeTab === tab
                  ? "bg-[#8C1007] text-[#FFF0C4]"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              {tab === "members" ? "Pertumbuhan Anggota" : "Pendapatan Bulanan"}
            </button>
          ))}
        </div>

        {/* Main content grid — Chart + Right column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Chart + Activity */}
          <div className="lg:col-span-2 space-y-5">
            <BarChart data={monthlyData} activeTab={activeTab} />
            <ActivityFeed />
          </div>

          {/* Right: Donut + Membership + Classes */}
          <div className="space-y-5">
            <DonutChart />
            <MembershipPanel />
            <TodayClasses />
          </div>
        </div>

        {/* Area Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <GoogleMap />
          </div>
          <AreaUsage />
        </div>

        {/* Live Stats */}
        <LiveStats />
      </div>
    </div>
  );
};

export default Dashboard;
