import { motion } from "framer-motion";
import { Cookie, Mail, Settings } from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const CookiesPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cookieTypes = [
    {
      title: "Essential Cookies",
      required: true,
      description: "These cookies are necessary for the website to function and cannot be disabled.",
      examples: [
        { name: "session_id", purpose: "Maintains your login session", duration: "Session" },
        { name: "csrf_token", purpose: "Security token to prevent attacks", duration: "Session" },
        { name: "preferences", purpose: "Stores your settings (theme, language)", duration: "1 year" },
      ],
    },
    {
      title: "Analytics Cookies",
      required: false,
      description: "These cookies help us understand how visitors interact with our website.",
      examples: [
        { name: "_ga", purpose: "Google Analytics - tracks unique visitors", duration: "2 years" },
        { name: "_gid", purpose: "Google Analytics - distinguishes users", duration: "24 hours" },
        { name: "mp_*", purpose: "Mixpanel - product analytics", duration: "1 year" },
      ],
    },
    {
      title: "Marketing Cookies",
      required: false,
      description: "These cookies are used to track visitors across websites for advertising purposes.",
      examples: [
        { name: "_fbp", purpose: "Facebook - tracks visits across websites", duration: "3 months" },
        { name: "li_sugr", purpose: "LinkedIn - tracks conversions", duration: "3 months" },
        { name: "hubspotutk", purpose: "HubSpot - tracks visitor identity", duration: "13 months" },
      ],
    },
    {
      title: "Functionality Cookies",
      required: false,
      description: "These cookies enable enhanced functionality and personalization.",
      examples: [
        { name: "intercom-*", purpose: "Intercom - enables chat support", duration: "9 months" },
        { name: "calendly_*", purpose: "Calendly - enables demo scheduling", duration: "Session" },
      ],
    },
  ];

  const sections = [
    {
      title: "What Are Cookies?",
      content: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.

Cookies can be "first-party" (set by the website you're visiting) or "third-party" (set by a different domain). They can also be "session" cookies (deleted when you close your browser) or "persistent" cookies (remain until they expire or you delete them).`,
    },
    {
      title: "How We Use Cookies",
      content: `We use cookies and similar technologies for several purposes:

- **Authentication:** To keep you logged in and maintain your session
- **Security:** To protect against fraud and unauthorized access  
- **Preferences:** To remember your settings and choices
- **Analytics:** To understand how visitors use our website and improve our services
- **Marketing:** To deliver relevant advertisements and measure campaign effectiveness

We do not use cookies to collect sensitive personal information like financial data or health information.`,
    },
    {
      title: "Managing Your Cookie Preferences",
      content: `You have several options for managing cookies:

**Browser Settings:** Most browsers allow you to block or delete cookies. Check your browser's help documentation for instructions. Note that blocking all cookies may affect website functionality.

**Our Cookie Settings:** You can manage your preferences for non-essential cookies using our cookie consent banner or by contacting us.

**Opt-Out Tools:**
- Google Analytics: https://tools.google.com/dlpage/gaoptout
- Facebook: https://www.facebook.com/ads/preferences
- LinkedIn: https://www.linkedin.com/psettings/advertising`,
    },
    {
      title: "Do Not Track",
      content: `Some browsers have a "Do Not Track" feature that signals to websites that you do not want to be tracked. Our website currently does not respond to "Do Not Track" signals, but you can use the cookie management options described above to control tracking.`,
    },
    {
      title: "Updates to This Policy",
      content: `We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. We will notify you of material changes by posting the updated policy on this page and updating the "Last Updated" date.`,
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
              <Cookie className="w-3 h-3 mr-1" />
              Legal
            </Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Cookie Policy
            </h1>
            <p
              className={cn(
                "text-lg mb-2",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              This policy explains how we use cookies and similar technologies on
              our website.
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
          <div className="max-w-3xl mx-auto">
            {/* Cookie Types */}
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
                Types of Cookies We Use
              </h2>
              <div className="space-y-6">
                {cookieTypes.map((type) => (
                  <Card
                    key={type.title}
                    className={cn(isDark ? "bg-slate-900/70" : "bg-white")}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                        <Badge
                          variant={type.required ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {type.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        {type.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr
                              className={cn(
                                "border-b",
                                isDark
                                  ? "border-slate-700"
                                  : "border-slate-200"
                              )}
                            >
                              <th
                                className={cn(
                                  "text-left py-2 font-medium",
                                  isDark ? "text-slate-300" : "text-slate-700"
                                )}
                              >
                                Cookie
                              </th>
                              <th
                                className={cn(
                                  "text-left py-2 font-medium",
                                  isDark ? "text-slate-300" : "text-slate-700"
                                )}
                              >
                                Purpose
                              </th>
                              <th
                                className={cn(
                                  "text-left py-2 font-medium",
                                  isDark ? "text-slate-300" : "text-slate-700"
                                )}
                              >
                                Duration
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {type.examples.map((cookie) => (
                              <tr
                                key={cookie.name}
                                className={cn(
                                  "border-b last:border-0",
                                  isDark
                                    ? "border-slate-800"
                                    : "border-slate-100"
                                )}
                              >
                                <td
                                  className={cn(
                                    "py-2 font-mono text-xs",
                                    isDark
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  )}
                                >
                                  {cookie.name}
                                </td>
                                <td
                                  className={cn(
                                    "py-2",
                                    isDark
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  )}
                                >
                                  {cookie.purpose}
                                </td>
                                <td
                                  className={cn(
                                    "py-2",
                                    isDark
                                      ? "text-slate-500"
                                      : "text-slate-500"
                                  )}
                                >
                                  {cookie.duration}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
                Questions About Cookies?
              </h2>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-slate-400" : "text-slate-600"
                )}
              >
                If you have questions about our use of cookies or want to update
                your preferences:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:privacy@clarityclaim.ai"
                  className="inline-flex items-center gap-2 text-clarity-secondary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  privacy@clarityclaim.ai
                </a>
                <button
                  onClick={() =>
                    alert("Cookie preferences modal would open here")
                  }
                  className="inline-flex items-center gap-2 text-clarity-secondary hover:underline"
                >
                  <Settings className="h-4 w-4" />
                  Manage Cookie Preferences
                </button>
              </div>
            </motion.div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default CookiesPage;
