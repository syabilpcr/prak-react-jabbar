import React from "react";
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ icon, label, value, change, trend = "up", sub }) {
  const isUp = trend === "up";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#8C1007]/10 flex items-center justify-center">
          {icon ? icon && React.createElement(icon, { size: 18, className: "text-[#8C1007]" }) : null}
        </div>
        <button className="text-gray-300" aria-hidden="true">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <p className="text-2xl font-black text-[#1D1616] tracking-tight leading-none mb-1">
        {value}
      </p>
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">
        {label}
      </p>
      {change && (
        <div className="flex items-center gap-1.5">
          <span
            className={`flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-md
              ${isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
          >
            {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {change}
          </span>
          {sub && <span className="text-[10px] text-gray-400">{sub}</span>}
        </div>
      )}
    </div>
  );
}