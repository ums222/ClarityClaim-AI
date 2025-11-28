import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle,
  FileText,
  Wand2,
  BarChart3,
  LayoutDashboard,
  LineChart,
  Check,
  TrendingUp,
} from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// AI Pattern Map Visualization
const AIPatternMapVisual = () => (
  <div className="relative h-full w-full overflow-hidden">
    {/* Animated nodes */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-clarity-secondary"
        style={{
          width: Math.random() * 12 + 6,
          height: Math.random() * 12 + 6,
          left: `${(i % 4) * 25 + Math.random() * 15}%`,
          top: `${Math.floor(i / 4) * 33 + Math.random() * 20}%`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
    {/* Connection lines */}
    <svg className="absolute inset-0 w-full h-full">
      {[...Array(8)].map((_, i) => (
        <motion.line
          key={i}
          x1={`${20 + (i % 3) * 30}%`}
          y1={`${20 + Math.floor(i / 3) * 30}%`}
          x2={`${40 + (i % 3) * 20}%`}
          y2={`${40 + Math.floor(i / 3) * 25}%`}
          stroke="currentColor"
          className="text-clarity-secondary/30"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
    </svg>
    <div className="absolute bottom-2 left-2 rounded bg-clarity-secondary/20 px-2 py-1 text-[10px] text-clarity-secondary font-medium">
      94.2% Accuracy
    </div>
  </div>
);

// Validation Checklist Visualization
const ValidationChecklistVisual = () => {
  const items = ["Prior Auth", "Modifiers", "Diagnosis", "Provider NPI"];
  return (
    <div className="flex flex-col gap-2 p-2">
      {items.map((item, i) => (
        <motion.div
          key={item}
          className="flex items-center gap-2 rounded-lg bg-white/50 dark:bg-slate-800/50 px-3 py-1.5"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 + 0.3, type: "spring" }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-clarity-success/20"
          >
            <Check className="h-3 w-3 text-clarity-success" />
          </motion.div>
          <span className="text-xs text-slate-600 dark:text-slate-300">{item}</span>
        </motion.div>
      ))}
    </div>
  );
};

// Appeal Draft Visualization
const AppealDraftVisual = () => (
  <div className="flex flex-col gap-1.5 p-3">
    <div className="flex items-center gap-2 mb-2">
      <FileText className="h-4 w-4 text-clarity-accent" />
      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">APPEAL LETTER</span>
    </div>
    {[85, 100, 70, 90, 60].map((width, i) => (
      <motion.div
        key={i}
        className="h-2 rounded-full bg-slate-200 dark:bg-slate-700"
        style={{ width: `${width}%` }}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1, duration: 0.5 }}
      />
    ))}
    <motion.div
      className="mt-2 flex items-center gap-1 text-[10px] text-clarity-success"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8 }}
    >
      <Check className="h-3 w-3" />
      Generated in 2.3s
    </motion.div>
  </div>
);

// Equity Dashboard Visualization
const EquityDashboardVisual = () => {
  const bars = [
    { label: "Rural", value: 75, color: "bg-clarity-secondary" },
    { label: "Urban", value: 82, color: "bg-clarity-primary" },
    { label: "Suburban", value: 68, color: "bg-clarity-accent" },
  ];
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 className="h-4 w-4 text-clarity-secondary" />
        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">EQUITY METRICS</span>
      </div>
      {bars.map((bar, i) => (
        <div key={bar.label} className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 w-14">{bar.label}</span>
          <div className="flex-1 h-4 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              className={`h-full ${bar.color}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${bar.value}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 w-8">{bar.value}%</span>
        </div>
      ))}
    </div>
  );
};

// Executive KPIs Visualization  
const ExecKPIsVisual = () => {
  const kpis = [
    { label: "Claims/Day", value: "127K", trend: "+12%" },
    { label: "Recovered", value: "$2.3M", trend: "+8%" },
    { label: "Success Rate", value: "87%", trend: "+5%" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          className="flex flex-col items-center rounded-lg bg-white/50 dark:bg-slate-800/50 p-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
        >
          <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{kpi.value}</span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400">{kpi.label}</span>
          <span className="flex items-center text-[9px] text-clarity-success">
            <TrendingUp className="h-2 w-2 mr-0.5" />
            {kpi.trend}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const visualComponents = [
  AIPatternMapVisual,
  ValidationChecklistVisual,
  AppealDraftVisual,
  EquityDashboardVisual,
  ExecKPIsVisual,
];

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
  return (
    <SectionContainer
      id="solution"
      className="section-bg-solution text-slate-900 dark:text-slate-50"
    >
      <div>
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
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                className="grid gap-6 md:grid-cols-2 md:items-center"
              >
                <div className={left ? "" : "md:order-2"}>
                  <Card className="bg-white/80 dark:bg-slate-950/50 hover:shadow-glow-primary transition-all duration-200 border-slate-200 dark:border-slate-800/80">
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
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
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
                  <div className="relative h-40 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:via-slate-900/40 dark:to-clarity-secondary/20 overflow-hidden hover:shadow-glow-accent transition-shadow">
                    {(() => {
                      const VisualComponent = visualComponents[idx];
                      return VisualComponent ? <VisualComponent /> : null;
                    })()}
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
