import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  Heart,
  Zap,
  Users,
  Globe,
  Coffee,
  Rocket,
  GraduationCap,
  Shield,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import SectionHeader from "../components/shared/SectionHeader";
import { Card, CardContent, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const CareersPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const benefits = [
    {
      icon: Heart,
      title: "Comprehensive Health",
      description: "Medical, dental, and vision coverage for you and your family.",
    },
    {
      icon: Rocket,
      title: "Equity & Ownership",
      description: "Meaningful equity stake in the company's success.",
    },
    {
      icon: Globe,
      title: "Remote-First",
      description: "Work from anywhere with flexible hours and async communication.",
    },
    {
      icon: GraduationCap,
      title: "Learning Budget",
      description: "$3,000/year for conferences, courses, and professional development.",
    },
    {
      icon: Coffee,
      title: "Unlimited PTO",
      description: "Take the time you need to rest and recharge.",
    },
    {
      icon: Shield,
      title: "401(k) Match",
      description: "Competitive 401(k) matching to help you plan for the future.",
    },
  ];

  const openPositions = [
    {
      id: 1,
      title: "Senior Machine Learning Engineer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      description: "Build and deploy ML models that predict claim denials and optimize healthcare revenue.",
    },
    {
      id: 2,
      title: "Full-Stack Engineer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      description: "Develop our React/Node.js platform used by healthcare organizations nationwide.",
    },
    {
      id: 3,
      title: "Healthcare Product Manager",
      department: "Product",
      location: "Remote (US)",
      type: "Full-time",
      description: "Shape the future of AI-powered revenue cycle management with deep healthcare domain expertise.",
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote (US)",
      type: "Full-time",
      description: "Partner with healthcare organizations to maximize value from ClarityClaim AI.",
    },
    {
      id: 5,
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote (US)",
      type: "Full-time",
      description: "Identify and engage healthcare organizations who can benefit from our AI platform.",
    },
  ];

  const values = [
    {
      title: "Mission-Driven",
      description: "We're solving a $260B problem in healthcare. Every line of code matters.",
    },
    {
      title: "Bias for Action",
      description: "We move fast, ship often, and learn from real customer feedback.",
    },
    {
      title: "Intellectual Honesty",
      description: "We debate ideas openly, admit mistakes quickly, and iterate relentlessly.",
    },
    {
      title: "Customer Obsession",
      description: "Our customers' success is our success. We go the extra mile.",
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
              <Briefcase className="w-3 h-3 mr-1" />
              Careers
            </Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Build the Future of{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Healthcare AI
              </span>
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl max-w-3xl mx-auto mb-8",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Join a team of passionate engineers, healthcare experts, and
              problem solvers working to eliminate claim denial waste and
              transform healthcare revenue cycle management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#positions">
                <Button size="lg">
                  View Open Positions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </SectionContainer>

        {/* Why Work Here */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <SectionHeader
            eyebrow="WHY JOIN US"
            title="More Than a Job—A Mission"
            subtitle="We're building technology that helps healthcare organizations recover billions in lost revenue. Your work will have a real impact."
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className={cn("h-full", isDark ? "bg-slate-900/70" : "bg-white")}>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-clarity-secondary mb-2">
                      {index + 1}.
                    </div>
                    <h3
                      className={cn(
                        "text-lg font-semibold mb-2",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {value.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* Benefits */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <SectionHeader
            eyebrow="BENEFITS"
            title="We Take Care of Our Team"
            subtitle="Competitive compensation, equity, and benefits designed for the way you work."
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Card className={cn("h-full", isDark ? "bg-slate-900/70" : "bg-white")}>
                    <CardContent className="pt-6 flex items-start gap-4">
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0",
                          isDark
                            ? "bg-clarity-secondary/20 text-clarity-secondary"
                            : "bg-clarity-secondary/10 text-clarity-secondary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3
                          className={cn(
                            "font-semibold mb-1",
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
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </SectionContainer>

        {/* Open Positions */}
        <SectionContainer id="positions" className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <SectionHeader
            eyebrow="OPEN POSITIONS"
            title="Join Our Team"
            subtitle="We're always looking for talented people to help us transform healthcare."
            align="center"
          />

          <div className="mt-10 space-y-4 max-w-3xl mx-auto">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card
                  className={cn(
                    "hover:-translate-y-0.5 transition-all duration-200",
                    isDark
                      ? "bg-slate-900/70 hover:shadow-xl hover:shadow-slate-900/50"
                      : "bg-white hover:shadow-lg"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {position.title}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {position.department}
                          </Badge>
                        </div>
                        <CardDescription
                          className={cn(
                            "text-sm mb-3",
                            isDark ? "text-slate-400" : "text-slate-600"
                          )}
                        >
                          {position.description}
                        </CardDescription>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={cn(
                              "flex items-center gap-1 text-xs",
                              isDark ? "text-slate-500" : "text-slate-500"
                            )}
                          >
                            <MapPin className="h-3 w-3" />
                            {position.location}
                          </span>
                          <span
                            className={cn(
                              "flex items-center gap-1 text-xs",
                              isDark ? "text-slate-500" : "text-slate-500"
                            )}
                          >
                            <Clock className="h-3 w-3" />
                            {position.type}
                          </span>
                        </div>
                      </div>
                      <Button className="self-start md:self-center">
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p
              className={cn(
                "text-sm mb-4",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Don't see a role that fits? We're always interested in hearing
              from exceptional talent.
            </p>
            <a href="mailto:careers@clarityclaim.ai">
              <Button variant="outline">
                Send Us Your Resume
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </SectionContainer>

        {/* Diversity & Inclusion */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "rounded-2xl p-8 md:p-12",
              isDark
                ? "bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800"
                : "bg-gradient-to-br from-slate-50 to-white border border-slate-200"
            )}
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <Badge className="mb-4">Diversity & Inclusion</Badge>
                <h2
                  className={cn(
                    "text-2xl md:text-3xl font-bold mb-4",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                >
                  Building a Team as Diverse as Healthcare
                </h2>
                <p
                  className={cn(
                    "text-base mb-4",
                    isDark ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  We believe the best products come from diverse teams with
                  varied perspectives and experiences. ClarityClaim AI is
                  committed to creating an inclusive workplace where everyone
                  can do their best work.
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-slate-500" : "text-slate-500"
                  )}
                >
                  We are an equal opportunity employer and value diversity at
                  our company. We do not discriminate on the basis of race,
                  religion, color, national origin, gender, sexual orientation,
                  age, marital status, veteran status, or disability status.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "grid grid-cols-2 gap-4 p-6 rounded-xl",
                    isDark ? "bg-slate-800/50" : "bg-slate-100"
                  )}
                >
                  {[
                    { icon: Users, label: "Inclusive Culture" },
                    { icon: Globe, label: "Global Team" },
                    { icon: Heart, label: "Equal Opportunity" },
                    { icon: Zap, label: "Growth Mindset" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex flex-col items-center text-center p-3"
                      >
                        <Icon className="h-6 w-6 text-clarity-secondary mb-2" />
                        <span
                          className={cn(
                            "text-xs",
                            isDark ? "text-slate-400" : "text-slate-600"
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;
