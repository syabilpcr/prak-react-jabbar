export default function Card({ children, className = "", title, subtitle, action }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E8C999]/50 overflow-hidden
        hover:shadow-md transition-all duration-200 ${className}`}
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      {(title || action) && (
        <div className="px-5 py-4 border-b border-[#E8C999]/40 flex items-center justify-between">
          <div>
            {title && (
              <p className="text-[13.5px] font-bold text-[#1D1616]">{title}</p>
            )}
            {subtitle && (
              <p className="text-[11px] text-[#9e7a6e] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}