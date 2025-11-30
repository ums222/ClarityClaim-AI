import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Cookie, Shield, Settings, BarChart3, Target } from "lucide-react";

const CookiesPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      required: true,
      description: "Required for the website to function properly. These cannot be disabled.",
      examples: ["Session management", "Security tokens", "Load balancing", "User preferences"]
    },
    {
      icon: BarChart3,
      title: "Analytics Cookies",
      required: false,
      description: "Help us understand how visitors interact with our website to improve user experience.",
      examples: ["Page views", "Traffic sources", "User behavior", "Performance metrics"]
    },
    {
      icon: Target,
      title: "Marketing Cookies",
      required: false,
      description: "Used to deliver relevant advertisements and track campaign effectiveness.",
      examples: ["Ad personalization", "Conversion tracking", "Retargeting", "Campaign analytics"]
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      required: false,
      description: "Enable enhanced functionality and personalization features.",
      examples: ["Language preferences", "Theme settings", "Chat widgets", "Social media integration"]
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 md:p-12 mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                <Cookie className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Cookie Policy
                </h1>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  How we use cookies and similar technologies
                </p>
              </div>
            </div>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Last updated: January 1, 2025
            </p>
          </div>

          {/* Main Content */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 md:p-12`}>
            <div className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}>
              
              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  What Are Cookies?
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and understand how you interact with the site. ClarityClaim AI uses cookies and similar technologies to provide, protect, and improve our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Types of Cookies We Use
                </h2>
                <div className="grid gap-4 not-prose">
                  {cookieTypes.map((type) => (
                    <div 
                      key={type.title}
                      className={`p-5 rounded-xl border ${isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-white"}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                          <type.icon className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                              {type.title}
                            </h3>
                            {type.required && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-700"}`}>
                                Required
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mb-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {type.examples.map((example) => (
                              <span 
                                key={example}
                                className={`text-xs px-2 py-1 rounded ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                              >
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Specific Cookies We Use
                </h2>
                <div className={`overflow-x-auto not-prose`}>
                  <table className={`w-full text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    <thead>
                      <tr className={`border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                        <th className={`text-left py-3 px-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Cookie Name</th>
                        <th className={`text-left py-3 px-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Purpose</th>
                        <th className={`text-left py-3 px-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                        <td className="py-3 px-4 font-mono text-xs">_clarity_session</td>
                        <td className="py-3 px-4">Session management</td>
                        <td className="py-3 px-4">Session</td>
                      </tr>
                      <tr className={`border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                        <td className="py-3 px-4 font-mono text-xs">_clarity_theme</td>
                        <td className="py-3 px-4">Theme preference (dark/light)</td>
                        <td className="py-3 px-4">1 year</td>
                      </tr>
                      <tr className={`border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                        <td className="py-3 px-4 font-mono text-xs">_clarity_consent</td>
                        <td className="py-3 px-4">Cookie consent preferences</td>
                        <td className="py-3 px-4">1 year</td>
                      </tr>
                      <tr className={`border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                        <td className="py-3 px-4 font-mono text-xs">_ga, _gid</td>
                        <td className="py-3 px-4">Google Analytics</td>
                        <td className="py-3 px-4">2 years / 24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Managing Your Cookie Preferences
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  You have several options for managing cookies:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings. You can block or delete cookies, though this may affect website functionality.</li>
                  <li><strong>Cookie Banner:</strong> When you first visit our site, you can choose which types of non-essential cookies to accept.</li>
                  <li><strong>Opt-Out Links:</strong> For analytics and advertising cookies, you can use industry opt-out tools like the Digital Advertising Alliance's opt-out page.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Third-Party Cookies
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Some cookies on our website are set by third-party services we use:
                </p>
                <ul className={`list-disc pl-6 mb-4 space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li><strong>Google Analytics:</strong> Website analytics and performance monitoring</li>
                  <li><strong>Intercom:</strong> Customer support chat functionality</li>
                  <li><strong>HubSpot:</strong> Marketing automation and CRM integration</li>
                </ul>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  These third parties have their own privacy policies governing their use of cookies. We encourage you to review their policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Do Not Track
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Some browsers have a "Do Not Track" feature that signals to websites that you do not want your online activity tracked. We currently honor Do Not Track signals for analytics and marketing cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Updates to This Policy
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
                </p>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Contact Us
                </h2>
                <p className={`mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  If you have questions about our use of cookies, please contact us:
                </p>
                <div className={`p-4 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"} not-prose`}>
                  <p className={`${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    <strong>ClarityClaim AI</strong><br />
                    Privacy Team<br />
                    Email: privacy@clarityclaim.ai<br />
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

export default CookiesPage;
