import { useState } from "react";
import SectionHeader from "./SectionHeader";

const BarChart = ({ data, activeTab }) => {
  const [hovered, setHovered] = useState(null);
  const values = data.map((d) =>
    activeTab === "members" ? d.members : d.revenue,
  );
  const max = Math.max(...values);
  return (
    <div className="bg-white rounded-2xl border border-[#E8C999]/50 p-5">
      <SectionHeader
        title={
          activeTab === "members" ? "Pertumbuhan Anggota" : "Pendapatan Bulanan"
        }
      />
      <div className="flex gap-1 items-end h-44 relative">
        <div className="flex flex-col justify-between h-full pr-2 text-right">
          {[
            max,
            Math.round(max * 0.75),
            Math.round(max * 0.5),
            Math.round(max * 0.25),
            0,
          ].map((v, i) => (
            <span key={i} className="text-[9px] text-gray-300 leading-none">
              {v}
            </span>
          ))}
        </div>
        {data.map((d, i) => {
          const val = activeTab === "members" ? d.members : d.revenue;
          const pct = (val / max) * 100;
          const isHovered = hovered === i;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered && (
                <div className="absolute bottom-full mb-1 bg-[#000000] text-[#F8EEDF] text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                  {d.month} · {val}
                  {activeTab === "revenue" ? "Jt" : ""}
                </div>
              )}
              <div className="relative w-full flex items-end justify-center h-full">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${isHovered ? "bg-[#8E1616]" : "bg-[#8E1616]/25"}`}
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

export default BarChart;
