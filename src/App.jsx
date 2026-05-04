import React, { Suspense } from "react";
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
  return (
    <Suspense fallback={<Loading />}>
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
    </Suspense>
  );
}

export default App;
