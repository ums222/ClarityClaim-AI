import { motion } from "framer-motion";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import AnimatedCounter from "../shared/AnimatedCounter";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useInViewAnimation } from "../../hooks/useInViewAnimation";

const stats = [
  { label: "Denial Rate Reduction", value: 35, suffix: "%" },
  { label: "First-Pass Improvement", value: 25, suffix: "%" },
  { label: "Faster Appeal Resolution", value: 53, suffix: "%" },
  { label: "Avg. Annual Recovery per Hospital", value: 2.3, prefix: "$", suffix: "M", decimals: 1 },
];

const testimonials = [
  {
    quote:
      "ClarityClaim AI transformed our revenue cycle. We recovered $1.8M in the first quarter alone and reduced our denial rate by 40%.",
    author: "Dr. Sarah Chen",
    title: "CFO, Regional Medical Center",
  },
  {
    quote:
      "The appeal letters are indistinguishable from those written by our best medical directors—but generated in seconds instead of hours.",
    author: "Michael Rodriguez",
    title: "Revenue Cycle Director, Community Health System",
  },
  {
    quote:
      "Finally, an AI solution that understands healthcare. The equity analytics helped us identify and address denial disparities we didn't even know existed.",
    author: "Dr. Aisha Patel",
    title: "Chief Medical Officer, Safety-Net Hospital Network",
  },
];

const ResultsAndTrustSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <SectionContainer id="resources" className="section-bg-dark">
      <div ref={ref}>
        {/* Gradient banner */}
        <div className="rounded-3xl bg-gradient-to-r from-clarity-primary via-clarity-secondary to-clarity-accent p-[1px]">
          <div className="flex flex-col gap-6 rounded-3xl bg-white/95 dark:bg-slate-950/95 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : undefined
                }
                transition={{ delay: 0.1 + idx * 0.1 }}
                className="flex flex-col items-start gap-1 text-left md:items-center md:text-center"
              >
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  <AnimatedCounter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12">
          <SectionHeader
            title="Trusted by Healthcare Leaders"
            align="center"
          />
          <div className="hidden gap-6 md:grid md:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.author}
                className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-transparent hover:-translate-y-1 hover:shadow-glow-primary transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-sm text-slate-900 dark:text-slate-50">
                    <span className="text-2xl leading-none text-clarity-accent">
                      "
                    </span>
                    {t.quote}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      {t.author.split(" ")[1]?.[0] ?? "A"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {t.author}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.title}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs text-amber-400">
                        ★
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile: simple horizontal scroll */}
          <div className="mt-4 flex gap-4 overflow-x-auto pb-3 md:hidden">
            {testimonials.map((t) => (
              <Card
                key={t.author}
                className="min-w-[260px] flex-1 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-transparent"
              >
                <CardHeader>
                  <CardTitle className="text-sm text-slate-900 dark:text-slate-50">
                    <span className="text-2xl leading-none text-clarity-accent">
                      "
                    </span>
                    {t.quote}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      {t.author.split(" ")[1]?.[0] ?? "A"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {t.author}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.title}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs text-amber-400">
                        ★
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="flex flex-wrap items-center gap-3">
            {["HIPAA Compliant", "SOC 2 Type II", "HITRUST Certified", "99.99% Uptime"].map(
              (badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 dark:border-slate-700 dark:bg-slate-900/70 px-3 py-1 text-xs text-slate-600 dark:text-slate-300"
                >
                  {badge}
                </span>
              )
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Seamless Integration With Your Stack
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {["Epic", "Cerner", "Meditech", "Athena", "Change", "Availity"].map(
                (logo) => (
                  <div
                    key={logo}
                    className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white/40 dark:border-slate-800 dark:bg-slate-900/40 text-[11px] font-medium text-slate-500 hover:border-slate-400 hover:text-slate-900 dark:hover:border-slate-500 dark:hover:text-slate-100 transition-colors"
                  >
                    {logo}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default ResultsAndTrustSection;
