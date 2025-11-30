import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Plug, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  Shield, 
  Zap,
  Clock,
  Building2,
  FileText,
  RefreshCw,
  Code,
  Lock
} from "lucide-react";

const IntegrationsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const ehrIntegrations = [
    {
      name: "Epic",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Epic_Systems.svg",
      description: "Deep integration with Epic's MyChart, Caboodle, and revenue cycle modules",
      features: ["Real-time claim sync", "Automated prior auth", "Denial alerts in workflow"],
      certified: true
    },
    {
      name: "Cerner (Oracle Health)",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Cerner_Corporation_logo.svg",
      description: "Native integration with Cerner Millennium and Oracle Health Cloud",
      features: ["HL7 FHIR R4 compliant", "Revenue Cycle connectivity", "Real-time alerts"],
      certified: true
    },
    {
      name: "MEDITECH",
      logo: null,
      description: "Full integration with MEDITECH Expanse and 6.x platforms",
      features: ["Automated data sync", "Claim submission workflow", "Denial management"],
      certified: true
    },
    {
      name: "Athenahealth",
      logo: null,
      description: "Cloud-native integration with athenaOne and athenaCollector",
      features: ["API-first integration", "Real-time sync", "Embedded analytics"],
      certified: true
    },
    {
      name: "eClinicalWorks",
      logo: null,
      description: "Seamless integration with eClinicalWorks practice management",
      features: ["Bi-directional sync", "Automated workflows", "Custom reporting"],
      certified: false
    },
    {
      name: "NextGen Healthcare",
      logo: null,
      description: "Integration with NextGen Office and NextGen Enterprise",
      features: ["Claims automation", "Revenue optimization", "Analytics dashboard"],
      certified: false
    }
  ];

  const clearinghouseIntegrations = [
    { name: "Availity", description: "Real-time eligibility and claim status" },
    { name: "Change Healthcare", description: "Comprehensive clearinghouse connectivity" },
    { name: "Trizetto", description: "Gateway and Facets integration" },
    { name: "Waystar", description: "Full revenue cycle platform integration" },
    { name: "Office Ally", description: "Direct claim submission and tracking" },
    { name: "Claim.MD", description: "Simple, fast claim processing" }
  ];

  const payerConnections = [
    "UnitedHealthcare", "Anthem BCBS", "Aetna", "Cigna", "Humana", 
    "Kaiser Permanente", "Medicare", "Medicaid", "Tricare"
  ];

  const integrationFeatures = [
    {
      icon: Zap,
      title: "Real-Time Data Sync",
      description: "Claims and patient data sync instantly between systems with no manual intervention required."
    },
    {
      icon: Shield,
      title: "HIPAA-Compliant",
      description: "All integrations are SOC 2 Type II certified and fully HIPAA compliant with BAA coverage."
    },
    {
      icon: Clock,
      title: "Quick Setup",
      description: "Average implementation time of 2-4 weeks with dedicated integration specialists."
    },
    {
      icon: RefreshCw,
      title: "Automated Workflows",
      description: "Trigger actions automatically based on claim status, denials, and payer responses."
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
              <Plug className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                50+ Native Integrations
              </span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Seamless Integrations
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              ClarityClaim AI integrates with your existing systems—EHRs, practice management, clearinghouses, and payers—so you can start reducing denials without disrupting your workflow.
            </p>
          </div>

          {/* Integration Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {integrationFeatures.map((feature) => (
              <div 
                key={feature.title}
                className={`p-6 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
              >
                <div className={`p-3 rounded-xl inline-block mb-4 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                  <feature.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* EHR Integrations */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Database className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                EHR & Practice Management
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ehrIntegrations.map((integration) => (
                <div 
                  key={integration.name}
                  className={`p-6 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {integration.name}
                    </h3>
                    {integration.certified && (
                      <span className={`text-[10px] px-2 py-1 rounded-full ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-700"}`}>
                        Certified
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {integration.description}
                  </p>
                  <ul className="space-y-2">
                    {integration.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Clearinghouse Integrations */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Clearinghouses
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {clearinghouseIntegrations.map((ch) => (
                <div 
                  key={ch.name}
                  className={`p-4 rounded-xl border text-center ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
                >
                  <p className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{ch.name}</p>
                  <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>{ch.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payer Connections */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <FileText className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Direct Payer Connections
              </h2>
            </div>
            <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6`}>
              <p className={`mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Direct API connections to major payers for real-time eligibility verification, claim status, and prior authorization:
              </p>
              <div className="flex flex-wrap gap-3">
                {payerConnections.map((payer) => (
                  <span 
                    key={payer}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-700 shadow-sm"}`}
                  >
                    {payer}
                  </span>
                ))}
                <span 
                  className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-600"}`}
                >
                  + 200 more payers
                </span>
              </div>
            </div>
          </div>

          {/* API Section */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-16`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Code className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    Developer API
                  </h2>
                </div>
                <p className={`mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Build custom integrations with our RESTful API. Full HL7 FHIR R4 support, comprehensive documentation, and sandbox environment included.
                </p>
                <ul className="space-y-3 mb-6">
                  {["RESTful API with JSON responses", "HL7 FHIR R4 compliant", "Webhook notifications", "Sandbox environment", "Rate limiting & throttling"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                      <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/api-docs"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}
                >
                  View API Documentation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className={`rounded-xl p-4 font-mono text-sm ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-900 text-slate-300"}`}>
                <pre className="overflow-x-auto">
{`// Example: Submit claim for analysis
POST /api/v1/claims/analyze
{
  "claim_id": "CLM-2025-001234",
  "patient_mrn": "MRN12345",
  "payer_id": "BCBS_CA",
  "cpt_codes": ["99213", "71046"],
  "icd10_codes": ["J06.9", "R05.9"]
}

// Response
{
  "denial_risk": 0.23,
  "risk_level": "LOW",
  "issues": [],
  "recommended_actions": []
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <Lock className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Enterprise-Grade Security
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              All integrations are secured with end-to-end encryption, SOC 2 Type II certified, and HIPAA compliant. We sign BAAs with all customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/security"
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800"}`}
              >
                Learn About Security
              </Link>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-slate-300 text-slate-700 hover:bg-slate-100"}`}
              >
                Request Integration Demo
              </button>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IntegrationsPage;
