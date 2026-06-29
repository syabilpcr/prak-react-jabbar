import SectionHeader from "./SectionHeader";
import ProgressBar from "./ProgressBar";
import { areaUsageData } from "../data/dashboardData";

const AreaUsage = () => {
  const areas = areaUsageData;
  return (
    <div className="bg-white rounded-2xl border border-[#E8C999]/50 p-5">
      <SectionHeader title="Penggunaan Area" />
      <div className="space-y-3">
        {areas.map((a) => (
          <ProgressBar key={a.label} label={a.label} value={a.pct} max={100} />
        ))}
      </div>
    </div>
  );
};

export default AreaUsage;
