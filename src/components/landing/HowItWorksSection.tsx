import { motion } from "framer-motion";
import {
  Plug,
  Scan,
  Zap,
  FileEdit,
  BadgeCheck,
  Banknote,
} from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import { useState } from "react";
import { Button } from "../ui/button";

const steps = [
  {
    id: 1,
    label: "INTEGRATE",
    icon: Plug,
    title: "Connect Your Systems",
    description:
      "Seamless integration with Epic, Cerner, and major clearinghouses via HL7 FHIR and EDI X12 standards.",
    time: "Setup in < 2 weeks",
  },
  {
    id: 2,
    label: "ANALYZE",
    icon: Scan,
    title: "AI Scans Every Claim",
    description:
      "Real-time analysis against payer policies, coding standards, and historical denial patterns.",
    time: "< 100ms per claim",
  },
  {
    id: 3,
    label: "OPTIMIZE",
    icon: Zap,
    title: "Pre-Submission Fixes",
    description:
      "Automated suggestions for coding errors, missing documentation, and authorization issues.",
    time: "Instant recommendations",
  },
  {
    id: 4,
    label: "APPEAL",
    icon: FileEdit,
    title: "Generate Winning Appeals",
    description:
      "AI creates personalized appeal letters with policy citations and clinical evidence.",
    time: "2.3 seconds average",
  },
  {
    id: 5,
    label: "RECOVER",
    icon: Banknote,
    title: "Recover Revenue",
    description:
      "Track success rates, monitor equity metrics, and continuously improve with ML feedback loops.",
    time: "53% faster resolution",
  },
];

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(steps[0]);

  return (
    <SectionContainer
      id="how-it-works"
      className="relative overflow-hidden section-bg-dark"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative">
        <SectionHeader
          eyebrow="HOW IT WORKS"
          title="From Submission to Success in 5 Steps"
          subtitle="Our AI handles the complexity while you focus on patient care"
          align="center"
        />

        <div className="mt-8 grid gap-8 md:grid-cols-[3fr_2fr]">
          {/* Timeline */}
          <div>
            <div className="relative hidden md:flex items-center justify-between mb-6">
              <div className="absolute left-0 right-0 h-px bg-slate-800" />
              <motion.div
                className="absolute h-px bg-clarity-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${(activeStep.id / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step)}
                  className="relative z-10 flex flex-col items-center gap-1"
                >
                  <div
                    className={
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs " +
                      (activeStep.id >= step.id
                        ? "border-clarity-secondary bg-clarity-secondary/20 text-clarity-secondary"
                        : "border-slate-700 bg-slate-900 text-slate-500 dark:text-slate-400")
                    }
                  >
                    {step.id}
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                    {step.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile: vertical list */}
            <div className="flex flex-col gap-4 md:hidden">
              {steps.map((step) => {
                const Icon = step.icon;
                const active = activeStep.id === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step)}
                    className={
                      "flex items-start gap-3 rounded-2xl border p-3 text-left " +
                      (active
                        ? "border-clarity-secondary bg-slate-900/80"
                        : "border-slate-800 bg-slate-900/40")
                    }
                  >
                    <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900">
                      <Icon className="h-4 w-4 text-clarity-secondary" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {step.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-50">
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {step.description}
                      </p>
                      <p className="mt-1 text-[11px] text-clarity-accent">
                        {step.time}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Desktop detail panel */}
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:block"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full section-bg-dark">
                  <activeStep.icon className="h-4 w-4 text-clarity-secondary" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeStep.label}
                  </p>
                  <p className="text-base font-semibold text-slate-50">
                    {activeStep.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    {activeStep.description}
                  </p>
                  <p className="mt-2 text-xs text-clarity-accent">
                    {activeStep.time}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side visual + CTA */}
          <div className="flex flex-col justify-between gap-6">
            <div className="relative h-40 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(56,189,248,0.35),_transparent_55%)] opacity-60" />
              {/* Animated workflow visualization */}
              <div className="relative flex h-full items-center justify-center">
                <div className="flex items-center gap-2">
                  {steps.slice(0, 3).map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <motion.div key={step.id} className="flex items-center">
                        <motion.div
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-clarity-secondary/20 border border-clarity-secondary/40"
                          animate={{
                            scale: activeStep.id === step.id ? [1, 1.15, 1] : 1,
                            borderColor: activeStep.id >= step.id ? "rgba(13,148,136,0.8)" : "rgba(13,148,136,0.2)",
                          }}
                          transition={{ duration: 0.5, repeat: activeStep.id === step.id ? Infinity : 0, repeatDelay: 1 }}
                        >
                          <Icon className="h-4 w-4 text-clarity-secondary" />
                        </motion.div>
                        {i < 2 && (
                          <motion.div
                            className="w-6 h-0.5 bg-clarity-secondary/30 mx-1"
                            animate={{
                              backgroundColor: activeStep.id > step.id ? "rgba(13,148,136,0.8)" : "rgba(13,148,136,0.3)",
                            }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <motion.div
                className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-clarity-secondary font-medium"
                key={activeStep.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeStep.time}
              </motion.div>
            </div>
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <BadgeCheck className="h-4 w-4" />
                <span>See ClarityClaim in Action</span>
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Schedule a personalized demo
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default HowItWorksSection;
