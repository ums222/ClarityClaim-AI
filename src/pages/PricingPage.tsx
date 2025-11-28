import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  Heart,
  ArrowRight,
  Sparkles,
  Building2,
  Building,
  Zap,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import SectionHeader from "../components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Accordion } from "../components/ui/accordion";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

type BillingCycle = "monthly" | "annual";

const PricingPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const starterPrice = cycle === "monthly" ? "$499" : "$399";
  const proPrice = cycle === "monthly" ? "$1,499" : "$1,199";

  const plans = [
    {
      name: "Starter",
      target: "Small Practices & Clinics",
      price: starterPrice,
      priceNote: "per provider location / month",
      icon: Building,
      features: [
        "Up to 1,000 claims/month",
        "AI denial prediction engine",
        "Pre-submission validation",
        "Basic appeal generation",
        "Standard EHR integrations",
        "Email support (24hr response)",
        "Basic analytics dashboard",
      ],
      cta: "Start Free Trial",
      ctaVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Professional",
      target: "Regional Health Systems",
      price: proPrice,
      priceNote: "per facility / month",
      icon: Building2,
      features: [
        "Up to 10,000 claims/month",
        "Everything in Starter, plus:",
        "Advanced AI appeal engine",
        "Equity analytics dashboard",
        "Custom payer rule engines",
        "Priority 24/7 support",
        "Deep EHR integrations",
        "Dedicated success manager",
        "Custom reporting",
      ],
      cta: "Start Free Trial",
      ctaVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      target: "Large Health Systems & IDNs",
      price: "Custom",
      priceNote: "volume-based pricing",
      icon: Sparkles,
      features: [
        "Unlimited claims",
        "Everything in Professional, plus:",
        "Custom AI model training",
        "White-label options",
        "On-premise deployment",
        "SLA guarantees (99.99%)",
        "Executive analytics suite",
        "Regulatory compliance tools",
        "Dedicated implementation team",
        "Multi-system orchestration",
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      popular: false,
    },
  ];

  const faqItems = [
    {
      id: "billing",
      question: "How does billing work?",
      answer:
        "Billing is monthly or annual based on your selected plan. We invoice per provider location (Starter) or facility (Professional). Annual plans include a 20% discount. Enterprise contracts are customized based on volume and deployment needs.",
    },
    {
      id: "change-plans",
      question: "Can I change plans or scale up?",
      answer:
        "Absolutely. You can upgrade, downgrade, or adjust plans as your claim volume changes. Our customer success team will help you right-size your deployment at any time, ensuring you're never paying for more than you need.",
    },
    {
      id: "integrations",
      question: "What integrations are included?",
      answer:
        "All plans include standard integrations with major EHRs (Epic, Cerner, Meditech), clearinghouses (Change Healthcare, Availity), and billing systems. Professional and Enterprise tiers offer deeper API integrations and custom connectors.",
    },
    {
      id: "contracts",
      question: "Is there a long-term contract requirement?",
      answer:
        "Starter and Professional plans are available month-to-month with annual options. Enterprise customers typically start with a pilot program, then move to annual or multi-year agreements with volume-based discounts.",
    },
    {
      id: "trial",
      question: "What's included in the free trial?",
      answer:
        "Our 14-day free trial gives you full access to all features in your selected tier—no credit card required. You'll get a dedicated onboarding specialist to help you integrate your systems and see real results before committing.",
    },
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
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4">Transparent Pricing</Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Plans That{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Scale With You
              </span>
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              AI-powered claims management for everyone—from community clinics
              to enterprise health systems.
            </p>
          </motion.div>
        </SectionContainer>

        {/* Pricing Cards */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-white"}>
          {/* Toggle */}
          <div className="mb-10 flex items-center justify-center gap-3 text-sm">
            <button
              className={cn(
                "rounded-full px-5 py-2 font-medium transition-all",
                cycle === "monthly"
                  ? "bg-clarity-secondary text-white shadow-md"
                  : isDark
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              onClick={() => setCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={cn(
                "rounded-full px-5 py-2 font-medium transition-all flex items-center gap-2",
                cycle === "annual"
                  ? "bg-clarity-secondary text-white shadow-md"
                  : isDark
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              onClick={() => setCycle("annual")}
            >
              Annual
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  cycle === "annual"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-500/20 text-emerald-500"
                )}
              >
                Save 20%
              </span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className={cn(
                      "relative h-full flex flex-col",
                      plan.popular
                        ? "ring-2 ring-clarity-secondary shadow-lg"
                        : "",
                      isDark ? "bg-slate-900/70" : "bg-white"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-clarity-secondary text-white shadow-md">
                          <Zap className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pt-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            plan.popular
                              ? "bg-clarity-secondary/20 text-clarity-secondary"
                              : isDark
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p
                            className={cn(
                              "text-xs uppercase tracking-wider font-medium",
                              isDark ? "text-slate-500" : "text-slate-400"
                            )}
                          >
                            {plan.name}
                          </p>
                          <CardTitle className="text-base">
                            {plan.target}
                          </CardTitle>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span
                          className={cn(
                            "text-4xl font-bold",
                            isDark ? "text-white" : "text-slate-900"
                          )}
                        >
                          {plan.price}
                        </span>
                        {plan.price !== "Custom" && (
                          <span
                            className={cn(
                              "text-sm ml-1",
                              isDark ? "text-slate-500" : "text-slate-500"
                            )}
                          >
                            /mo
                          </span>
                        )}
                        <p
                          className={cn(
                            "text-xs mt-1",
                            isDark ? "text-slate-500" : "text-slate-500"
                          )}
                        >
                          {plan.priceNote}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-2.5 flex-1">
                        {plan.features.map((feature, i) => (
                          <li
                            key={i}
                            className={cn(
                              "flex items-start gap-2 text-sm",
                              feature.includes("Everything in")
                                ? "font-medium mt-2"
                                : ""
                            )}
                          >
                            <Check
                              className={cn(
                                "h-4 w-4 mt-0.5 flex-shrink-0",
                                plan.popular
                                  ? "text-clarity-secondary"
                                  : "text-emerald-500"
                              )}
                            />
                            <span
                              className={
                                isDark ? "text-slate-300" : "text-slate-700"
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 space-y-2">
                        <Button
                          variant={plan.ctaVariant}
                          className="w-full"
                          size="lg"
                        >
                          {plan.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        {plan.price !== "Custom" && (
                          <p
                            className={cn(
                              "text-xs text-center",
                              isDark ? "text-slate-500" : "text-slate-500"
                            )}
                          >
                            14-day free trial, no credit card
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Mission-Driven Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={cn(
              "mt-10 rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6",
              isDark
                ? "border-clarity-secondary/30 bg-clarity-secondary/5"
                : "border-clarity-secondary/40 bg-clarity-secondary/5"
            )}
          >
            <div className="flex items-start gap-4 flex-1">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clarity-secondary/20 text-clarity-secondary flex-shrink-0">
                <Heart className="h-6 w-6" />
              </span>
              <div>
                <h3
                  className={cn(
                    "text-lg font-semibold mb-1",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                >
                  Mission-Driven Pricing
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  We believe every healthcare organization deserves access to
                  AI-powered claims management. Special pricing and support are
                  available for{" "}
                  <strong>
                    Federally Qualified Health Centers (FQHCs), rural hospitals,
                    and safety-net providers
                  </strong>
                  .
                </p>
              </div>
            </div>
            <Button variant="outline" className="self-start md:self-auto">
              Learn About Our Community Program
            </Button>
          </motion.div>
        </SectionContainer>

        {/* FAQ Section */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-slate-50"}>
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our pricing and plans."
            align="center"
          />

          <div className="max-w-3xl mx-auto mt-8">
            <Accordion items={faqItems} />
          </div>
        </SectionContainer>

        {/* Final CTA */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-white"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Ready to See ClarityClaim in Action?
            </h2>
            <p
              className={cn(
                "text-lg mb-8",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Schedule a personalized demo and discover how our AI can transform
              your revenue cycle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button size="lg">
                  Schedule a Demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/product">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
