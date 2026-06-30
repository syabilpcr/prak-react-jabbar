import SectionHeader from "./SectionHeader";
import Avatar from "./Avatar";
import Badge from "./Badge";
import { recentActivities } from "../data/dashboardData";

const activityBadge = {
  checkin: { bg: "bg-[#fceaea]", text: "text-[#8C1007]", label: "Check-in" },
  renew: { bg: "bg-amber-50", text: "text-amber-700", label: "Perpanjang" },
  new: { bg: "bg-green-50", text: "text-green-700", label: "Baru" },
  upgrade: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Upgrade" },
};

const ActivityFeed = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <SectionHeader title="Aktivitas Terbaru" />
    <div className="space-y-2.5">
      {recentActivities.map((a) => {
        const badge = activityBadge[a.type];
        return (
          <div
            key={a.id}
            className="flex items-center gap-3 bg-[#faf6f4] rounded-xl px-3 py-2.5 border border-[#f0e8e4]"
          >
            <Avatar name={a.member} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-bold text-[#1D1616] truncate">
                {a.member}
              </p>
              <p className="text-[10.5px] text-[#9e7a6e]">{a.action}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <Badge
                type={
                  a.type === "checkin"
                    ? "primary"
                    : a.type === "new"
                      ? "success"
                      : a.type === "upgrade"
                        ? "warning"
                        : "secondary"
                }
              >
                {badge.label}
              </Badge>
              <p className="text-[9.5px] text-gray-400 mt-1">{a.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ActivityFeed;
