import { useState } from "react";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { Accordion } from "../ui/accordion";

type BillingCycle = "monthly" | "annual";

const PricingSection = () => {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const starterPrice = cycle === "monthly" ? "$499/mo" : "$399/mo";
  const proPrice = cycle === "monthly" ? "$1,499/mo" : "$1,199/mo";

  return (
    <SectionContainer id="pricing" className="bg-slate-950">
      <SectionHeader
        eyebrow="PRICING"
        title="Plans That Scale With You"
        subtitle="From community clinics to enterprise health systems—AI-powered claims management for everyone."
        align="center"
      />

      {/* Toggle */}
      <div className="mb-8 flex items-center justify-center gap-3 text-xs">
        <button
          className={
            "rounded-full px-4 py-1 transition-colors " +
            (cycle === "monthly"
              ? "bg-clarity-secondary text-white"
              : "bg-slate-900 text-slate-400")
          }
          onClick={() => setCycle("monthly")}
        >
          Monthly
        </button>
        <button
          className={
            "rounded-full px-4 py-1 transition-colors " +
            (cycle === "annual"
              ? "bg-clarity-secondary text-white"
              : "bg-slate-900 text-slate-400")
          }
          onClick={() => setCycle("annual")}
        >
          Annual (Save 20%)
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Starter */}
        <Card className="bg-slate-900/70">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Starter
            </p>
            <CardTitle>Small Practices & Clinics</CardTitle>
            <CardDescription className="mt-4 text-2xl font-semibold text-slate-50">
              {starterPrice}
            </CardDescription>
            <p className="text-xs text-slate-400">per provider location</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1 text-sm text-slate-300">
              <li>Up to 1,000 claims/month</li>
              <li>Denial prediction engine</li>
              <li>Pre-submission validation</li>
              <li>Basic appeal generation</li>
              <li>Email support</li>
              <li>Standard integrations</li>
            </ul>
            <Button variant="outline" className="mt-3 w-full">
              Start Free Trial
            </Button>
            <p className="text-[11px] text-slate-500">
              14-day free trial, no credit card
            </p>
          </CardContent>
        </Card>

        {/* Professional */}
        <Card className="relative bg-slate-900/90 shadow-glow-primary">
          <div className="absolute right-4 top-4">
            <Badge className="bg-clarity-accent/20 text-[10px] text-clarity-accent">
              MOST POPULAR
            </Badge>
          </div>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Professional
            </p>
            <CardTitle>Regional Health Systems</CardTitle>
            <CardDescription className="mt-4 text-2xl font-semibold text-slate-50">
              {proPrice}
            </CardDescription>
            <p className="text-xs text-slate-400">per facility</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1 text-sm text-slate-300">
              <li>Up to 10,000 claims/month</li>
              <li>Everything in Starter, plus:</li>
              <li>Advanced AI appeal engine</li>
              <li>Equity analytics dashboard</li>
              <li>Custom payer rule engines</li>
              <li>Priority support (24/7)</li>
              <li>EHR deep integrations</li>
              <li>Dedicated success manager</li>
            </ul>
            <Button className="mt-3 w-full">Start Free Trial</Button>
            <p className="text-[11px] text-slate-500">
              14-day free trial, no credit card
            </p>
          </CardContent>
        </Card>

        {/* Enterprise */}
        <Card className="bg-slate-900/70">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Enterprise
            </p>
            <CardTitle>Large Health Systems & IDNs</CardTitle>
            <CardDescription className="mt-4 text-2xl font-semibold text-slate-50">
              Custom
            </CardDescription>
            <p className="text-xs text-slate-400">volume-based pricing</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1 text-sm text-slate-300">
              <li>Unlimited claims</li>
              <li>Everything in Professional, plus:</li>
              <li>Custom AI model training</li>
              <li>White-label options</li>
              <li>On-premise deployment</li>
              <li>SLA guarantees (99.99%)</li>
              <li>Executive analytics</li>
              <li>Regulatory compliance suite</li>
              <li>Dedicated implementation team</li>
            </ul>
            <Button variant="outline" className="mt-3 w-full">
              Contact Sales
            </Button>
            <p className="text-[11px] text-slate-500">Includes pilot program</p>
          </CardContent>
        </Card>
      </div>

      {/* Mission pricing callout */}
      <div className="mt-8 rounded-2xl border border-clarity-secondary/40 bg-slate-900/80 p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clarity-secondary/15 text-clarity-secondary">
            <Heart className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-50">
              Mission-Driven Pricing
            </p>
            <p className="text-xs text-slate-300">
              Special pricing available for FQHCs, rural hospitals, and safety-net providers. We
              believe every healthcare organization deserves access to AI-powered claims
              management.
            </p>
          </div>
        </div>
        <Button variant="ghost" className="self-start md:self-auto">
          Learn About Our Community Program
        </Button>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <Accordion
          items={[
            {
              id: "billing",
              question: "How does billing work?",
              answer:
                "Billing is monthly or annual based on your selected plan. We invoice per provider location or facility and support volume-based enterprise contracts.",
            },
            {
              id: "change-plans",
              question: "Can I change plans?",
              answer:
                "Yes. You can upgrade or adjust plans as your volume changes. Our team will help you right-size your deployment.",
            },
            {
              id: "integrations",
              question: "What integrations are included?",
              answer:
                "Standard integrations with leading EHRs, clearinghouses, and billing systems are included. Deeper integrations are available in Professional and Enterprise.",
            },
            {
              id: "contracts",
              question: "Is there a long-term contract?",
              answer:
                "We offer flexible terms, including annual agreements with optional multi-year discounts for enterprise customers.",
            },
          ]}
        />
      </div>
    </SectionContainer>
  );
};

export default PricingSection;
