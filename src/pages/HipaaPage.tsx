import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Shield, Lock, FileCheck, Users, AlertTriangle, Phone } from "lucide-react";

const HipaaPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 md:p-12 mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                <Shield className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  HIPAA Notice
                </h1>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Notice of Privacy Practices
                </p>
              </div>
            </div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Effective Date: January 1, 2025
            </p>
          </div>

          {/* Main Content */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 md:p-12`}>
            <div className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}>
              
              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Our Commitment to HIPAA Compliance
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  ClarityClaim AI operates as a Business Associate under the Health Insurance Portability and Accountability Act of 1996 (HIPAA). This notice describes how medical information about patients may be used and disclosed through our platform and how you can get access to this information.
                </p>
                <div className={`p-4 rounded-lg border ${isDark ? "border-teal-500/30 bg-teal-500/10" : "border-teal-200 bg-teal-50"}`}>
                  <p className={`text-sm font-medium ${isDark ? "text-teal-400" : "text-teal-700"}`}>
                    Please review this notice carefully. It explains your rights and our responsibilities under HIPAA.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Our Role as a Business Associate
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  When healthcare organizations use ClarityClaim AI to manage claims, we act as a Business Associate. This means we:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Enter into Business Associate Agreements (BAAs) with all covered entities</li>
                  <li>Only use Protected Health Information (PHI) for permitted purposes</li>
                  <li>Implement appropriate safeguards to protect PHI</li>
                  <li>Report any security incidents or breaches</li>
                  <li>Ensure our subcontractors also comply with HIPAA requirements</li>
                </ul>
              </section>

              {/* Key Protections Grid */}
              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  How We Protect Health Information
                </h2>
                <div className="grid gap-4 md:grid-cols-2 not-prose">
                  <div className={`p-4 rounded-xl ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <Lock className={`h-5 w-5 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Encryption</h3>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      End-to-end encryption for all PHI in transit and at rest using AES-256.
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <Users className={`h-5 w-5 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Access Controls</h3>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Role-based access controls ensuring minimum necessary access to PHI.
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <FileCheck className={`h-5 w-5 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Audit Trails</h3>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Comprehensive logging of all PHI access and modifications.
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? "bg-slate-800" : "bg-white"} border ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <Shield className={`h-5 w-5 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Security Assessments</h3>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Regular risk assessments and penetration testing of our systems.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Permitted Uses and Disclosures of PHI
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Under our Business Associate Agreement, we may use and disclose PHI only for:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li><strong>Treatment:</strong> Processing claims and appeals related to patient care</li>
                  <li><strong>Payment:</strong> Submitting claims and managing the revenue cycle</li>
                  <li><strong>Healthcare Operations:</strong> Quality improvement and analytics</li>
                  <li><strong>As Required by Law:</strong> Complying with legal obligations</li>
                  <li><strong>With Authorization:</strong> For any other purpose with proper authorization</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Your Rights Regarding PHI
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Under HIPAA, individuals have certain rights regarding their PHI. While these rights are primarily exercised through the covered entity (healthcare provider), we support:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li><strong>Right to Access:</strong> Individuals can request access to their PHI</li>
                  <li><strong>Right to Amendment:</strong> Request corrections to inaccurate PHI</li>
                  <li><strong>Right to Accounting:</strong> Receive an accounting of disclosures</li>
                  <li><strong>Right to Restrict:</strong> Request restrictions on certain uses</li>
                  <li><strong>Right to Confidential Communications:</strong> Request alternative communication methods</li>
                  <li><strong>Right to a Copy:</strong> Obtain a copy of this notice</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Breach Notification
                </h2>
                <div className={`p-4 rounded-lg border ${isDark ? "border-amber-500/30 bg-amber-500/10" : "border-amber-200 bg-amber-50"} mb-4`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
                    <p className={`text-sm ${isDark ? "text-amber-300" : "text-amber-800"}`}>
                      In the event of a breach of unsecured PHI, we will notify the covered entity within 24 hours of discovery, allowing them to fulfill their notification obligations to affected individuals and regulatory authorities.
                    </p>
                  </div>
                </div>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Our breach response includes:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Immediate investigation and containment</li>
                  <li>Risk assessment of the breach</li>
                  <li>Notification to covered entities</li>
                  <li>Cooperation with breach investigation</li>
                  <li>Implementation of corrective measures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Technical Safeguards
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  We implement the following technical safeguards required by the HIPAA Security Rule:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Unique user identification and authentication</li>
                  <li>Automatic session timeout and logoff</li>
                  <li>Encryption of electronic PHI</li>
                  <li>Audit controls and activity logging</li>
                  <li>Integrity controls to prevent unauthorized alteration</li>
                  <li>Transmission security for data in transit</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Administrative Safeguards
                </h2>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>Designated Privacy and Security Officers</li>
                  <li>Workforce training on HIPAA requirements</li>
                  <li>Sanctions for policy violations</li>
                  <li>Regular policy review and updates</li>
                  <li>Contingency planning and disaster recovery</li>
                  <li>Business Associate management program</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Physical Safeguards
                </h2>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li>SOC 2 Type II certified data centers</li>
                  <li>Facility access controls</li>
                  <li>Workstation security policies</li>
                  <li>Device and media controls</li>
                  <li>Environmental protections</li>
                </ul>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Contact Information
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  For questions about this notice or our HIPAA compliance practices:
                </p>
                <div className={`p-4 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"} not-prose`}>
                  <div className="flex items-start gap-3">
                    <Phone className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <div>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        ClarityClaim AI - Privacy Office
                      </p>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Email: hipaa@clarityclaim.ai<br />
                        Phone: +1 (555) 123-4567<br />
                        Available: Monday - Friday, 9 AM - 5 PM ET
                      </p>
                    </div>
                  </div>
                </div>
                <p className={`mt-4 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  You may also file a complaint with the Secretary of Health and Human Services if you believe your privacy rights have been violated.
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

export default HipaaPage;
