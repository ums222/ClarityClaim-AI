import { motion } from "framer-motion";
import { DollarSign, Clock, Users, AlertTriangle } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useInViewAnimation } from "../../hooks/useInViewAnimation";

const cards = [
  {
    icon: DollarSign,
    title: "Revenue Hemorrhage",
    stat: "$57",
    description:
      "Excess administrative cost per claim. Hospitals spent $25.7B fighting denials in 2023-a 23% increase.",
  },
  {
    icon: Clock,
    title: "Staff Burnout",
    stat: "73%",
    description:
      "of providers report increasing claim denials, with 67% experiencing longer payment delays.",
  },
  {
    icon: Users,
    title: "Disparity Impact",
    stat: "2x",
    description:
      "Marginalized communities face denial rates double that of other groups for identical services.",
  },
];

const ProblemSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <SectionContainer
      id="features"
      className="relative overflow-hidden section-bg-problem text-slate-900 dark:text-slate-50"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      >
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-clarity-error/20 dark:bg-clarity-error/30 blur-3xl" />
        <div className="absolute right-10 bottom-0 h-40 w-40 rounded-full bg-clarity-warning/20 dark:bg-clarity-warning/30 blur-3xl" />
      </div>

      <div ref={ref} className="relative">
        <SectionHeader
          align="center"
          title={
            <span className="bg-gradient-to-r from-clarity-warning via-clarity-accent to-clarity-error bg-clip-text text-transparent">
              The $25.7 Billion Problem
            </span>
          } as any
          subtitle="Claim denials silently drain operating margins, burn out staff, and worsen health equity outcomes."
        />

        {/* Stat + gauge */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 120 120" className="h-full w-full">
              <defs>
                <linearGradient id="gauge" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F97373" />
                  <stop offset="100%" stopColor="#FACC15" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(15,23,42,0.8)"
                strokeWidth="12"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#gauge)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50}
                transform="rotate(-90 60 60)"
                animate={
                  isInView
                    ? {
                        strokeDashoffset:
                          2 * Math.PI * 50 * (1 - 0.1181) // 11.81%
                      }
                    : undefined
                }
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">11.81%</p>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 text-center">
                Avg Claim Denial
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            Average Claim Denial Rate in 2024
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              <Card className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-transparent hover:-translate-y-1 hover:shadow-glow-accent transition-all duration-200">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clarity-error/10 text-clarity-error">
                      {i === 0 ? (
                        <DollarSign className="h-5 w-5" />
                      ) : i === 1 ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </span>
                    <CardTitle className="text-lg text-slate-900 dark:text-slate-50">{card.title}</CardTitle>
                  </div>
                  <CardDescription className="text-3xl font-bold text-clarity-error">
                    {card.stat}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 rounded-2xl border border-clarity-warning/40 bg-white/80 dark:bg-slate-900/80 p-6 text-sm text-slate-700 dark:text-slate-200"
        >
          <p className="italic">
            &quot;Nearly $18 billion was potentially wasted on overturning
            claims that should have been approved initially.&quot;
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Source: Industry analysis of U.S. healthcare claim denials.
          </p>
        </motion.blockquote>
      </div>
    </SectionContainer>
  );
};

export default ProblemSection;
