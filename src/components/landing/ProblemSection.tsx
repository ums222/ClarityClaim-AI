import { motion } from "framer-motion";
import { DollarSign, Clock, Users } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useTheme } from "../../hooks/useTheme";

const cards = [
  {
    icon: DollarSign,
    title: "Revenue Hemorrhage",
    stat: "$57",
    description:
      "Excess administrative cost per claim. Hospitals spent $25.7B fighting denials in 2023—a 23% increase.",
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SectionContainer
      id="features"
      className={isDark ? "bg-neutral-900" : "bg-neutral-50"}
    >
      <div className="relative">
        <SectionHeader
          align="center"
          title="The $25.7 Billion Problem"
          subtitle="Claim denials silently drain operating margins, burn out staff, and worsen health equity outcomes."
        />

        {/* Stat gauge - monochromatic */}
        <motion.div 
          className="mb-12 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 120 120" className="h-full w-full">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={isDark ? "#27272A" : "#E4E4E7"}
                strokeWidth="10"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#0D9488"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 50}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                whileInView={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - 0.1181) }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>11.81%</p>
              <p className={`mt-1 text-[10px] ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                Avg Denial Rate
              </p>
            </div>
          </div>
          <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
            Average Claim Denial Rate in 2024
          </p>
        </motion.div>

        {/* Cards - clean design */}
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 + i * 0.15, duration: 0.6, ease: "easeOut" }}
              >
                <Card className="h-full hover:-translate-y-1 transition-all duration-200">
                  <CardHeader>
                    <div className="mb-3 flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                        <Icon className={`h-4 w-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                      </span>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                    </div>
                    <CardDescription className="text-3xl font-bold text-teal-500">
                      {card.stat}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quote - minimal */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className={`mt-12 rounded-xl p-6 ${isDark ? "bg-neutral-800/50 ring-1 ring-neutral-800" : "bg-white ring-1 ring-neutral-200"}`}
        >
          <p className={`text-sm italic ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
            "Nearly $18 billion was potentially wasted on overturning
            claims that should have been approved initially."
          </p>
          <p className={`mt-2 text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
            — Industry analysis of U.S. healthcare claim denials
          </p>
        </motion.blockquote>
      </div>
    </SectionContainer>
  );
};

export default ProblemSection;
