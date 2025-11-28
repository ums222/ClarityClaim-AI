import { motion } from "framer-motion";
import {
  Brain,

  CheckCircle,
  FileText,
  Wand2,
  BarChart3,
  LayoutDashboard,
  LineChart,
} from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { useInViewAnimation } from "../../hooks/useInViewAnimation";
import { Button } from "../ui/button";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Denial Pattern Recognition",
    description:
      "Machine learning models analyze millions of historical claims to predict denial likelihood before submission. Flag at-risk claims early and fix issues proactively.",
    badge: "94.2% Prediction Accuracy",
    visualLabel: "AI Pattern Map",
  },
  {
    icon: CheckCircle,
    title: "Intelligent Pre-Submission Validation",
    description:
      "Real-time claim scrubbing against payer-specific policies. Validates authorizations, modifiers, and documentation in seconds.",
    badge: "25% First-Pass Improvement",
    visualLabel: "Validation Checklist",
  },
  {
    icon: FileText,
    title: "Generative Appeal Letter Engine",
    description:
      "GPT-powered system generates custom appeal letters with precise policy citations, coverage rules, and clinical literature—in under 3 seconds.",
    badge: "87% Appeal Success Rate",
    visualLabel: "Appeal Draft",
  },
  {
    icon: BarChart3,
    title: "Health Equity Analytics",
    description:
      "Real-time disparity detection across demographics, geography, and provider type. Ensure equitable outcomes and regulatory compliance.",
    badge: "50% Disparity Reduction Goal",
    visualLabel: "Equity Dashboard",
  },
  {
    icon: LayoutDashboard,
    title: "Executive Intelligence Dashboard",
    description:
      "Real-time KPIs on denial trends, appeal rates, revenue recovered, and equity metrics. AI-powered forecasting for strategic planning.",
    badge: "100K+ Claims/Day",
    visualLabel: "Exec KPIs",
  },
];

const SolutionSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <SectionContainer
      id="solution"
      className="bg-solution-gradient text-slate-50"
    >
      <div ref={ref}>
        <SectionHeader
          eyebrow="THE SOLUTION"
          title="Meet Your AI Claims Expert"
          subtitle="ClarityClaim AI is a vertical AI platform purpose-built for healthcare claims. Unlike generic AI, we're trained on real claims data, payer policies, clinical guidelines, and regulatory requirements."
          align="center"
        />

        <div className="mt-10 space-y-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            const left = idx % 2 === 0;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: left ? -40 : 40 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : undefined
                }
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="grid gap-6 md:grid-cols-2 md:items-center"
              >
                <div className={left ? "" : "md:order-2"}>
                  <Card className="bg-slate-950/50 hover:shadow-glow-primary transition-all duration-200 border-slate-800/80">
                    <CardHeader>
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clarity-secondary/15 text-clarity-secondary">
                          {idx === 4 ? (
                            <LineChart className="h-4 w-4" />
                          ) : idx === 2 ? (
                            <Wand2 className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </span>
                        <CardTitle>{f.title}</CardTitle>
                      </div>
                      <Badge>{f.badge}</Badge>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-slate-300">
                        {f.description}
                      </CardDescription>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 px-0 text-clarity-accent hover:bg-transparent"
                      >
                        Learn more →
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div
                  className={left ? "" : "md:order-1"}
                >
                  <div className="relative h-40 rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-900/40 to-clarity-secondary/20 p-4 hover:shadow-glow-accent transition-shadow">
                    <div className="flex h-full items-center justify-center text-xs text-slate-300">
                      {f.visualLabel}
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-2xl border border-clarity-secondary/20" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
};

export default SolutionSection;
