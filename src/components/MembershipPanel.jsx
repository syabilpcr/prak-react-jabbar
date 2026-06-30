import { MoreHorizontal } from "lucide-react";
import { membershipData } from "../data/dashboardData";

const MembershipPanel = () => (
  <div className="bg-[#3E0703] rounded-2xl p-5">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[14px] font-bold text-[#FFF0C4]/90">
        Tipe Keanggotaan
      </span>
      <button className="text-[#FFF0C4]/30">
        <MoreHorizontal size={16} />
      </button>
    </div>
    <div className="grid grid-cols-2 gap-2.5">
      {membershipData.map((m) => (
        <div
          key={m.label}
          className="bg-[#FFF0C4]/8 border border-[#FFF0C4]/15 rounded-xl p-3"
        >
          <p className="text-[19px] font-black text-[#FFF0C4]">{m.value}</p>
          <p className="text-[9px] text-[#FFF0C4]/50 uppercase tracking-widest mt-0.5">
            {m.label}
          </p>
          <p className="text-[10.5px] text-green-300 font-bold mt-1.5">
            {m.change}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default MembershipPanel;
