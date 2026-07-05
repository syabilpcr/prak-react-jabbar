import React, { Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";

// ── Layouts ───────────────────────────────────────────────────
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const MemberLayout = React.lazy(() => import("./layouts/MemberLayout"));
const LandingLayout = React.lazy(() => import("./layouts/LandingLayout"));

// ── Landing Page (publik, tanpa login) ──────────────────────────
const LandingPage = React.lazy(() => import("./pages/LandingPage"));

// ── Pages — Main ──────────────────────────────────────────────
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Members = React.lazy(() => import("./pages/Members"));
const Payments = React.lazy(() => import("./pages/Payments"));
const Attendance = React.lazy(() => import("./pages/Attendance"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Promotions = React.lazy(() => import("./pages/Promotions"));
const Feedback = React.lazy(() => import("./pages/Feedback"));
const ErrorRouter = React.lazy(() => import("./pages/ErrorRouter"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// ── Pertemuan 9: Dynamic Route — import MemberDetail ─────────
const MemberDetail = React.lazy(() => import("./pages/MemberDetail"));

// ── Pertemuan 10: Component Library ──────────────────────────
const Components = React.lazy(() => import("./pages/Components"));

// ── Pertemuan 11: Shadcn UI ───────────────────────────────────
const ShadcnUI = React.lazy(() => import("./pages/ShadcnUI"));

// ── Manajemen User (CRUD) ─────────────────────────────────────
const Users = React.lazy(() => import("./pages/Users"));

// ── Halaman Member (role: member) ─────────────────────────────
const MemberDashboard = React.lazy(() => import("./pages/member/MemberDashboard"));
const MemberClasses = React.lazy(() => import("./pages/member/MemberClasses"));
const MemberWorkouts = React.lazy(() => import("./pages/member/MemberWorkouts"));
const MemberProfile = React.lazy(() => import("./pages/member/MemberProfile"));

// ── Pages — Auth ──────────────────────────────────────────────
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  return (

    <Suspense fallback={<div className="min-h-screen bg-[#1D1616]" />}>
      {showContent && (

        <Routes>
          {/* ── LandingLayout: halaman publik (marketing) ── */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* ── MainLayout: Sidebar + Header ── */}
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="payments" element={<Payments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="error/:code" element={<ErrorRouter />} />

            {/*
              ── Pertemuan 9: Dynamic Route ──────────────────────
              /members/1  → MemberDetail dengan id = 1
              /members/5  → MemberDetail dengan id = 5
              Ambil nilai id dengan: const { id } = useParams()
            */}
            <Route path="members/:id" element={<MemberDetail />} />

            {/*
              ── Pertemuan 10: Component Library ─────────────────
              /components → halaman playground semua 15 component
            */}
            <Route path="components" element={<Components />} />

            <Route path="shadcn-ui" element={<ShadcnUI />} />

            {/* ── Manajemen User (CRUD) ── */}
            <Route path="users" element={<Users />} />

            

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ── MemberLayout: area khusus user dengan role "member" ── */}
          <Route element={<MemberLayout />}>
            <Route path="member" element={<MemberDashboard />} />
            <Route path="member/classes" element={<MemberClasses />} />
            <Route path="member/workouts" element={<MemberWorkouts />} />
            <Route path="member/profile" element={<MemberProfile />} />
          </Route>

          {/* ── AuthLayout ── */}
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
