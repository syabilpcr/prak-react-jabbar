import LandingHero from "../../components/member/sections/LandingHero";
import LandingAbout from "../../components/member/sections/LandingAbout";
import LandingServices from "../../components/member/sections/LandingServices";
import LandingPricing from "../../components/member/sections/LandingPricing";
import LandingFAQ from "../../components/member/sections/LandingFAQ";
import LandingContact from "../../components/member/sections/LandingContact";

// Smooth-scroll helper dipakai tombol CTA di beberapa section
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function MemberDashboard() {
  return (
    <div className="bg-[#0b0b0d]">
      <LandingHero scrollTo={scrollTo} />
      <LandingAbout />
      <LandingServices />
      <LandingPricing />
      <LandingFAQ />
      <LandingContact scrollTo={scrollTo} />
    </div>
  );
}
