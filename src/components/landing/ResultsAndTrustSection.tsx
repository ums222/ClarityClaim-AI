import { motion } from "framer-motion";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import AnimatedCounter from "../shared/AnimatedCounter";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTheme } from "../../hooks/useTheme";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SectionContainer id="resources" className={isDark ? "bg-neutral-950" : "bg-neutral-50"}>
      <div>
        {/* Stats banner - clean, minimal */}
        <motion.div 
          className={`rounded-2xl p-6 md:p-8 ${isDark ? "bg-neutral-900 ring-1 ring-neutral-800" : "bg-white ring-1 ring-neutral-200"}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.5, ease: "easeOut" }}
                className="text-center"
              >
                <p className="text-3xl font-semibold text-teal-500">
                  <AnimatedCounter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </p>
                <p className={`mt-1 text-xs font-medium ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="mt-16">
          <SectionHeader
            title="Trusted by Healthcare Leaders"
            align="center"
          />
          <div className="hidden gap-6 md:grid md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              >
              <Card className="h-full hover:-translate-y-1 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-sm leading-relaxed">
                    <span className="text-xl text-teal-500">"</span>
                    {t.quote}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-3 flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium ${isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}>
                      {t.author.split(" ")[1]?.[0] ?? "A"}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                        {t.author}
                      </p>
                      <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>{t.title}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs text-teal-500">★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="mt-4 flex gap-4 overflow-x-auto pb-3 md:hidden">
            {testimonials.map((t) => (
              <Card key={t.author} className="min-w-[280px] flex-1">
                <CardHeader>
                  <CardTitle className="text-sm leading-relaxed">
                    <span className="text-xl text-teal-500">"</span>
                    {t.quote}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-3 flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium ${isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}>
                      {t.author.split(" ")[1]?.[0] ?? "A"}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                        {t.author}
                      </p>
                      <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>{t.title}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs text-teal-500">★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust badges & Integrations */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="flex flex-wrap items-center gap-2">
            {["HIPAA Compliant", "SOC 2 Type II", "HITRUST Certified", "99.99% Uptime"].map(
              (badge) => (
                <span
                  key={badge}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    isDark 
                      ? "bg-neutral-900 text-neutral-400 ring-1 ring-neutral-800" 
                      : "bg-white text-neutral-600 ring-1 ring-neutral-200"
                  }`}
                >
                  {badge}
                </span>
              )
            )}
          </div>

          <div className="space-y-3">
            <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
              Seamless Integration With Your Stack
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {[
                { name: "Epic", logo: "/logos/epic.svg" },
                { name: "Cerner", logo: "/logos/cerner.svg" },
                { name: "Meditech", logo: "/logos/meditech.svg" },
                { name: "Athena", logo: "/logos/athena.svg" },
                { name: "Change", logo: "/logos/change.svg" },
                { name: "Availity", logo: "/logos/availity.svg" },
              ].map((partner) => (
                <div
                  key={partner.name}
                  className={`flex h-10 items-center justify-center rounded-lg px-2 ${
                    isDark 
                      ? "bg-neutral-900 ring-1 ring-neutral-800" 
                      : "bg-white ring-1 ring-neutral-200"
                  }`}
                >
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`}
                    className="h-5 w-auto max-w-full object-contain dark:brightness-0 dark:invert dark:opacity-60"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default ResultsAndTrustSection;
