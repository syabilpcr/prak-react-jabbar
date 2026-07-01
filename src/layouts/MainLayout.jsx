import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[#8E1616] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Memuat halaman...</p>
    </div>
  </div>
);

export default function MainLayout() {
  return (
    <div className="bg-[#EEEEEE] min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}