import { motion } from "framer-motion";
import { FileText, Mail } from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import { Badge } from "../components/ui/badge";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const TermsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using the ClarityClaim AI platform and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

If you do not agree to these Terms, you may not access or use the Services.`,
    },
    {
      title: "2. Description of Services",
      content: `ClarityClaim AI provides AI-powered healthcare claims management software, including but not limited to:

- Claim denial prediction and prevention
- Pre-submission optimization and validation
- Automated appeal letter generation
- Health equity analytics
- Revenue cycle analytics and reporting

The Services are designed to assist healthcare organizations in managing their revenue cycle operations. The Services do not provide medical, legal, or financial advice.`,
    },
    {
      title: "3. Account Registration",
      content: `To access certain features of the Services, you must register for an account. You agree to:

- Provide accurate and complete registration information
- Maintain the security of your account credentials
- Promptly update your account information as needed
- Accept responsibility for all activities under your account
- Notify us immediately of any unauthorized use

We reserve the right to suspend or terminate accounts that violate these Terms.`,
    },
    {
      title: "4. Subscription and Payment",
      content: `**Fees:** Our Services are provided on a subscription basis. Current pricing is available on our website. We reserve the right to change pricing with 30 days' notice.

**Billing:** Subscriptions are billed in advance on a monthly or annual basis, depending on your selected plan.

**Refunds:** Fees are non-refundable except as required by law or as expressly stated in your agreement with us.

**Taxes:** You are responsible for all applicable taxes. We will charge tax where required by law.`,
    },
    {
      title: "5. Use of Services",
      content: `You agree to use the Services only for lawful purposes and in accordance with these Terms. You agree not to:

- Violate any applicable laws or regulations
- Infringe on intellectual property rights
- Transmit malicious code or interfere with the Services
- Attempt to gain unauthorized access to our systems
- Use the Services for any purpose other than their intended use
- Resell or redistribute the Services without authorization
- Use the Services in a manner that could harm patients or healthcare operations

We reserve the right to suspend or terminate your access if you violate these Terms.`,
    },
    {
      title: "6. Healthcare Compliance",
      content: `**HIPAA:** When processing Protected Health Information (PHI), you agree to enter into a Business Associate Agreement (BAA) with us. We will maintain appropriate safeguards as required under HIPAA.

**Accuracy:** While our AI models are designed for high accuracy, you acknowledge that the Services provide decision support and recommendations—not definitive clinical or billing decisions. You remain responsible for the final review and submission of all claims.

**Regulatory Compliance:** You are responsible for ensuring your use of the Services complies with all applicable healthcare regulations, including but not limited to HIPAA, state privacy laws, and payer requirements.`,
    },
    {
      title: "7. Intellectual Property",
      content: `**Our IP:** The Services, including all software, algorithms, interfaces, and content, are owned by ClarityClaim AI and protected by intellectual property laws. Your subscription grants you a limited, non-exclusive, non-transferable license to use the Services.

**Your Data:** You retain ownership of your data. By using the Services, you grant us a license to process your data as necessary to provide the Services.

**Feedback:** Any feedback, suggestions, or ideas you provide about the Services may be used by us without any obligation to you.`,
    },
    {
      title: "8. Data and Security",
      content: `**Data Processing:** We process data in accordance with our Privacy Policy and any applicable Business Associate Agreement.

**Security:** We implement industry-standard security measures to protect your data. However, no system is completely secure, and we cannot guarantee absolute security.

**Data Backup:** You are responsible for maintaining your own backups of critical data. We perform regular backups but make no guarantees about data recovery in all circumstances.`,
    },
    {
      title: "9. Disclaimers",
      content: `THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Services will be uninterrupted, error-free, or completely secure. We do not warrant the accuracy of any predictions or recommendations made by our AI models.`,
    },
    {
      title: "10. Limitation of Liability",
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLARITYCLAIM AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.

OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above may not apply to you.`,
    },
    {
      title: "11. Indemnification",
      content: `You agree to indemnify, defend, and hold harmless ClarityClaim AI, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from:

- Your use of the Services
- Your violation of these Terms
- Your violation of any applicable laws or regulations
- Your violation of any third-party rights`,
    },
    {
      title: "12. Term and Termination",
      content: `**Term:** These Terms remain in effect while you use the Services.

**Termination by You:** You may terminate your account at any time by contacting us. Termination does not entitle you to a refund of prepaid fees.

**Termination by Us:** We may suspend or terminate your access if you breach these Terms, fail to pay fees, or if required by law.

**Effect of Termination:** Upon termination, your right to use the Services ceases. We will provide a reasonable period for you to export your data.`,
    },
    {
      title: "13. Modifications to Terms",
      content: `We may modify these Terms at any time. We will notify you of material changes by email or through the Services. Your continued use of the Services after changes take effect constitutes acceptance of the modified Terms.`,
    },
    {
      title: "14. Governing Law",
      content: `These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Delaware, and you consent to the jurisdiction of such courts.`,
    },
    {
      title: "15. Miscellaneous",
      content: `**Entire Agreement:** These Terms, together with our Privacy Policy and any applicable BAA, constitute the entire agreement between you and ClarityClaim AI.

**Severability:** If any provision is found unenforceable, the remaining provisions remain in effect.

**Waiver:** Our failure to enforce any provision is not a waiver of our right to enforce it later.

**Assignment:** You may not assign your rights under these Terms without our consent.`,
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
              <FileText className="w-3 h-3 mr-1" />
              Legal
            </Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Terms of Service
            </h1>
            <p
              className={cn(
                "text-lg mb-2",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Please read these terms carefully before using our services.
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
                      ? "prose-invert prose-p:text-slate-400 prose-strong:text-slate-200"
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
                If you have questions about these Terms of Service, please
                contact us:
              </p>
              <a
                href="mailto:legal@clarityclaim.ai"
                className="inline-flex items-center gap-2 text-clarity-secondary hover:underline"
              >
                <Mail className="h-4 w-4" />
                legal@clarityclaim.ai
              </a>
            </motion.div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
