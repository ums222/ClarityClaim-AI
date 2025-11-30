import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";

const TermsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 md:p-12`}>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              Terms of Service
            </h1>
            <p className={`text-sm mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Last updated: January 1, 2025
            </p>

            <div className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}>
              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  1. Acceptance of Terms
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  By accessing or using ClarityClaim AI's healthcare claims management platform and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  If you do not agree to these Terms, you may not access or use our Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  2. Description of Services
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  ClarityClaim AI provides AI-powered healthcare claims management services, including:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Claim denial prediction and analysis</li>
                  <li>Pre-submission claim validation</li>
                  <li>Automated appeal letter generation</li>
                  <li>Revenue cycle analytics and reporting</li>
                  <li>Integration with electronic health records (EHR) systems</li>
                  <li>Payer rule engine management</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  3. Account Registration
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  To use our Services, you must:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly notify us of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  4. Healthcare Compliance
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Our Services are designed for use by healthcare organizations. By using our Services, you agree to:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Execute a Business Associate Agreement (BAA) with ClarityClaim AI</li>
                  <li>Comply with HIPAA and other applicable healthcare regulations</li>
                  <li>Only submit claims and data for which you have proper authorization</li>
                  <li>Ensure accuracy of all information submitted through our platform</li>
                  <li>Use the Services in accordance with applicable laws and professional standards</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  5. Acceptable Use
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  You agree not to:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Use the Services for any unlawful purpose</li>
                  <li>Submit false or fraudulent claims</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Services</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Use the Services to transmit malware or harmful code</li>
                  <li>Resell or redistribute the Services without authorization</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  6. Fees and Payment
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Fees for our Services are set forth in your subscription agreement. You agree to:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Pay all fees according to the agreed-upon schedule</li>
                  <li>Provide accurate billing information</li>
                  <li>Notify us of any billing disputes within 30 days</li>
                </ul>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  We reserve the right to suspend Services for non-payment after providing reasonable notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  7. Intellectual Property
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  ClarityClaim AI retains all rights to our platform, software, AI models, and related intellectual property. You retain ownership of your data. By using our Services, you grant us a limited license to process your data solely for providing the Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  8. AI-Generated Content
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Our Services use artificial intelligence to generate appeal letters, predictions, and recommendations. You acknowledge that:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>AI-generated content should be reviewed by qualified personnel before use</li>
                  <li>Final decisions on claims and appeals remain your responsibility</li>
                  <li>AI predictions are probabilistic and not guarantees of outcomes</li>
                  <li>You are responsible for verifying accuracy of all submissions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  9. Disclaimer of Warranties
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  10. Limitation of Liability
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLARITYCLAIM AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES.
                </p>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICES IN THE TWELVE MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  11. Indemnification
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  You agree to indemnify and hold harmless ClarityClaim AI from any claims, damages, or expenses arising from your use of the Services, violation of these Terms, or infringement of any third-party rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  12. Termination
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Either party may terminate these Terms with 30 days' written notice. We may suspend or terminate your access immediately for violation of these Terms. Upon termination, your right to use the Services ceases, and we will provide data export options as required by applicable law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  13. Governing Law
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  These Terms shall be governed by the laws of the State of Delaware, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration in accordance with the American Arbitration Association rules.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  14. Changes to Terms
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  We may update these Terms from time to time. We will notify you of material changes at least 30 days before they take effect. Continued use of the Services after changes become effective constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  15. Contact Us
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  For questions about these Terms, please contact us:
                </p>
                <div className={`p-4 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                  <p className={`${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    <strong>ClarityClaim AI</strong><br />
                    Legal Department<br />
                    Email: legal@clarityclaim.ai<br />
                    Phone: +1 (555) 123-4567
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsPage;
