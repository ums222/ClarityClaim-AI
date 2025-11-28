import { lazy, Suspense, memo } from "react";
import NavBar from "../components/landing/NavBar";
import HeroSection from "../components/landing/HeroSection";

// Lazy load below-the-fold sections for faster initial load
const TrustedBySection = lazy(() => import("../components/landing/TrustedBySection"));
const ProblemSection = lazy(() => import("../components/landing/ProblemSection"));
const SolutionSection = lazy(() => import("../components/landing/SolutionSection"));
const HowItWorksSection = lazy(() => import("../components/landing/HowItWorksSection"));
const ResultsAndTrustSection = lazy(() => import("../components/landing/ResultsAndTrustSection"));
const PricingSection = lazy(() => import("../components/landing/PricingSection"));
const FoundersSection = lazy(() => import("../components/landing/FoundersSection"));
const FinalCTASection = lazy(() => import("../components/landing/FinalCTASection"));
const Footer = lazy(() => import("../components/landing/Footer"));

// Lightweight skeleton for lazy-loaded sections
const SectionSkeleton = () => (
  <div className="flex min-h-[300px] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-clarity-secondary" />
  </div>
);

const LandingPage = memo(() => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <NavBar />
      <main className="pt-20 md:pt-24">
        {/* Hero loads immediately - above the fold */}
        <HeroSection />
        
        {/* Lazy load below-the-fold content */}
        <Suspense fallback={<SectionSkeleton />}>
          <TrustedBySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProblemSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <SolutionSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <HowItWorksSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ResultsAndTrustSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FoundersSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FinalCTASection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
});

LandingPage.displayName = "LandingPage";

export default LandingPage;
