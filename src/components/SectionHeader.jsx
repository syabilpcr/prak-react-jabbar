import { MoreHorizontal } from "lucide-react";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-[14px] font-bold text-[#1D1616]">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-[#9e7a6e] mt-0.5">{subtitle}</p>
        )}
      </div>
      {action !== undefined ? (
        action
      ) : (
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      )}
    </div>
  );
}