import { useState } from "react";
import {
  Users,
  Wallet,
  CalendarCheck,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

// ── Components ────────────────────────────────────────────────
import StatCard from "../components/StatCard";
import SectionHeader from "../components/SectionHeader";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import MembershipPanel from "../components/MembershipPanel";
import ActivityFeed from "../components/ActivityFeed";
import LiveStats from "../components/LiveStats";
import GoogleMap from "../components/GoogleMap";
import AreaUsage from "../components/AreaUsage";
import TodayClasses from "../components/TodayClasses";

// ── Data ──────────────────────────────────────────────────────
import { monthlyData } from "../data/dashboardData";

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

const monthlyChartData = monthlyData;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("members");

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-black text-[#1D1616]">
          Dashboard Beranda
        </h1>
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-[12.5px] text-[#5a3030] font-medium hover:bg-gray-50 transition-colors">
          <span>📅</span> Jan 2026 – Mei 2026
          <ChevronDown size={13} className="text-[#9e7a6e]" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((s, i) => (
          <StatCard
            key={i}
            icon={s.icon}
            label={s.label}
            value={s.value}
            change={s.change}
            trend={s.trend}
            sub={s.sub}
          />
        ))}
      </div>

      <div className="flex gap-2">
        {["members", "revenue"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all
              ${activeTab === tab ? "bg-[#8C1007] text-[#FFF0C4]" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            {tab === "members" ? "Pertumbuhan Anggota" : "Pendapatan Bulanan"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <BarChart data={monthlyChartData} activeTab={activeTab} />
          <ActivityFeed />
        </div>
        <div className="space-y-5">
          <DonutChart />
          <MembershipPanel />
          <TodayClasses />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <GoogleMap />
        </div>
        <AreaUsage />
      </div>

      <LiveStats />
    </div>
  );
};

export default Dashboard;
