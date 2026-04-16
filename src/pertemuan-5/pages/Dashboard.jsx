import PageHeader from "../components/PageHeader";
import StatsWidget from "../components/StatsWidget"; // Improvisasi 2

const Dashboard = () => {
  return (
    <div className="p-6">
      <PageHeader title="Dashboard" subtitle="Selamat datang kembali!" />

      {/* Improvisasi 2: Stats Widget dengan animasi counter */}
      <StatsWidget />

      {/* Konten lainnya tetap di bawah */}
    </div>
  );
};

export default Dashboard;