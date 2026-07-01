import LandingHero from "../components/member/sections/LandingHero";
import LandingAbout from "../components/member/sections/LandingAbout";
import LandingServices from "../components/member/sections/LandingServices";
import LandingTrainers from "../components/member/sections/LandingTrainers";
import LandingContact from "../components/member/sections/LandingContact";

// ── PRD v2 (Improved) ────────────────────────────────────────────
// Tambahan dari v1: Area MIDDLE mulai diisi — About (problem/solution
// & trust lewat statistik), Services (feature section, 1 card = 1 ide),
// Trainers (bukti sosial). FAQ menyusul di PRD v3.
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function LandingPage() {
  return (
    <div className="bg-[#1D1616]">
      {/* Area TOP */}
      <LandingHero scrollTo={scrollTo} />

      {/* Area MIDDLE */}
      <LandingAbout />
      <LandingServices />
      <LandingTrainers />

      {/* Area BOTTOM */}
      <LandingContact scrollTo={scrollTo} />
    </div>
  );
}
