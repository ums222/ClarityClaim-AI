import NavBar from "../components/landing/NavBar";
import HeroSection from "../components/landing/HeroSection";
import TrustedBySection from "../components/landing/TrustedBySection";
import ProblemSection from "../components/landing/ProblemSection";
import SolutionSection from "../components/landing/SolutionSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ResultsAndTrustSection from "../components/landing/ResultsAndTrustSection";
import PricingSection from "../components/landing/PricingSection";
import FinalCTASection from "../components/landing/FinalCTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <NavBar />
      <main className="pt-20 md:pt-24">
        <HeroSection />
        <TrustedBySection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <ResultsAndTrustSection />
        <PricingSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
