import { useEffect } from "react";
import Lenis from "lenis";
import LandingHero from "../components/member/sections/LandingHero";
import LandingAbout from "../components/member/sections/LandingAbout";
import LandingPromotions from "../components/member/sections/LandingPromotions";
import LandingPricing from "../components/member/sections/LandingPricing";
import LandingFAQ from "../components/member/sections/LandingFAQ";
import LandingFeedback from "../components/member/sections/LandingFeedback";
import LandingContact from "../components/member/sections/LandingContact";

// ── PRD v3 (Complete) ────────────────────────────────────────────
// Landing Page final, lengkap sesuai struktur AIDA di materi:
//   Area TOP    → Navbar + Hero                (Attention)
//   Area MIDDLE → About + Services + Pricing   (Interest)
//                 FAQ                          (Desire)
//   Area BOTTOM → CTA akhir + Footer           (Action)
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function LandingPage() {
  // Initialize Lenis smooth scroll on mount
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#1D1616] overflow-hidden">
      {/* Area TOP */}
      <LandingHero scrollTo={scrollTo} />

      {/* Area MIDDLE */}
      <LandingAbout />
      <LandingPromotions />

      <LandingPricing />
      <LandingFAQ />
      <LandingFeedback />

      {/* Area BOTTOM */}
      <LandingContact scrollTo={scrollTo} />
    </div>
  );
}
