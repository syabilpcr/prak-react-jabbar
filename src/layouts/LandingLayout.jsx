import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/landing/PublicNavbar";

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#1D1616]">
    <div className="w-10 h-10 border-2 border-white/20 border-t-[#D84040] rounded-full animate-spin" />
  </div>
);

// Layout khusus halaman publik (Landing Page) — TANPA proteksi login,
// beda dengan MainLayout (dashboard admin) & MemberLayout (area member).
export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-[#1D1616]">
      <PublicNavbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
