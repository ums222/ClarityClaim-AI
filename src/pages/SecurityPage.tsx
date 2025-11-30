import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Shield, Lock, Server, Eye, FileCheck, Users, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

const SecurityPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Independently audited for security, availability, and confidentiality controls",
      icon: FileCheck
    },
    {
      name: "HIPAA Compliant",
      description: "Full compliance with healthcare privacy and security regulations",
      icon: Shield
    },
    {
      name: "HITRUST CSF",
      description: "Certified against the healthcare industry's most comprehensive security framework",
      icon: CheckCircle2
    }
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "Encryption Everywhere",
      description: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit. We never store unencrypted PHI.",
      details: ["AES-256 encryption at rest", "TLS 1.3 for data in transit", "Key management with HSMs", "End-to-end encryption for sensitive data"]
    },
    {
      icon: Server,
      title: "Infrastructure Security",
      description: "Enterprise-grade cloud infrastructure with multiple layers of protection and redundancy.",
      details: ["SOC 2 certified data centers", "Multi-region redundancy", "DDoS protection", "Web application firewall"]
    },
    {
      icon: Users,
      title: "Access Controls",
      description: "Strict access management ensuring only authorized personnel can access systems and data.",
      details: ["Role-based access control (RBAC)", "Multi-factor authentication (MFA)", "Single sign-on (SSO) support", "Principle of least privilege"]
    },
    {
      icon: Eye,
      title: "Monitoring & Detection",
      description: "24/7 security monitoring with real-time threat detection and incident response.",
      details: ["24/7 security operations center", "Real-time threat detection", "Automated alerting", "Security incident response team"]
    },
    {
      icon: AlertTriangle,
      title: "Vulnerability Management",
      description: "Continuous security testing and vulnerability assessment to identify and address risks.",
      details: ["Annual penetration testing", "Continuous vulnerability scanning", "Bug bounty program", "Regular security assessments"]
    },
    {
      icon: Clock,
      title: "Business Continuity",
      description: "Comprehensive disaster recovery and business continuity planning to ensure service availability.",
      details: ["99.99% uptime SLA", "Automated backups", "Disaster recovery testing", "Geographic redundancy"]
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
              <Shield className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                Enterprise-Grade Security
              </span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Security You Can Trust
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Protecting healthcare data is our highest priority. ClarityClaim AI is built from the ground up with security, privacy, and compliance at its core.
            </p>
          </div>

          {/* Certifications */}
          <div className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Certifications & Compliance
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div 
                  key={cert.name}
                  className={`p-6 rounded-2xl border text-center ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
                >
                  <div className={`inline-flex p-4 rounded-2xl mb-4 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                    <cert.icon className={`h-8 w-8 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {cert.name}
                  </h3>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {cert.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              How We Protect Your Data
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature) => (
                <div 
                  key={feature.title}
                  className={`p-6 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
                >
                  <div className={`p-3 rounded-xl inline-block mb-4 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <feature.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Data Handling */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-16`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Data Handling Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  What We Collect
                </h3>
                <ul className={`space-y-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <span>Claims data necessary for denial prediction and appeal generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <span>User account information for authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <span>Usage analytics for service improvement</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  What We Don't Do
                </h3>
                <ul className={`space-y-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <li className="flex items-start gap-2">
                    <span className={`h-5 w-5 flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full ${isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>✕</span>
                    <span>Sell your data to third parties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`h-5 w-5 flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full ${isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>✕</span>
                    <span>Use PHI for advertising purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`h-5 w-5 flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full ${isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>✕</span>
                    <span>Share data without explicit authorization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Team */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-16`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Dedicated Security Team
                </h2>
                <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Our security team includes former healthcare CISO's, security engineers, and compliance experts dedicated to protecting your data.
                </p>
              </div>
              <div className={`flex items-center gap-4 px-6 py-4 rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                <div className="text-center">
                  <p className={`text-3xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>24/7</p>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Monitoring</p>
                </div>
                <div className={`w-px h-12 ${isDark ? "bg-slate-700" : "bg-slate-300"}`}></div>
                <div className="text-center">
                  <p className={`text-3xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>&lt;15m</p>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Response Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Security Team */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <Shield className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Questions About Security?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Our security team is available to answer your questions, provide documentation, and schedule security reviews.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:security@clarityclaim.ai"
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}
              >
                Contact Security Team
              </a>
              <button 
                onClick={() => {
                  // In production, this would download the whitepaper
                  alert('Security Whitepaper download will begin. Thank you for your interest!');
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-slate-300 text-slate-700 hover:bg-slate-100"}`}
              >
                Download Security Whitepaper
              </button>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SecurityPage;
