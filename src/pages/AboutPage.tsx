import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Linkedin,
  Heart,
  Target,
  Users,
  Lightbulb,
  Scale,
  Lock,
  ArrowRight,
  Sparkles,
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

const AboutPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const founders = [
    {
      name: "Umidjon Saidkhujaev",
      role: "Co-Founder & CEO",
      linkedin: "https://www.linkedin.com/in/usaidkhujaev",
      bio: "Principal Architect and Business Intelligence expert with deep experience in AI/ML-driven analytics. Leads strategic vision, product direction, and enterprise healthcare transformation initiatives. Previously built analytics platforms processing billions of healthcare transactions.",
      expertise: ["AI/ML Strategy", "Business Intelligence", "Healthcare Analytics"],
    },
    {
      name: "Fahriddin Salaydinov",
      role: "Co-Founder & CTO",
      linkedin: "https://www.linkedin.com/in/fahriddinsr",
      bio: "Technical architect specializing in AI systems, cloud engineering, and large-scale automation. Leads the platform's machine learning infrastructure, cloud architecture, and product engineering. Expert in building scalable ML pipelines for healthcare applications.",
      expertise: ["AI Systems", "Cloud Engineering", "ML Infrastructure"],
    },
    {
      name: "Sherzod Esanov",
      role: "Co-Founder & COO",
      linkedin: "https://www.linkedin.com/in/sherzodesanov",
      bio: "Operations and analytics expert with deep experience in revenue cycle management, data strategy, and implementation. Oversees delivery, customer success, and operational excellence. Background in transforming RCM operations for large health systems.",
      expertise: ["Revenue Cycle", "Operations", "Implementation"],
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-Centric Innovation",
      description:
        "Every feature we build aims to improve healthcare outcomes by ensuring providers get fairly reimbursed for the care they deliver.",
    },
    {
      icon: Scale,
      title: "Equity & Fairness",
      description:
        "We're committed to eliminating disparities in claims processing and ensuring equitable reimbursement regardless of demographics or geography.",
    },
    {
      icon: Target,
      title: "Operational Excellence",
      description:
        "We obsess over reliability, performance, and precision. Our customers depend on us for mission-critical revenue cycle operations.",
    },
    {
      icon: Lock,
      title: "Data Privacy & Security",
      description:
        "Healthcare data is sacred. We maintain the highest standards of security, compliance, and privacy in everything we build.",
    },
    {
      icon: Lightbulb,
      title: "Continuous Learning",
      description:
        "Our AI gets smarter every day, learning from new patterns and policies to stay ahead of payer rule changes and industry shifts.",
    },
    {
      icon: Users,
      title: "Customer Partnership",
      description:
        "We succeed only when our customers succeed. We're partners in their revenue cycle transformation, not just a vendor.",
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
            <Badge className="mb-4">Our Story</Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Eliminating Claim Denial Waste,{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                One AI Decision at a Time
              </span>
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              We're on a mission to transform healthcare revenue cycle management
              through AI—making claims processing faster, fairer, and more
              equitable for everyone.
            </p>
          </motion.div>
        </SectionContainer>

        {/* Mission & Vision */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className={cn("h-full", isDark ? "bg-slate-900/70" : "bg-white")}>
                <CardHeader>
                  <Badge className="self-start mb-2">Mission</Badge>
                  <CardTitle className="text-2xl">
                    Why We Exist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={cn("text-base", isDark ? "text-slate-300" : "text-slate-600")}>
                    Healthcare providers lose over <strong>$260 billion annually</strong> to
                    claim denials—money that should go toward patient care.
                    We're building AI that fights back, ensuring every
                    legitimate claim gets paid while promoting equitable
                    reimbursement across all patient populations.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className={cn("h-full", isDark ? "bg-slate-900/70" : "bg-white")}>
                <CardHeader>
                  <Badge className="self-start mb-2">Vision</Badge>
                  <CardTitle className="text-2xl">
                    Where We're Going
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={cn("text-base", isDark ? "text-slate-300" : "text-slate-600")}>
                    We envision a healthcare system where AI handles the
                    administrative burden of claims management—freeing up
                    revenue cycle teams to focus on strategic work, eliminating
                    payment disparities, and ensuring providers can invest more
                    in patient outcomes.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </SectionContainer>

        {/* Founding Story */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="mb-4">Our Origin</Badge>
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-6",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Built by Healthcare, AI & Operations Leaders
            </h2>
            <p
              className={cn(
                "text-lg mb-6",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              ClarityClaim AI was founded by a team who lived the pain of claim
              denials firsthand. Working across healthcare systems, we saw
              billions of dollars lost to preventable denials—and talented
              revenue cycle teams drowning in manual appeals.
            </p>
            <p
              className={cn(
                "text-lg",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              We combined deep expertise in AI/ML, healthcare operations, and
              enterprise software to build the solution we wished existed:
              an AI that truly understands healthcare claims, learns from every
              decision, and works alongside revenue cycle teams as a force
              multiplier.
            </p>
          </motion.div>
        </SectionContainer>

        {/* Founders Section */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <SectionHeader
            eyebrow="LEADERSHIP"
            title="Meet the Founders"
            subtitle="A team with complementary strengths—combining healthcare domain expertise, advanced AI engineering, and world-class operational execution."
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "h-full flex flex-col hover:-translate-y-1 transition-all duration-200",
                    isDark ? "bg-slate-900/70 hover:shadow-xl hover:shadow-slate-900/50" : "bg-white hover:shadow-lg"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={cn(
                          "flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold",
                          isDark
                            ? "bg-slate-800 text-slate-200"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {founder.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{founder.name}</CardTitle>
                        <p className="text-xs font-semibold uppercase tracking-wider text-clarity-secondary">
                          {founder.role}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription
                      className={cn(
                        "text-sm flex-1",
                        isDark ? "text-slate-300" : "text-slate-600"
                      )}
                    >
                      {founder.bio}
                    </CardDescription>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {founder.expertise.map((skill) => (
                        <span
                          key={skill}
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            isDark
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                          isDark
                            ? "text-slate-400 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* Company Values */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <SectionHeader
            eyebrow="VALUES"
            title="What Drives Us"
            subtitle="The principles that guide every decision we make."
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
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
              );
            })}
          </div>
        </SectionContainer>

        {/* Join Us CTA */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "rounded-2xl p-8 md:p-12 text-center",
              isDark
                ? "bg-gradient-to-br from-clarity-secondary/20 to-slate-900 border border-clarity-secondary/30"
                : "bg-gradient-to-br from-clarity-secondary/10 to-white border border-clarity-secondary/20"
            )}
          >
            <Sparkles
              className={cn(
                "h-12 w-12 mx-auto mb-4",
                isDark ? "text-clarity-secondary" : "text-clarity-secondary"
              )}
            />
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Join Our Mission
            </h2>
            <p
              className={cn(
                "text-lg mb-8 max-w-2xl mx-auto",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              We're building a team of passionate people who want to transform
              healthcare revenue cycle management. If you're excited about AI,
              healthcare, and making a real impact—we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/careers">
                <Button size="lg">
                  View Open Positions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Partner With Us
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

export default AboutPage;
