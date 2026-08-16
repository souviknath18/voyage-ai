import LandingCTA from "@/components/landing/LandingCTA";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingPlanner from "@/components/landing/LandingPlanner";
import LandingTrustBar from "@/components/landing/LandingTrustBar";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070B18] text-[#e6e0e8]">
      <LandingNavbar />

      <LandingHero />

      <LandingTrustBar />

      <LandingPlanner />

      <LandingHowItWorks />

      <LandingFeatures />

      <LandingCTA />

      <LandingFooter />
    </main>
  );
}