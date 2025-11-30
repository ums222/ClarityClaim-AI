import NavBar from "../components/landing/NavBar";
import HeroSection from "../components/landing/HeroSection";
import TrustedBySection from "../components/landing/TrustedBySection";
import ProblemSection from "../components/landing/ProblemSection";
import SolutionSection from "../components/landing/SolutionSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ResultsAndTrustSection from "../components/landing/ResultsAndTrustSection";
import PricingSection from "../components/landing/PricingSection";
import FoundersSection from "../components/landing/FoundersSection";
import FinalCTASection from "../components/landing/FinalCTASection";
import Footer from "../components/landing/Footer";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const LandingPage = () => {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === "dark" ? "bg-neutral-950 text-neutral-50" : "bg-white text-neutral-900"
    )}>
      <NavBar />
      <main className="pt-20 md:pt-24">
        <HeroSection />
        <TrustedBySection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <ResultsAndTrustSection />
        <PricingSection />
                <FoundersSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
