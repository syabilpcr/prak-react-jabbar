import Badge from "./Badge";
import Avatar from "./Avatar";

const statusMap = {
  Active: "success",
  Expired: "danger",
  Expiring: "warning",
};

export default function MemberCard({
  name,
  code,
  status,
  email,
  trainer,
  visits,
  price,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#E8C999]/50 p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#1D1616] truncate">
            {name}
          </p>
          <p className="text-[10px] text-[#9e7a6e] font-mono">{code}</p>
        </div>
        <Badge type={statusMap[status] || "secondary"} dot>
          {status}
        </Badge>
      </div>
      <div className="text-[11px] text-[#9e7a6e] space-y-1 mb-3">
        <p>✉ {email}</p>
        <p>🏋️ {trainer}</p>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#f5f0eb]">
        <div className="text-left">
          <p className="text-[11px] font-bold text-[#1D1616]">
            Rp {price?.toLocaleString("id-ID")}
          </p>
          <p className="text-[9px] text-[#9e7a6e]">{visits}x kunjungan</p>
        </div>
      </div>
    </div>
  );
}
