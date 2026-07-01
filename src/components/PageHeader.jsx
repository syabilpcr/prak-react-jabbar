import { Home, ChevronRight } from "lucide-react";

const PageHeader = ({ title, breadcrumb, children }) => {
  const renderBreadcrumb = () => {
    if (!breadcrumb) return null;
    const crumbs = typeof breadcrumb === "string" ? [breadcrumb] : breadcrumb;
    return (
      <div className="flex items-center gap-1.5 text-xs mt-1.5">
        <Home size={11} className="text-[#8E1616]" />
        <span className="text-[#8E1616] font-semibold">Beranda</span>
        {crumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-1.5">
            <ChevronRight size={11} className="text-gray-400" />
            <span
              className={
                index === crumbs.length - 1
                  ? "text-gray-500 font-semibold"
                  : "text-[#8E1616] font-semibold cursor-pointer hover:underline"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="relative bg-white rounded-2xl mb-6 overflow-hidden border border-gray-200 shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8E1616] via-[#D84040] to-[#8E1616]" />
      <div className="px-7 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1D1616] tracking-tight leading-tight">
            {title}
          </h1>
          {renderBreadcrumb()}
        </div>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </div>
  );
};

export default PageHeader;
