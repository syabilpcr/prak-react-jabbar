import { MoreHorizontal } from "lucide-react";
import { membershipData } from "../data/dashboardData";

const MembershipPanel = () => (
  <div className="bg-[#000000] rounded-2xl p-5">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[14px] font-bold text-[#F8EEDF]/90">
        Tipe Keanggotaan
      </span>
      <button className="text-[#F8EEDF]/30">
        <MoreHorizontal size={16} />
      </button>
    </div>
    <div className="grid grid-cols-2 gap-2.5">
      {membershipData.map((m) => (
        <div
          key={m.label}
          className="bg-[#E8C999]/10 border border-[#E8C999]/20 rounded-xl p-3"
          >
          <p className="text-[19px] font-black text-[#F8EEDF]">{m.value}</p>
          <p className="text-[9px] text-[#E8C999]/60 uppercase tracking-widest mt-0.5">
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
