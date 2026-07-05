import { useEffect } from "react";
import Lenis from "lenis";
import LandingHero from "../../components/member/sections/LandingHero";
import LandingAbout from "../../components/member/sections/LandingAbout";
import LandingPromotions from "../../components/member/sections/LandingPromotions";
import LandingPricing from "../../components/member/sections/LandingPricing";
import LandingFAQ from "../../components/member/sections/LandingFAQ";
import LandingFeedback from "../../components/member/sections/LandingFeedback";
import LandingContact from "../../components/member/sections/LandingContact";

// Smooth-scroll helper dipakai tombol CTA di beberapa section
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function MemberDashboard() {
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
    <div className="bg-[#0b0b0d] overflow-hidden">
      {/* 1. Hero with 3D Container Scroll */}
      <LandingHero scrollTo={scrollTo} />
      
      {/* 2. About section */}
      <LandingAbout />
      <LandingPromotions />

      {/* 4. Pricing / Membership Plans */}
      <LandingPricing />
      
      {/* 5. FAQ */}
      <LandingFAQ />

      {/* 6. Umpan Balik / Feedback */}
      <LandingFeedback />
      
      {/* 7. Footer contact info */}
      <LandingContact scrollTo={scrollTo} />
    </div>
  );
}
