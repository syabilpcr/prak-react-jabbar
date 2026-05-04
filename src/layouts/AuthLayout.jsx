import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://i.pinimg.com/736x/44/50/3e/44503e86283e004593b1825744918221.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D1616]/80 to-[#8E1616]/70"></div>
      <div className="relative z-10 w-full max-w-5xl">
        <Outlet />
      </div>
    </div>
  );
}