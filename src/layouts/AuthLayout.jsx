import { Outlet } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#8E1616] rounded-xl flex items-center justify-center shadow-lg shadow-[#8E1616]/30">
            <Dumbbell size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-black">
            <span className="text-[#1D1616]">ZEUS</span>
            <span className="text-[#8E1616]">GYM</span>
          </h1>
        </div>
        <Outlet />
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 Zeus Gym Admin Dashboard. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
}
