import { lazy, Suspense } from "react";
import NavBar from "../components/landing/NavBar";
import HeroSection from "../components/landing/HeroSection";

// Lazy load below-the-fold sections for better initial load performance
const TrustedBySection = lazy(() => import("../components/landing/TrustedBySection"));
const ProblemSection = lazy(() => import("../components/landing/ProblemSection"));
const SolutionSection = lazy(() => import("../components/landing/SolutionSection"));
const HowItWorksSection = lazy(() => import("../components/landing/HowItWorksSection"));
const ResultsAndTrustSection = lazy(() => import("../components/landing/ResultsAndTrustSection"));
const PricingSection = lazy(() => import("../components/landing/PricingSection"));
const FoundersSection = lazy(() => import("../components/landing/FoundersSection"));
const FinalCTASection = lazy(() => import("../components/landing/FinalCTASection"));
// Footer component doesn't exist yet, will be added when needed

// Loading placeholder component
const SectionLoader = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-clarity-secondary border-t-transparent" />
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <NavBar />
      <main className="pt-20 md:pt-24">
        <HeroSection />
        <Suspense fallback={<SectionLoader />}>
          <TrustedBySection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ProblemSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <SolutionSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <HowItWorksSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ResultsAndTrustSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <FoundersSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <FinalCTASection />
        </Suspense>
      </main>
    </div>
  );
};

export default LandingPage;
