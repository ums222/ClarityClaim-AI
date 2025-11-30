import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";

const PrivacyPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className={`rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"} p-8 md:p-12`}>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Privacy Policy
            </h1>
            <p className={`text-sm mb-8 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Last updated: January 1, 2025
            </p>

            <div className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}>
              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  1. Introduction
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  ClarityClaim AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare claims management platform and related services.
                </p>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  As a healthcare technology provider, we are committed to compliance with the Health Insurance Portability and Accountability Act (HIPAA) and other applicable healthcare privacy regulations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  2. Information We Collect
                </h2>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-neutral-200" : "text-neutral-800"}`}>
                  Information You Provide
                </h3>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  <li>Contact information (name, email, phone number)</li>
                  <li>Organization details (name, type, size)</li>
                  <li>Account credentials</li>
                  <li>Communications with our support team</li>
                  <li>Demo request information</li>
                </ul>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-neutral-200" : "text-neutral-800"}`}>
                  Protected Health Information (PHI)
                </h3>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  When you use our claims management services, we may process Protected Health Information on your behalf as a Business Associate under HIPAA. This information is handled in accordance with our Business Associate Agreement and HIPAA requirements.
                </p>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-neutral-200" : "text-neutral-800"}`}>
                  Automatically Collected Information
                </h3>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  3. How We Use Your Information
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  We use the information we collect to:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  <li>Provide and improve our healthcare claims management services</li>
                  <li>Process and analyze claims data using AI technology</li>
                  <li>Generate appeals and denial predictions</li>
                  <li>Communicate with you about our services</li>
                  <li>Provide customer support</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Conduct research and analytics to improve our AI models</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  4. Data Security
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  We implement robust security measures to protect your information:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  <li>SOC 2 Type II certified infrastructure</li>
                  <li>End-to-end encryption for data in transit and at rest</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  5. Data Sharing and Disclosure
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  <li>Service providers who assist in our operations (under appropriate agreements)</li>
                  <li>Healthcare payers and clearinghouses as necessary to process claims</li>
                  <li>Legal authorities when required by law</li>
                  <li>Business partners with your consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  6. Your Rights
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  Depending on your location, you may have the right to:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  For PHI, additional rights may apply under HIPAA. Please see our HIPAA Notice for details.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  7. Data Retention
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. Healthcare-related records are retained in accordance with applicable healthcare regulations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  8. Contact Us
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className={`p-4 rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                  <p className={`${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    <strong>ClarityClaim AI</strong><br />
                    Privacy Officer<br />
                    Email: privacy@clarityclaim.ai<br />
                    Phone: +1 (555) 123-4567
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  9. Changes to This Policy
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;
