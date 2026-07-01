import { useState } from "react";
import PerfumeGuest from "./PerfumeGuest";
import PerfumeAdmin from "./perfumeadmin";

export default function PerfumeApp() {
  const [activeView, setActiveView] = useState("guest");

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-2">
            <span className="text-rose-600 text-lg">🌸</span>
            <span className="font-semibold text-gray-800 text-sm">
              Essence Perfume
            </span>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setActiveView("guest")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeView === "guest"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🛍️ Guest View
            </button>
            <button
              onClick={() => setActiveView("admin")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeView === "admin"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ⚙️ Admin View
            </button>
          </div>

          <div className="text-xs text-gray-400">Pertemuan 4</div>
        </div>
      </nav>

      {/* Content with top padding for fixed nav */}
      <div className="pt-12">
        {activeView === "guest" ? <PerfumeGuest /> : <PerfumeAdmin />}
      </div>
    </div>
  );
}
