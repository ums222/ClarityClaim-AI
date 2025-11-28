import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import NavBar from "../components/landing/NavBar";
import HeroSection from "../components/landing/HeroSection";
import LazySection from "../components/shared/LazySection";

const TrustedBySection = lazy(() => import("../components/landing/TrustedBySection"));
const ProblemSection = lazy(() => import("../components/landing/ProblemSection"));
const SolutionSection = lazy(() => import("../components/landing/SolutionSection"));
const HowItWorksSection = lazy(() => import("../components/landing/HowItWorksSection"));
const ResultsAndTrustSection = lazy(() => import("../components/landing/ResultsAndTrustSection"));
const PricingSection = lazy(() => import("../components/landing/PricingSection"));
const FoundersSection = lazy(() => import("../components/landing/FoundersSection"));
const FinalCTASection = lazy(() => import("../components/landing/FinalCTASection"));
const Footer = lazy(() => import("../components/landing/Footer"));

type SectionChunk = {
  Component: LazyExoticComponent<ComponentType<any>>;
  fallbackLabel: string;
  key: string;
  minHeight?: number;
};

const lazySections: SectionChunk[] = [
  { key: "trusted-by", Component: TrustedBySection, fallbackLabel: "Partner logos", minHeight: 180 },
  { key: "problem", Component: ProblemSection, fallbackLabel: "Denial problem overview", minHeight: 520 },
  { key: "solution", Component: SolutionSection, fallbackLabel: "Solution overview", minHeight: 620 },
  { key: "how-it-works", Component: HowItWorksSection, fallbackLabel: "Workflow timeline", minHeight: 640 },
  { key: "results", Component: ResultsAndTrustSection, fallbackLabel: "Results & testimonials", minHeight: 560 },
  { key: "pricing", Component: PricingSection, fallbackLabel: "Pricing & FAQ", minHeight: 760 },
  { key: "founders", Component: FoundersSection, fallbackLabel: "Founding team", minHeight: 480 },
  { key: "final-cta", Component: FinalCTASection, fallbackLabel: "Request demo", minHeight: 520 },
];

const footerFallback = (
  <div className="border-t border-slate-900 bg-slate-950 px-4 py-12">
    <div className="mx-auto h-32 w-full max-w-6xl animate-pulse rounded-2xl bg-slate-900/50" />
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <NavBar />
      <main className="pt-20 md:pt-24">
        <HeroSection />
        {lazySections.map(({ key, Component, fallbackLabel, minHeight }) => (
          <LazySection key={key} minHeight={minHeight}>
            <Suspense
              fallback={<SectionFallback label={fallbackLabel} minHeight={minHeight} />}
            >
              <Component />
            </Suspense>
          </LazySection>
        ))}
      </main>
      <Suspense fallback={footerFallback}>
        <Footer />
      </Suspense>
    </div>
  );
};

type SectionFallbackProps = {
  label: string;
  minHeight?: number;
};

const SectionFallback = ({ label, minHeight = 420 }: SectionFallbackProps) => (
  <div className="px-4 py-16 md:py-24">
    <div className="mx-auto w-full max-w-6xl">
      <div
        className="w-full animate-pulse rounded-3xl border border-slate-900/60 bg-slate-900/30"
        style={{ minHeight }}
      />
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
        {label}
      </p>
    </div>
  </div>
);

export default LandingPage;
