import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plug,
  ArrowRight,
  Shield,
  Zap,
  Server,
  Database,
  Cloud,
  Lock,
  RefreshCw,
  FileText,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import SectionHeader from "../components/shared/SectionHeader";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const IntegrationsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const ehrIntegrations = [
    { name: "Epic", logo: "/logos/epic.svg" },
    { name: "Cerner", logo: "/logos/cerner.svg" },
    { name: "Meditech", logo: "/logos/meditech.svg" },
    { name: "Athenahealth", logo: "/logos/athena.svg" },
    { name: "NextGen", logo: "/logos/epic.svg" },
    { name: "eClinicalWorks", logo: "/logos/cerner.svg" },
  ];

  const payerIntegrations = [
    { name: "Change Healthcare", logo: "/logos/change.svg" },
    { name: "Availity", logo: "/logos/availity.svg" },
    { name: "UnitedHealthcare", logo: "/logos/change.svg" },
    { name: "Aetna", logo: "/logos/availity.svg" },
    { name: "BCBS", logo: "/logos/change.svg" },
    { name: "Cigna", logo: "/logos/availity.svg" },
    { name: "Humana", logo: "/logos/change.svg" },
    { name: "Medicare", logo: "/logos/availity.svg" },
  ];

  const integrationMethods = [
    {
      icon: Database,
      title: "HL7 FHIR",
      description:
        "Native support for HL7 FHIR R4 standard for real-time interoperability with modern EHR systems.",
    },
    {
      icon: FileText,
      title: "X12 EDI",
      description:
        "Full support for X12 837/835 transactions for claims submission and remittance processing.",
    },
    {
      icon: Cloud,
      title: "REST APIs",
      description:
        "Comprehensive REST APIs for custom integrations, webhooks, and real-time event streaming.",
    },
    {
      icon: Server,
      title: "SFTP/Batch",
      description:
        "Secure file transfer for batch processing, supporting standard healthcare file formats.",
    },
  ];

  const timeline = [
    {
      day: "Day 1-2",
      title: "Discovery & Planning",
      description: "Technical assessment, integration mapping, and project kickoff.",
    },
    {
      day: "Day 3-5",
      title: "Configuration",
      description: "System configuration, credential setup, and connection testing.",
    },
    {
      day: "Day 6-7",
      title: "Go Live",
      description: "Production deployment, monitoring setup, and team training.",
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
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4">
              <Plug className="w-3 h-3 mr-1" />
              Integrations
            </Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Connects to{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Everything You Use
              </span>
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl max-w-3xl mx-auto mb-8",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              ClarityClaim AI integrates seamlessly with your existing EHR,
              practice management, clearinghouse, and payer systems—via HL7
              FHIR, X12 EDI, APIs, and secure file transfer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button size="lg">
                  Talk to an Integration Specialist
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#methods">
                <Button variant="outline" size="lg">
                  View Technical Specs
                </Button>
              </a>
            </div>
          </motion.div>
        </SectionContainer>

        {/* Key Stats */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50+", label: "EHR Systems" },
              { value: "<7", label: "Days to Go Live" },
              { value: "99.99%", label: "API Uptime" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div
                  className={cn(
                    "text-sm mt-1",
                    isDark ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* EHR/PMS Integrations */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <SectionHeader
            eyebrow="EHR & PRACTICE MANAGEMENT"
            title="Electronic Health Records"
            subtitle="Native integrations with the leading EHR and practice management systems."
            align="center"
          />

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ehrIntegrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={cn(
                  "group flex flex-col items-center justify-center p-6 rounded-xl border transition-all hover:scale-105",
                  isDark
                    ? "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg"
                )}
              >
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className={cn(
                    "h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all",
                    isDark
                      ? "opacity-50 group-hover:opacity-100"
                      : "opacity-60 group-hover:opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "text-sm mt-3 font-medium",
                    isDark ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  {integration.name}
                </span>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* Payer/Clearinghouse Integrations */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <SectionHeader
            eyebrow="PAYERS & CLEARINGHOUSES"
            title="Payer Connectivity"
            subtitle="Direct connections to major payers and clearinghouse networks."
            align="center"
          />

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {payerIntegrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={cn(
                  "group flex flex-col items-center justify-center p-5 rounded-xl border transition-all hover:scale-105",
                  isDark
                    ? "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg"
                )}
              >
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className={cn(
                    "h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all",
                    isDark
                      ? "opacity-50 group-hover:opacity-100"
                      : "opacity-60 group-hover:opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "text-sm mt-2 font-medium text-center",
                    isDark ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  {integration.name}
                </span>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* Integration Methods */}
        <SectionContainer id="methods" className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <SectionHeader
            eyebrow="TECHNICAL DETAILS"
            title="Integration Methods"
            subtitle="Multiple connection options to fit your infrastructure and requirements."
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {integrationMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className={cn("h-full", isDark ? "bg-slate-900/70" : "bg-white")}>
                    <CardContent className="pt-6">
                      <span
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl mb-4",
                          isDark
                            ? "bg-clarity-secondary/20 text-clarity-secondary"
                            : "bg-clarity-secondary/10 text-clarity-secondary"
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3
                        className={cn(
                          "text-lg font-semibold mb-2",
                          isDark ? "text-white" : "text-slate-900"
                        )}
                      >
                        {method.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        {method.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </SectionContainer>

        {/* Onboarding Timeline */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <SectionHeader
            eyebrow="ONBOARDING"
            title="Go Live in Under a Week"
            subtitle="Our rapid integration framework gets you up and running fast."
            align="center"
          />

          <div className="mt-10 max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div
                className={cn(
                  "absolute left-6 top-0 bottom-0 w-0.5",
                  isDark ? "bg-slate-700" : "bg-slate-200"
                )}
              />

              {timeline.map((step, index) => (
                <motion.div
                  key={step.day}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.4 }}
                  className="relative flex gap-6 pb-8 last:pb-0"
                >
                  {/* Dot */}
                  <div
                    className={cn(
                      "relative z-10 flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0",
                      isDark
                        ? "bg-clarity-secondary text-white"
                        : "bg-clarity-secondary text-white"
                    )}
                  >
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>

                  <div className="pt-2">
                    <Badge className="mb-2">{step.day}</Badge>
                    <h3
                      className={cn(
                        "text-lg font-semibold mb-1",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* Security Section */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Security
              </Badge>
              <h2
                className={cn(
                  "text-3xl md:text-4xl font-bold mb-4",
                  isDark ? "text-white" : "text-slate-900"
                )}
              >
                Enterprise-Grade Security
              </h2>
              <p
                className={cn(
                  "text-lg mb-6",
                  isDark ? "text-slate-400" : "text-slate-600"
                )}
              >
                All integrations are secured with industry-standard protocols
                and comply with healthcare regulations.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Lock, text: "TLS 1.3 encryption for all data in transit" },
                  { icon: Shield, text: "AES-256 encryption for data at rest" },
                  { icon: RefreshCw, text: "Automated credential rotation" },
                  { icon: Zap, text: "Real-time threat monitoring" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.text}
                      className={cn(
                        "flex items-center gap-3 text-sm",
                        isDark ? "text-slate-300" : "text-slate-700"
                      )}
                    >
                      <Icon className="h-4 w-4 text-clarity-secondary flex-shrink-0" />
                      {item.text}
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { title: "HIPAA", subtitle: "Compliant" },
                { title: "SOC 2", subtitle: "Type II" },
                { title: "HITRUST", subtitle: "Certified" },
                { title: "99.99%", subtitle: "Uptime SLA" },
              ].map((badge) => (
                <Card
                  key={badge.title}
                  className={cn(
                    "text-center p-6",
                    isDark ? "bg-slate-900/70" : "bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {badge.title}
                  </div>
                  <div
                    className={cn(
                      "text-sm",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    {badge.subtitle}
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>
        </SectionContainer>

        {/* CTA Section */}
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
              Ready to Connect Your Systems?
            </h2>
            <p
              className={cn(
                "text-lg mb-8 max-w-2xl mx-auto",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Talk to our integration specialists to map out your implementation
              and get a custom timeline for your environment.
            </p>
            <Link to="/contact">
              <Button size="lg">
                Talk to an Integration Specialist
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

export default IntegrationsPage;
