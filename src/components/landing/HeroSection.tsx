import { memo, useMemo } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import AnimatedCounter from "../shared/AnimatedCounter";
import { Button } from "../ui/button";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
}

const stats: Stat[] = [
  { label: "Denial Rate Reduction", value: 35, suffix: "%" },
  { label: "Annual Industry Problem", value: 25.7, prefix: "$", suffix: "B", decimals: 1 },
  { label: "Appeal Success Rate", value: 87, suffix: "%" },
  { label: "Avg Appeal Generation", value: 2.3, suffix: "s", decimals: 1 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const floatAnimation = {
  y: [0, -8, 0],
  transition: { repeat: Infinity, duration: 6, ease: "easeInOut" },
};

const HeroSection = memo(() => {
  // Memoize the dashboard cards to prevent unnecessary re-renders
  const dashboardCards = useMemo(() => (
    <>
      {/* Dashboard card */}
      <m.div
        className="absolute left-4 top-6 w-64 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-glow-primary"
        animate={floatAnimation}
      >
        <p className="text-xs text-slate-400">Appeals Dashboard</p>
        <p className="mt-1 text-lg font-semibold text-slate-50">
          $2.3M recovered
        </p>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
          <div className="h-2 w-3/4 rounded-full bg-clarity-secondary" />
        </div>
        <div className="mt-3 flex justify-between text-[11px] text-slate-400">
          <span>Denials - 35%</span>
          <span>Appeals + 87%</span>
        </div>
      </m.div>

      {/* Success notification */}
      <m.div
        className="absolute right-4 top-20 w-56 rounded-2xl border border-clarity-success/40 bg-slate-900/95 p-3"
        animate={{ y: [-4, 6, -4] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      >
        <p className="text-xs font-medium text-clarity-success">
          Appeal Approved
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Claim #84521 recovered <span className="font-semibold">$42,870</span>
        </p>
      </m.div>

      {/* Denial alert */}
      <m.div
        className="absolute bottom-6 right-10 w-60 rounded-2xl border border-clarity-warning/40 bg-slate-900/95 p-3"
        animate={{ y: [6, -4, 6] }}
        transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
      >
        <p className="text-xs font-semibold text-clarity-warning">
          Denial Risk: High
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Prior auth missing. Suggested fix ready.
        </p>
      </m.div>
    </>
  ), []);

  return (
    <LazyMotion features={domAnimation} strict>
      <SectionContainer id="top" className="bg-hero-gradient">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* LEFT */}
          <m.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            <p className="inline-flex items-center rounded-full border border-clarity-secondary/40 bg-clarity-secondary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-clarity-secondary">
              AI-Powered Healthcare Claims Management
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-50">
              Stop Losing Revenue to Claim Denials
            </h1>
            <p className="mt-4 text-sm md:text-base text-slate-300">
              ClarityClaim AI uses advanced artificial intelligence to predict
              denials, optimize submissions, and generate winning appeals—
              recovering millions in lost revenue.
            </p>

            {/* Stats */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {stats.map((stat, i) => (
                <m.div
                  key={stat.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <div className="text-xl font-semibold text-clarity-accent">
                    <AnimatedCounter
                      to={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                </m.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" className="px-6">
                <span>Request Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="px-5">
                <Play className="h-4 w-4" />
                <span>Watch Video</span>
              </Button>
            </div>
          </m.div>

          {/* RIGHT: abstract UI cards */}
          <m.div
            className="relative h-[320px] md:h-[360px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-clarity-primary/40 via-slate-900 to-clarity-secondary/40 blur-3xl opacity-70" />
            <div className="relative h-full w-full">
              {dashboardCards}
            </div>
          </m.div>
        </div>
      </SectionContainer>
    </LazyMotion>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
