import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import AnimatedCounter from "../shared/AnimatedCounter";
import { Button } from "../ui/button";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";

const stats = [
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

const HeroSection = () => {
  const { theme } = useTheme();

  // Hero Section with AI/Healthcare neural network background pattern
  // Background: /backgrounds/hero-pattern.svg - represents data flow and AI processing
  return (
    <SectionContainer 
      id="top" 
      className={cn(
        "hero-bg-pattern",
        theme === "dark" ? "bg-hero-gradient" : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
      )}
    >
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        {/* LEFT */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
        >
          <p className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]",
            theme === "dark" 
              ? "border-clarity-secondary/40 bg-clarity-secondary/10 text-clarity-secondary"
              : "border-teal-500/40 bg-teal-500/10 text-teal-600"
          )}>
            AI-Powered Healthcare Claims Management
          </p>
          <h1 className={cn(
            "mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
            theme === "dark" ? "text-slate-50" : "text-slate-900"
          )}>
            Stop Losing Revenue to Claim Denials
          </h1>
          <p className={cn(
            "mt-4 text-sm md:text-base",
            theme === "dark" ? "text-slate-300" : "text-slate-600"
          )}>
            ClarityClaim AI uses advanced artificial intelligence to predict
            denials, optimize submissions, and generate winning appeals—
            recovering millions in lost revenue.
          </p>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                className={cn(
                  "rounded-2xl border px-4 py-3",
                  theme === "dark" 
                    ? "border-slate-800 bg-slate-900/60" 
                    : "border-slate-200 bg-white/80 shadow-sm"
                )}
              >
                <div className="text-xl font-semibold text-clarity-accent">
                  <AnimatedCounter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <p className={cn(
                  "mt-1 text-xs",
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                )}>{stat.label}</p>
              </motion.div>
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
        </motion.div>

        {/* RIGHT: abstract UI cards */}
        <motion.div
          className="relative h-[320px] md:h-[360px]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className={cn(
            "pointer-events-none absolute inset-0 rounded-[2rem] blur-3xl opacity-70",
            theme === "dark" 
              ? "bg-gradient-to-br from-clarity-primary/40 via-slate-900 to-clarity-secondary/40"
              : "bg-gradient-to-br from-teal-200/40 via-white to-blue-200/40"
          )} />
          <div className="relative h-full w-full">
            {/* Dashboard card */}
            <motion.div
              className={cn(
                "absolute left-4 top-6 w-64 rounded-2xl border p-4",
                theme === "dark" 
                  ? "border-slate-800 bg-slate-900/90 shadow-glow-primary"
                  : "border-slate-200 bg-white shadow-lg"
              )}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <p className={cn("text-xs", theme === "dark" ? "text-slate-400" : "text-slate-500")}>Appeals Dashboard</p>
              <p className={cn("mt-1 text-lg font-semibold", theme === "dark" ? "text-slate-50" : "text-slate-900")}>
                $2.3M recovered
              </p>
              <div className={cn("mt-3 h-2 w-full rounded-full", theme === "dark" ? "bg-slate-800" : "bg-slate-200")}>
                <div className="h-2 w-3/4 rounded-full bg-clarity-secondary" />
              </div>
              <div className={cn("mt-3 flex justify-between text-[11px]", theme === "dark" ? "text-slate-400" : "text-slate-500")}>
                <span>Denials - 35%</span>
                <span>Appeals + 87%</span>
              </div>
            </motion.div>

            {/* Success notification */}
            <motion.div
              className={cn(
                "absolute right-4 top-20 w-56 rounded-2xl border p-3",
                theme === "dark" 
                  ? "border-clarity-success/40 bg-slate-900/95"
                  : "border-green-200 bg-white shadow-md"
              )}
              animate={{ y: [-4, 6, -4] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            >
              <p className="text-xs font-medium text-clarity-success">
                Appeal Approved
              </p>
              <p className={cn("mt-1 text-xs", theme === "dark" ? "text-slate-300" : "text-slate-600")}>
                Claim #84521 recovered <span className="font-semibold">$42,870</span>
              </p>
            </motion.div>

            {/* Denial alert */}
            <motion.div
              className={cn(
                "absolute bottom-6 right-10 w-60 rounded-2xl border p-3",
                theme === "dark" 
                  ? "border-clarity-warning/40 bg-slate-900/95"
                  : "border-amber-200 bg-white shadow-md"
              )}
              animate={{ y: [6, -4, 6] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
            >
              <p className="text-xs font-semibold text-clarity-warning">
                Denial Risk: High
              </p>
              <p className={cn("mt-1 text-xs", theme === "dark" ? "text-slate-300" : "text-slate-600")}>
                Prior auth missing. Suggested fix ready.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </SectionContainer>
  );
};

export default HeroSection;
