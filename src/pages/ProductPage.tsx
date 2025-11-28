import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  CheckCircle,
  FileText,
  BarChart3,
  LayoutDashboard,
  ArrowRight,
  Link2,
  Sparkles,
  DollarSign,
  Zap,
  Shield,
  Clock,
  Target,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import SectionHeader from "../components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const ProductPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const timelineRef = useRef<HTMLDivElement>(null);
  const isTimelineInView = useInView(timelineRef, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Denial Prediction",
      description:
        "Our machine learning models analyze historical claim patterns across millions of records, predicting denial likelihood with 94.2% accuracy before submission. Identify at-risk claims early and fix issues proactively.",
      metric: "94.2%",
      metricLabel: "Prediction Accuracy",
      diagram: "ML Pipeline",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: CheckCircle,
      title: "Pre-Submission Optimization",
      description:
        "Real-time claim scrubbing validates authorization status, coding accuracy, modifier compliance, and documentation completeness against payer-specific policies—catching errors before they become denials.",
      metric: "25%",
      metricLabel: "First-Pass Improvement",
      diagram: "Validation UI",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: FileText,
      title: "Generative Appeal Engine",
      description:
        "When denials occur, our RAG-powered AI generates custom appeal letters with precise policy citations, clinical evidence, and regulatory references—in under 3 seconds. Human-quality writing, AI speed.",
      metric: "87%",
      metricLabel: "Appeal Success Rate",
      diagram: "Appeal Generator",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: BarChart3,
      title: "Health Equity Monitoring",
      description:
        "Real-time disparity detection analyzes denial patterns across demographics, geography, and provider type. Ensure equitable outcomes while maintaining regulatory compliance with automated alerts.",
      metric: "50%",
      metricLabel: "Disparity Reduction Goal",
      diagram: "Equity Dashboard",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: LayoutDashboard,
      title: "Executive Intelligence Dashboard",
      description:
        "Comprehensive real-time KPIs on denial trends, appeal success rates, revenue recovered, and equity metrics. AI-powered forecasting helps leadership make data-driven strategic decisions.",
      metric: "100K+",
      metricLabel: "Claims/Day Capacity",
      diagram: "KPI Dashboard",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const steps = [
    {
      id: 0,
      title: "Integrate",
      description: "Connect your EHR, PMS, and clearinghouse systems with our plug-and-play API integrations.",
      icon: Link2,
      time: "Day 1",
      color: "bg-blue-500",
    },
    {
      id: 1,
      title: "Analyze",
      description: "Our AI scans every claim against 200K+ payer policies, flagging denial risks instantly.",
      icon: Brain,
      time: "Real-time",
      color: "bg-violet-500",
    },
    {
      id: 2,
      title: "Optimize",
      description: "Auto-correct coding errors, add missing modifiers, and validate documentation.",
      icon: Sparkles,
      time: "Instant",
      color: "bg-amber-500",
    },
    {
      id: 3,
      title: "Appeal",
      description: "Generate winning appeal letters with citations and evidence in seconds, not hours.",
      icon: FileText,
      time: "< 3 sec",
      color: "bg-rose-500",
    },
    {
      id: 4,
      title: "Recover",
      description: "Track outcomes, recover revenue, and continuously improve with AI-driven insights.",
      icon: DollarSign,
      time: "Ongoing",
      color: "bg-emerald-500",
    },
  ];

  const integrations = [
    { name: "Epic", logo: "/logos/epic.svg" },
    { name: "Cerner", logo: "/logos/cerner.svg" },
    { name: "Meditech", logo: "/logos/meditech.svg" },
    { name: "Athenahealth", logo: "/logos/athena.svg" },
    { name: "Change Healthcare", logo: "/logos/change.svg" },
    { name: "Availity", logo: "/logos/availity.svg" },
  ];

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
      )}
    >
      <NavBar />

      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              The Solution
            </Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Meet Your{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                AI Claims Expert
              </span>
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl max-w-3xl mx-auto mb-8",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              ClarityClaim AI is a vertical AI platform purpose-built for
              healthcare claims. Unlike generic AI, we're trained on millions of
              real claims, payer policies, clinical guidelines, and regulatory
              requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button size="lg">
                  See It In Action
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </SectionContainer>

        {/* Feature Blocks */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <SectionHeader
            eyebrow="CAPABILITIES"
            title="Five Pillars of AI-Powered Claims Management"
            subtitle="Each capability works together to create an end-to-end solution that transforms your revenue cycle."
            align="center"
          />

          <div className="mt-12 space-y-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isLeft = idx % 2 === 0;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="grid gap-8 md:grid-cols-2 items-center"
                >
                  <div className={isLeft ? "" : "md:order-2"}>
                    <Card
                      className={cn(
                        "h-full",
                        isDark ? "bg-slate-900/70" : "bg-white"
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
                              feature.color,
                              "text-white"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <CardTitle className="text-xl">
                            {feature.title}
                          </CardTitle>
                        </div>
                        <Badge className="self-start">
                          <Target className="w-3 h-3 mr-1" />
                          {feature.metricLabel}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription
                          className={cn(
                            "text-base mb-6",
                            isDark ? "text-slate-300" : "text-slate-600"
                          )}
                        >
                          {feature.description}
                        </CardDescription>
                        <div
                          className={cn(
                            "p-4 rounded-xl",
                            isDark ? "bg-slate-800/50" : "bg-slate-100"
                          )}
                        >
                          <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            {feature.metric}
                          </div>
                          <div
                            className={cn(
                              "text-sm",
                              isDark ? "text-slate-400" : "text-slate-500"
                            )}
                          >
                            {feature.metricLabel}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Visual/Diagram placeholder */}
                  <div
                    className={cn(
                      "aspect-video rounded-2xl border overflow-hidden",
                      isLeft ? "" : "md:order-1",
                      isDark
                        ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50"
                        : "bg-gradient-to-br from-slate-50 to-white border-slate-200"
                    )}
                  >
                    <div className="h-full flex items-center justify-center p-8">
                      <div className="text-center">
                        <div
                          className={cn(
                            "inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br mb-4",
                            feature.color,
                            "text-white"
                          )}
                        >
                          <Icon className="h-8 w-8" />
                        </div>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isDark ? "text-slate-400" : "text-slate-500"
                          )}
                        >
                          {feature.diagram}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionContainer>

        {/* How It Works Timeline */}
        <SectionContainer
          className={cn(
            "relative overflow-hidden",
            isDark ? "bg-slate-950" : "bg-slate-50"
          )}
        >
          <div ref={timelineRef}>
            <SectionHeader
              eyebrow="HOW IT WORKS"
              title="From Submission to Success in 5 Steps"
              subtitle="Our AI handles the complexity while you focus on patient care."
              align="center"
            />

            {/* Desktop Timeline */}
            <div className="hidden md:block mt-16">
              <div className="relative">
                {/* Progress Bar */}
                <div
                  className={cn(
                    "absolute top-10 left-0 right-0 h-1 rounded-full",
                    isDark ? "bg-slate-800" : "bg-slate-200"
                  )}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-violet-500 via-amber-500 via-rose-500 to-emerald-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={
                      isTimelineInView
                        ? { width: `${((activeStep + 1) / steps.length) * 100}%` }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = activeStep === index;
                    const isPast = activeStep > index;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="flex flex-col items-center cursor-pointer group"
                        style={{ width: "20%" }}
                        onClick={() => setActiveStep(index)}
                      >
                        {/* Circle */}
                        <motion.div
                          className={cn(
                            "relative z-10 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300",
                            isActive
                              ? step.color + " text-white shadow-lg"
                              : isPast
                              ? "bg-emerald-500 text-white"
                              : isDark
                              ? "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                              : "bg-slate-200 text-slate-500 group-hover:bg-slate-300"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="h-8 w-8" />
                        </motion.div>

                        {/* Label */}
                        <h3
                          className={cn(
                            "mt-4 text-sm font-bold uppercase tracking-wider",
                            isActive
                              ? isDark
                                ? "text-white"
                                : "text-slate-900"
                              : isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          )}
                        >
                          {step.title}
                        </h3>

                        {/* Time Badge */}
                        <span
                          className={cn(
                            "mt-2 text-xs px-3 py-1 rounded-full",
                            isActive
                              ? step.color + " text-white"
                              : isDark
                              ? "bg-slate-800 text-slate-500"
                              : "bg-slate-200 text-slate-500"
                          )}
                        >
                          {step.time}
                        </span>

                        {/* Description */}
                        <p
                          className={cn(
                            "mt-3 text-xs text-center max-w-[140px]",
                            isActive
                              ? isDark
                                ? "text-slate-300"
                                : "text-slate-600"
                              : isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                          )}
                        >
                          {step.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Timeline (Vertical) */}
            <div className="md:hidden mt-10 space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isTimelineInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={cn(
                      "flex gap-4 p-4 rounded-xl cursor-pointer transition-all",
                      isActive
                        ? isDark
                          ? "bg-slate-800"
                          : "bg-white shadow-md"
                        : isDark
                        ? "bg-slate-900/50"
                        : "bg-slate-100"
                    )}
                    onClick={() => setActiveStep(index)}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0",
                        isActive
                          ? step.color + " text-white"
                          : isDark
                          ? "bg-slate-700 text-slate-400"
                          : "bg-slate-200 text-slate-500"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "font-bold",
                            isDark ? "text-white" : "text-slate-900"
                          )}
                        >
                          {step.title}
                        </h3>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            isActive
                              ? step.color + " text-white"
                              : isDark
                              ? "bg-slate-700 text-slate-400"
                              : "bg-slate-200 text-slate-500"
                          )}
                        >
                          {step.time}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm mt-1",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </SectionContainer>

        {/* Integrations Preview */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <SectionHeader
            eyebrow="INTEGRATIONS"
            title="Works With Your Existing Systems"
            subtitle="Seamless connections to major EHRs, practice management systems, and clearinghouses."
            align="center"
          />

          <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:scale-105",
                  isDark
                    ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-md"
                )}
              >
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className={cn(
                    "h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all",
                    isDark ? "opacity-60 hover:opacity-100" : "opacity-70 hover:opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "text-xs mt-2",
                    isDark ? "text-slate-500" : "text-slate-500"
                  )}
                >
                  {integration.name}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/integrations">
              <Button variant="outline">
                View All Integrations
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionContainer>

        {/* Key Benefits */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Deploy in Days",
                description:
                  "Go live in under a week with our rapid integration framework and dedicated onboarding team.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description:
                  "HIPAA compliant, SOC 2 Type II certified, with end-to-end encryption and audit logging.",
              },
              {
                icon: Zap,
                title: "Proven ROI",
                description:
                  "Average 10x ROI within the first year through increased collections and reduced denials.",
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className={isDark ? "bg-slate-900/70" : "bg-white"}>
                    <CardContent className="pt-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-clarity-secondary/20 text-clarity-secondary mb-4">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3
                        className={cn(
                          "text-lg font-semibold mb-2",
                          isDark ? "text-white" : "text-slate-900"
                        )}
                      >
                        {benefit.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </SectionContainer>

        {/* Final CTA */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "rounded-2xl p-8 md:p-12 text-center",
              isDark
                ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50"
                : "bg-gradient-to-br from-slate-50 to-white border border-slate-200"
            )}
          >
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              See ClarityClaim AI in Action
            </h2>
            <p
              className={cn(
                "text-lg mb-8 max-w-2xl mx-auto",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Schedule a personalized demo and discover how our AI can transform
              your revenue cycle, reduce denials, and recover lost revenue.
            </p>
            <Link to="/contact">
              <Button size="lg">
                Request a Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
