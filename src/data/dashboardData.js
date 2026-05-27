export const statsData = [
  {
    icon: "Users",
    label: "Total Anggota",
    value: "847",
    change: "+12.5%",
    trend: "up",
    sub: "dari bulan lalu",
  },
  {
    icon: "Wallet",
    label: "Pendapatan MTD",
    value: "Rp 184,5 Jt",
    change: "+18.2%",
    trend: "up",
    sub: "dari bulan lalu",
  },
  {
    icon: "CalendarCheck",
    label: "Anggota Aktif",
    value: "623",
    change: "+5.3%",
    trend: "up",
    sub: "dari bulan lalu",
  },
  {
    icon: "TrendingUp",
    label: "Tingkat Retensi",
    value: "86%",
    change: "-2.1%",
    trend: "down",
    sub: "dari bulan lalu",
  },
];

export const monthlyData = [
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

export const recentActivities = [
  {
    id: 1,
    member: "Alex Johnson",
    action: "Check-in",
    time: "2 menit lalu",
    avatar: "AJ",
    type: "checkin",
  },
  {
    id: 2,
    member: "Sarah Williams",
    action: "Perpanjang keanggotaan",
    time: "15 menit lalu",
    avatar: "SW",
    type: "renew",
  },
  {
    id: 3,
    member: "Mike Chen",
    action: "Pendaftaran anggota baru",
    time: "1 jam lalu",
    avatar: "MC",
    type: "new",
  },
  {
    id: 4,
    member: "Jessica Lee",
    action: "Upgrade ke Gold",
    time: "3 jam lalu",
    avatar: "JL",
    type: "upgrade",
  },
  {
    id: 5,
    member: "David Kim",
    action: "Check-in",
    time: "4 jam lalu",
    avatar: "DK",
    type: "checkin",
  },
];

export const membershipData = [
  { label: "Basic", value: 312, change: "+8.2%" },
  { label: "Silver", value: 298, change: "+12.4%" },
  { label: "Gold", value: 187, change: "+21.3%" },
  { label: "Platinum", value: 50, change: "+5.0%" },
];

export const todayClasses = [
  {
    name: "Yoga Pagi",
    time: "06:00 – 07:00",
    participants: 18,
    max: 18,
    icon: "🧘",
  },
  {
    name: "Strength Training",
    time: "09:00 – 10:30",
    participants: 12,
    max: 18,
    icon: "🏋️",
  },
  {
    name: "Cardio Blast",
    time: "16:00 – 17:00",
    participants: 8,
    max: 18,
    icon: "🏃",
  },
];

export const areaUsageData = [
  { label: "Area Cardio", pct: 78 },
  { label: "Angkat Beban", pct: 64 },
  { label: "Area Yoga", pct: 45 },
  { label: "Kolam Renang", pct: 32 },
  { label: "Ruang Kelas", pct: 55 },
];

export const liveStatsItems = [
  { label: "Check-in Hari Ini", value: "127" },
  { label: "Rata-rata / Jam", value: "16" },
  { label: "Jam Sibuk", value: "18:00 - 20:00", color: "text-[#8C1007]" },
  { label: "Tingkat Hunian", value: "68%", bar: 68 },
];

export const donutSegments = [
  { label: "Aktif", value: 623, color: "#8C1007" },
  { label: "Baru", value: 112, color: "#c8a020" },
  { label: "Non-aktif", value: 112, color: "#3E0703" },
];
