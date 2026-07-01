import { useState, useEffect } from "react";
import { liveStatsItems } from "../data/dashboardData";

const LiveStats = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const items = liveStatsItems;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold text-[#1D1616]">
          Status Real-time
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-gray-400 font-semibold">LIVE</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#8C1007]/5 rounded-xl p-3 text-center border border-[#8C1007]/15">
          <p className="text-[18px] font-black text-[#8C1007]">
            {time.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <p className="text-[9px] text-gray-400 mt-1">
            {time.toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
        {items.map((item, i) => (
          <div key={i} className="border-l border-gray-100 pl-4">
            <p className="text-[10px] text-gray-400 mb-1">{item.label}</p>
            <p
              className={`text-xl font-black ${item.color || "text-[#1D1616]"}`}
            >
              {item.value}
            </p>
            {item.bar && (
              <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                <div
                  className="h-full bg-[#8C1007] rounded-full"
                  style={{ width: `${item.bar}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStats;
