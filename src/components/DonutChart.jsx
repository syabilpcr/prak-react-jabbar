import SectionHeader from "./SectionHeader";
import { donutSegments } from "../data/dashboardData";

const DonutChart = () => {
  const total = 847;
  const segments = donutSegments;
  const r = 46,
    cx = 60,
    cy = 60,
    circ = 2 * Math.PI * r;
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
      <SectionHeader title="Info Keanggotaan" />
      <div className="flex justify-center my-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {slices.map((s, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${s.dash} ${circ - s.dash}`}
              strokeDashoffset={s.offset}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "60px 60px",
              }}
            />
          ))}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            fontSize="17"
            fontWeight="800"
            fill="#1D1616"
            fontFamily="inherit"
          >
            {total}
          </text>
          <text
            x="60"
            y="70"
            textAnchor="middle"
            fontSize="8.5"
            fill="#9e7a6e"
            fontFamily="inherit"
          >
            Total Anggota
          </text>
        </svg>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-[12px] text-[#5a3030] flex-1">{s.label}</span>
            <span className="text-[12px] font-bold text-[#1D1616]">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
