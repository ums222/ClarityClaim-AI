import { motion } from "framer-motion";
import { Shield, Mail } from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import { Badge } from "../components/ui/badge";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const PrivacyPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, request a demo, or contact us for support.

**Personal Information:**
- Name and contact information (email, phone, address)
- Organization name and role
- Account credentials
- Payment information (processed securely by our payment provider)

**Usage Information:**
- Log data (IP address, browser type, pages visited)
- Device information
- Cookies and similar tracking technologies

**Healthcare Data:**
When you use our platform, we may process claims data, patient identifiers (de-identified), and other healthcare-related information necessary to provide our services. This data is handled in accordance with HIPAA requirements.`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:

- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices, updates, and support messages
- Respond to your comments, questions, and requests
- Analyze usage patterns to improve our platform
- Detect, prevent, and address technical issues or fraud
- Train and improve our AI models (using de-identified data only)

We do not sell your personal information to third parties.`,
    },
    {
      title: "Data Sharing and Disclosure",
      content: `We may share your information in the following circumstances:

- **Service Providers:** With vendors who assist in providing our services (hosting, analytics, payment processing), under strict confidentiality agreements
- **Legal Compliance:** When required by law or to respond to legal process
- **Business Transfers:** In connection with a merger, acquisition, or sale of assets
- **With Your Consent:** When you explicitly authorize us to share information

We require all third parties to respect the security of your data and treat it in accordance with the law.`,
    },
    {
      title: "Data Security",
      content: `We implement industry-standard security measures to protect your data:

- AES-256 encryption for data at rest
- TLS 1.3 encryption for data in transit
- Regular security audits and penetration testing
- Access controls and authentication requirements
- Employee security training and background checks
- Incident response procedures

We are SOC 2 Type II certified and HITRUST certified, demonstrating our commitment to security best practices.`,
    },
    {
      title: "Data Retention",
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you terminate your account, we will delete or anonymize your data within 90 days, unless we are required to retain it for legal or regulatory purposes.

Healthcare data is retained in accordance with applicable regulations and our Business Associate Agreements with customers.`,
    },
    {
      title: "Your Rights",
      content: `Depending on your location, you may have the following rights:

- **Access:** Request a copy of your personal information
- **Correction:** Request correction of inaccurate information
- **Deletion:** Request deletion of your personal information
- **Portability:** Request a copy of your data in a portable format
- **Opt-out:** Opt out of marketing communications

To exercise these rights, please contact us at privacy@clarityclaim.ai.`,
    },
    {
      title: "Cookies and Tracking",
      content: `We use cookies and similar technologies to:

- Keep you logged in
- Remember your preferences
- Analyze how our website is used
- Improve our services

You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our services.

For more details, see our Cookie Policy.`,
    },
    {
      title: "Children's Privacy",
      content: `Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will delete it promptly.`,
    },
    {
      title: "International Transfers",
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers, including Standard Contractual Clauses approved by relevant authorities.`,
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after any changes indicates your acceptance of the updated policy.`,
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
              Legal
            </Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Privacy Policy
            </h1>
            <p
              className={cn(
                "text-lg mb-2",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your information.
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

        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
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
                      ? "prose-invert prose-p:text-slate-400 prose-strong:text-slate-200 prose-li:text-slate-400"
                      : "prose-slate prose-p:text-slate-600 prose-strong:text-slate-900"
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

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={cn(
                "rounded-xl p-6 border",
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
                Contact Us
              </h2>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-slate-400" : "text-slate-600"
                )}
              >
                If you have questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <a
                href="mailto:privacy@clarityclaim.ai"
                className="inline-flex items-center gap-2 text-clarity-secondary hover:underline"
              >
                <Mail className="h-4 w-4" />
                privacy@clarityclaim.ai
              </a>
            </motion.div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
