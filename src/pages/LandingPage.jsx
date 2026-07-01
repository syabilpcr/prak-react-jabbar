import LandingHero from "../components/member/sections/LandingHero";
import LandingContact from "../components/member/sections/LandingContact";

// ── PRD v1 (Basic) ──────────────────────────────────────────────
// Scope awal: kerangka Area TOP (Navbar + Hero) dan Area BOTTOM
// (CTA akhir + Footer) saja. Area MIDDLE (fitur, trust, FAQ)
// menyusul di PRD v2 & v3.
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function LandingPage() {
  return (
    <div className="bg-[#1D1616]">
      {/* Area TOP */}
      <LandingHero scrollTo={scrollTo} />

      {/* Area BOTTOM */}
      <LandingContact scrollTo={scrollTo} />
    </div>
  );
}
