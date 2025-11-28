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
  const isDark = theme === "dark";

  return (
    <SectionContainer 
      id="top" 
      className={cn(
        "hero-bg-pattern",
        isDark ? "bg-neutral-950" : "bg-white"
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
          {/* Badge - clean, minimal */}
          <p className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
            isDark 
              ? "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20"
              : "bg-teal-50 text-teal-600 ring-1 ring-teal-500/20"
          )}>
            AI-Powered Healthcare Claims
          </p>
          
          {/* Headline */}
          <h1 className={cn(
            "mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Stop Losing Revenue to Claim Denials
          </h1>
          
          {/* Subheadline */}
          <p className={cn(
            "mt-5 text-base md:text-lg leading-relaxed max-w-lg",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            ClarityClaim AI predicts denials, optimizes submissions, and generates winning appeals—recovering millions in lost revenue.
          </p>

          {/* Stats - cleaner grid */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                className={cn(
                  "rounded-xl px-4 py-3",
                  isDark 
                    ? "bg-neutral-900 ring-1 ring-neutral-800" 
                    : "bg-neutral-50 ring-1 ring-neutral-200"
                )}
              >
                <div className="text-2xl font-semibold text-teal-500">
                  <AnimatedCounter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <p className={cn(
                  "mt-1 text-xs font-medium",
                  isDark ? "text-neutral-500" : "text-neutral-500"
                )}>{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTAs - clean buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg">
              Request Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
          </div>
        </motion.div>

        {/* RIGHT: abstract UI cards - cleaner design */}
        <motion.div
          className="relative h-[320px] md:h-[380px]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Subtle glow - monochromatic */}
          <div className={cn(
            "pointer-events-none absolute inset-0 rounded-3xl blur-3xl",
            isDark 
              ? "bg-gradient-to-br from-teal-500/20 via-transparent to-teal-500/10 opacity-60"
              : "bg-gradient-to-br from-teal-100 via-transparent to-teal-50 opacity-80"
          )} />
          
          <div className="relative h-full w-full">
            {/* Dashboard card */}
            <motion.div
              className={cn(
                "absolute left-4 top-6 w-64 rounded-2xl p-4",
                isDark 
                  ? "bg-neutral-900 ring-1 ring-neutral-800"
                  : "bg-white shadow-card ring-1 ring-neutral-100"
              )}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <p className={cn("text-xs font-medium", isDark ? "text-neutral-500" : "text-neutral-500")}>
                Appeals Dashboard
              </p>
              <p className={cn("mt-1 text-xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                $2.3M recovered
              </p>
              <div className={cn("mt-3 h-1.5 w-full rounded-full", isDark ? "bg-neutral-800" : "bg-neutral-100")}>
                <div className="h-1.5 w-3/4 rounded-full bg-teal-500" />
              </div>
              <div className={cn("mt-3 flex justify-between text-[11px]", isDark ? "text-neutral-500" : "text-neutral-500")}>
                <span>Denials −35%</span>
                <span>Appeals +87%</span>
              </div>
            </motion.div>

            {/* Success notification */}
            <motion.div
              className={cn(
                "absolute right-4 top-20 w-56 rounded-xl p-3",
                isDark 
                  ? "bg-neutral-900 ring-1 ring-neutral-800"
                  : "bg-white shadow-card ring-1 ring-neutral-100"
              )}
              animate={{ y: [-4, 6, -4] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-teal-500" />
                <p className="text-xs font-medium text-teal-500">Appeal Approved</p>
              </div>
              <p className={cn("mt-1.5 text-xs", isDark ? "text-neutral-400" : "text-neutral-600")}>
                Claim #84521 recovered <span className="font-semibold">$42,870</span>
              </p>
            </motion.div>

            {/* Risk alert */}
            <motion.div
              className={cn(
                "absolute bottom-6 right-10 w-60 rounded-xl p-3",
                isDark 
                  ? "bg-neutral-900 ring-1 ring-neutral-800"
                  : "bg-white shadow-card ring-1 ring-neutral-100"
              )}
              animate={{ y: [6, -4, 6] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-neutral-400" />
                <p className={cn("text-xs font-medium", isDark ? "text-neutral-300" : "text-neutral-600")}>Denial Risk: High</p>
              </div>
              <p className={cn("mt-1.5 text-xs", isDark ? "text-neutral-400" : "text-neutral-600")}>
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
