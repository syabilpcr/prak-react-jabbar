import SectionHeader from "./SectionHeader";
import Badge from "./Badge";
import { todayClasses } from "../data/dashboardData";

const TodayClasses = () => {
  const classes = todayClasses;
  return (
    <div className="bg-white rounded-2xl border border-[#E8C999]/50 p-5">
      <SectionHeader title="Kelas Hari Ini" />
      <div className="space-y-2.5">
        {classes.map((c) => {
          const isFull = c.participants >= c.max;
          return (
            <div
              key={c.name}
              className="flex items-center gap-3 bg-[#faf6f4] rounded-xl px-3 py-2.5 border border-[#f0e8e4]"
            >
              <div className="w-9 h-9 rounded-xl bg-[#8C1007]/8 flex items-center justify-center text-base flex-shrink-0">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-bold text-[#1D1616]">
                  {c.name}
                </p>
                <p className="text-[10px] text-[#9e7a6e]">
                  {c.time} · {c.participants} peserta
                </p>
              </div>
              <Badge type={isFull ? "success" : "primary"}>
                {isFull ? "Penuh" : `${c.max - c.participants} slot`}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayClasses;
