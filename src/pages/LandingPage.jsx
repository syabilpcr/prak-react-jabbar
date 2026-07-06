import { useEffect } from "react";
import Lenis from "lenis";
import LandingHero from "../components/member/sections/LandingHero";
import LandingAbout from "../components/member/sections/LandingAbout";
import LandingPromotions from "../components/member/sections/LandingPromotions";
import LandingPricing from "../components/member/sections/LandingPricing";
import LandingFAQ from "../components/member/sections/LandingFAQ";
import LandingFeedback from "../components/member/sections/LandingFeedback";
import LandingContact from "../components/member/sections/LandingContact";
import InfiniteGallery from "../components/ui/3d-gallery-photography";

// ── Foto fasilitas gym untuk 3D Gallery ─────────────────────────
const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&w=800&fit=crop&q=75", alt: "Free Weights Area" },
  { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&w=800&fit=crop&q=75", alt: "Functional Training Zone" },
  { src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&w=800&fit=crop&q=75", alt: "Dumbbell Rack" },
  { src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&w=800&fit=crop&q=75", alt: "Cardio Machines" },
  { src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&w=800&fit=crop&q=75", alt: "Gym Atmosphere" },
  { src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&w=800&fit=crop&q=75", alt: "Power Rack" },
  { src: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&w=800&fit=crop&q=75", alt: "Weight Training" },
  { src: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&w=800&fit=crop&q=75", alt: "Zeus Gym Interior" },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function LandingPage() {
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

      {/* ── 3D Gallery Section ── */}
      <section className="relative bg-[#0b0b0d] py-0">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center justify-center pt-16 pointer-events-none">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#D84040] font-black mb-3">
            Jelajahi Fasilitas
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight text-center leading-tight uppercase px-4">
            GALERI FASILITAS <span className="text-[#D84040]">PREMIUM</span>
          </h2>
          <p className="text-white/40 text-sm mt-3 text-center max-w-md px-4">
            Gunakan scroll mouse atau tombol panah untuk menjelajahi foto-foto fasilitas kami
          </p>
        </div>

        <InfiniteGallery
          images={GALLERY_IMAGES}
          speed={1.0}
          visibleCount={10}
          className="h-screen w-full"
          fadeSettings={{
            fadeIn: { start: 0.05, end: 0.25 },
            fadeOut: { start: 0.4, end: 0.43 },
          }}
          blurSettings={{
            blurIn: { start: 0.0, end: 0.1 },
            blurOut: { start: 0.4, end: 0.43 },
            maxBlur: 6.0,
          }}
        />

        {/* Footer hint */}
        <div className="absolute bottom-6 left-0 right-0 z-20 text-center pointer-events-none">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-bold">
            Auto-play · Scroll atau panah keyboard untuk navigasi
          </p>
        </div>
      </section>

      <LandingPromotions />
      <LandingPricing />
      <LandingFAQ />
      <LandingFeedback />

      {/* Area BOTTOM */}
      <LandingContact scrollTo={scrollTo} />
    </div>
  );
}
