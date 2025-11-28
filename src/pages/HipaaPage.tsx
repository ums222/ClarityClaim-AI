import { motion } from "framer-motion";
import { Shield, Mail, CheckCircle } from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const HipaaPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const safeguards = [
    {
      title: "Administrative Safeguards",
      items: [
        "Designated Privacy and Security Officers",
        "Workforce training and management",
        "Security incident procedures",
        "Contingency planning and disaster recovery",
        "Business Associate agreements with all vendors",
        "Regular risk assessments and audits",
      ],
    },
    {
      title: "Physical Safeguards",
      items: [
        "Secure data center facilities (SOC 2 certified)",
        "Access controls and visitor logs",
        "Workstation security policies",
        "Device and media controls",
        "Facility access restrictions",
      ],
    },
    {
      title: "Technical Safeguards",
      items: [
        "AES-256 encryption for data at rest",
        "TLS 1.3 encryption for data in transit",
        "Multi-factor authentication",
        "Role-based access controls",
        "Automatic session timeout",
        "Audit logging and monitoring",
        "Intrusion detection systems",
      ],
    },
  ];

  const sections = [
    {
      title: "Our Commitment to HIPAA Compliance",
      content: `ClarityClaim AI is committed to protecting the privacy and security of Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and its implementing regulations.

As a Business Associate to healthcare organizations, we maintain comprehensive policies and procedures to ensure the confidentiality, integrity, and availability of all PHI we process on behalf of our customers.`,
    },
    {
      title: "Business Associate Agreements",
      content: `Before processing any PHI, we enter into a Business Associate Agreement (BAA) with each customer. Our BAA:

- Establishes the permitted uses and disclosures of PHI
- Requires appropriate safeguards to prevent unauthorized use or disclosure
- Requires reporting of security incidents and breaches
- Ensures PHI is returned or destroyed upon termination
- Makes our practices available for auditing`,
    },
    {
      title: "Protected Health Information",
      content: `PHI includes any individually identifiable health information that relates to:

- Past, present, or future physical or mental health conditions
- Healthcare services provided to an individual
- Past, present, or future payment for healthcare services

We process PHI only as necessary to provide our services and as permitted by law and our BAAs. We do not use PHI for marketing purposes or sell PHI to third parties.`,
    },
    {
      title: "Minimum Necessary Standard",
      content: `We adhere to the "minimum necessary" standard, meaning we only access, use, and disclose the minimum amount of PHI required to accomplish the intended purpose of the use or disclosure.

Our AI models are designed to work with de-identified or limited data sets when possible, reducing exposure of PHI while still providing valuable insights.`,
    },
    {
      title: "Breach Notification",
      content: `In the event of a breach of unsecured PHI, we will:

- Investigate the incident promptly
- Notify affected customers within 24 hours of discovery
- Provide information required for customers to fulfill their notification obligations
- Document the breach and our response
- Implement corrective actions to prevent recurrence

We maintain cyber liability insurance and incident response capabilities to manage breach situations effectively.`,
    },
    {
      title: "Individual Rights",
      content: `We support our customers in fulfilling requests from individuals regarding their PHI, including:

- Access to PHI
- Amendment of PHI
- Accounting of disclosures
- Restrictions on uses and disclosures
- Confidential communications

We will respond to such requests from customers within the timeframes required by HIPAA.`,
    },
    {
      title: "Workforce Training",
      content: `All employees with access to PHI receive comprehensive HIPAA training:

- Initial training upon hire
- Annual refresher training
- Role-specific training for those with elevated access
- Updates when policies or procedures change

Employees sign confidentiality agreements and are subject to sanctions for policy violations.`,
    },
    {
      title: "Subcontractors",
      content: `We require all subcontractors who may have access to PHI to enter into Business Associate Agreements and comply with HIPAA requirements. We conduct due diligence on subcontractors' security practices and monitor their compliance.`,
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
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Badge className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Compliance
            </Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              HIPAA Notice
            </h1>
            <p
              className={cn(
                "text-lg mb-2",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Our commitment to protecting healthcare information and maintaining
              HIPAA compliance.
            </p>
            <p
              className={cn(
                "text-sm",
                isDark ? "text-slate-500" : "text-slate-500"
              )}
            >
              Last Updated: November 28, 2024
            </p>
          </motion.div>
        </SectionContainer>

        {/* Certifications */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { title: "HIPAA", subtitle: "Compliant" },
                { title: "SOC 2", subtitle: "Type II" },
                { title: "HITRUST", subtitle: "Certified" },
                { title: "BAA", subtitle: "Available" },
              ].map((cert) => (
                <Card
                  key={cert.title}
                  className={cn(
                    "text-center p-4",
                    isDark ? "bg-slate-900/70" : "bg-slate-50"
                  )}
                >
                  <div className="text-xl font-bold text-clarity-secondary">
                    {cert.title}
                  </div>
                  <div
                    className={cn(
                      "text-sm",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    {cert.subtitle}
                  </div>
                </Card>
              ))}
            </div>

            {/* Safeguards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <h2
                className={cn(
                  "text-2xl font-semibold mb-6",
                  isDark ? "text-white" : "text-slate-900"
                )}
              >
                Security Safeguards
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {safeguards.map((category) => (
                  <Card
                    key={category.title}
                    className={cn(
                      "h-full",
                      isDark ? "bg-slate-900/70" : "bg-white"
                    )}
                  >
                    <CardContent className="pt-6">
                      <h3
                        className={cn(
                          "font-semibold mb-4",
                          isDark ? "text-white" : "text-slate-900"
                        )}
                      >
                        {category.title}
                      </h3>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li
                            key={item}
                            className={cn(
                              "flex items-start gap-2 text-sm",
                              isDark ? "text-slate-400" : "text-slate-600"
                            )}
                          >
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Content Sections */}
            <div className="space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                >
                  <h2
                    className={cn(
                      "text-xl font-semibold mb-4",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {section.title}
                  </h2>
                  <div
                    className={cn(
                      "prose prose-sm max-w-none",
                      isDark
                        ? "prose-invert prose-p:text-slate-400"
                        : "prose-slate prose-p:text-slate-600"
                    )}
                  >
                    {section.content.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={cn(
                "mt-10 rounded-xl p-6 border",
                isDark
                  ? "bg-slate-900/50 border-slate-800"
                  : "bg-slate-50 border-slate-200"
              )}
            >
              <h2
                className={cn(
                  "text-xl font-semibold mb-4",
                  isDark ? "text-white" : "text-slate-900"
                )}
              >
                Privacy & Security Inquiries
              </h2>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-slate-400" : "text-slate-600"
                )}
              >
                For questions about our HIPAA compliance program, to request a
                BAA, or to report a security concern:
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:security@clarityclaim.ai"
                  className="flex items-center gap-2 text-clarity-secondary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  security@clarityclaim.ai
                </a>
                <a
                  href="mailto:privacy@clarityclaim.ai"
                  className="flex items-center gap-2 text-clarity-secondary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  privacy@clarityclaim.ai
                </a>
              </div>
            </motion.div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default HipaaPage;
