import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";

const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Members = React.lazy(() => import("./pages/Members"));
const Payments = React.lazy(() => import("./pages/Payments"));
const Attendance = React.lazy(() => import("./pages/Attendance"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Promotions = React.lazy(() => import("./pages/Promotions"));
const Feedback = React.lazy(() => import("./pages/Feedback"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const ErrorRouter = React.lazy(() => import("./pages/ErrorRouter"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Handler ketika loading selesai
  const handleLoadingFinish = () => {
    console.log("Loading selesai, menampilkan konten");
    setIsInitialLoading(false);
    // Delay kecil untuk memastikan state update
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  // Tampilkan loading screen saat pertama kali
  if (isInitialLoading) {
    return <Loading onFinish={handleLoadingFinish} />;
  }

  // Setelah loading selesai, tampilkan aplikasi
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1D1616]"></div>}>
      {showContent && (
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="payments" element={<Payments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="error/:code" element={<ErrorRouter />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
          </Route>
        </Routes>
      )}
    </Suspense>
  );
}

export default App;