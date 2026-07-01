import LandingHero from "../components/member/sections/LandingHero";
import LandingAbout from "../components/member/sections/LandingAbout";
import LandingServices from "../components/member/sections/LandingServices";
import LandingTrainers from "../components/member/sections/LandingTrainers";
import LandingFAQ from "../components/member/sections/LandingFAQ";
import LandingContact from "../components/member/sections/LandingContact";

// ── PRD v3 (Complete) ────────────────────────────────────────────
// Landing Page final, lengkap sesuai struktur AIDA di materi:
//   Area TOP    → Navbar + Hero                (Attention)
//   Area MIDDLE → About + Services + Trainers  (Interest)
//                 FAQ                          (Desire)
//   Area BOTTOM → CTA akhir + Footer           (Action)
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
      <LandingFAQ />

      {/* Area BOTTOM */}
      <LandingContact scrollTo={scrollTo} />
    </div>
  );
}
