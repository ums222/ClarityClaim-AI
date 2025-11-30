import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Copy, 
  CheckCircle2, 
  Book,
  Zap,
  Shield,
  Key,
  Terminal,
  FileCode,
  ArrowRight,
  ChevronRight
} from "lucide-react";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  category: string;
}

const endpoints: Endpoint[] = [
  { method: "GET", path: "/claims", description: "List all claims", category: "Claims" },
  { method: "POST", path: "/claims", description: "Create a new claim", category: "Claims" },
  { method: "GET", path: "/claims/{id}", description: "Get claim details", category: "Claims" },
  { method: "PUT", path: "/claims/{id}", description: "Update a claim", category: "Claims" },
  { method: "POST", path: "/claims/{id}/predict", description: "Predict denial risk", category: "Claims" },
  { method: "GET", path: "/appeals", description: "List all appeals", category: "Appeals" },
  { method: "POST", path: "/appeals", description: "Create a new appeal", category: "Appeals" },
  { method: "GET", path: "/appeals/{id}", description: "Get appeal details", category: "Appeals" },
  { method: "POST", path: "/appeals/generate", description: "Generate appeal letter", category: "Appeals" },
  { method: "GET", path: "/analytics/denials", description: "Denial analytics", category: "Analytics" },
  { method: "GET", path: "/analytics/patterns", description: "Pattern analysis", category: "Analytics" },
  { method: "GET", path: "/payers", description: "List payers", category: "Payers" },
  { method: "GET", path: "/payers/{id}/rules", description: "Get payer rules", category: "Payers" },
];

const codeExamples = {
  authentication: `curl -X GET "https://api.clarityclaim.ai/v1/claims" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
  createClaim: `curl -X POST "https://api.clarityclaim.ai/v1/claims" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "patient_name": "John Smith",
    "payer_id": "UHC001",
    "diagnosis_codes": ["E11.9", "I10"],
    "procedure_codes": ["99213"],
    "billed_amount": 250.00,
    "service_date": "2025-11-28"
  }'`,
  predictDenial: `curl -X POST "https://api.clarityclaim.ai/v1/claims/CLM-001/predict" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Response
{
  "claim_id": "CLM-001",
  "risk_score": 72,
  "risk_level": "high",
  "predicted_denial_reason": "Prior authorization required",
  "recommendations": [
    "Submit prior authorization before filing claim",
    "Include medical necessity documentation"
  ]
}`,
  generateAppeal: `curl -X POST "https://api.clarityclaim.ai/v1/appeals/generate" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "claim_id": "CLM-001",
    "denial_code": "PR-1",
    "denial_reason": "Prior authorization was not obtained",
    "additional_context": "Emergency admission"
  }'`
};

const ApiDocsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(endpoints.map(e => e.category)))];
  
  const filteredEndpoints = selectedCategory === "All" 
    ? endpoints 
    : endpoints.filter(e => e.category === selectedCategory);

  const copyToClipboard = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return isDark ? "bg-green-500/20 text-green-400" : "bg-green-50 text-green-700";
      case "POST":
        return isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-700";
      case "PUT":
        return isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-50 text-yellow-700";
      case "DELETE":
        return isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Developer Documentation
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
              API Reference
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Integrate ClarityClaim AI's powerful denial prediction and appeal generation into your applications.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Key, title: "Authentication", desc: "API key setup" },
              { icon: Zap, title: "Quick Start", desc: "5-minute guide" },
              { icon: Book, title: "Full Reference", desc: "Complete docs" },
              { icon: Shield, title: "Rate Limits", desc: "Usage limits" }
            ].map((item) => (
              <div 
                key={item.title}
                className={`p-4 rounded-xl border transition-all hover:shadow-lg cursor-pointer ${
                  isDark ? "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700" : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
                }`}
              >
                <item.icon className={`h-6 w-6 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>{item.title}</h3>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Base URL */}
              <section>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Base URL
                </h2>
                <div className={`rounded-xl border p-4 ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-neutral-50"}`}>
                  <code className={`text-sm ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                    https://api.clarityclaim.ai/v1
                  </code>
                </div>
              </section>

              {/* Authentication */}
              <section>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Authentication
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  All API requests require authentication using an API key. Include your API key in the Authorization header:
                </p>
                <div className={`rounded-xl border overflow-hidden ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                  <div className={`flex items-center justify-between px-4 py-2 ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                    <div className="flex items-center gap-2">
                      <Terminal className={`h-4 w-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                      <span className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>cURL</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(codeExamples.authentication, "auth")}
                      className={`flex items-center gap-1 text-sm ${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                      {copiedCode === "auth" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedCode === "auth" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className={`p-4 overflow-x-auto text-sm ${isDark ? "bg-neutral-900 text-neutral-300" : "bg-white text-neutral-700"}`}>
                    <code>{codeExamples.authentication}</code>
                  </pre>
                </div>
              </section>

              {/* Create Claim */}
              <section>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Create a Claim
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Create a new claim in ClarityClaim AI for denial prediction and management.
                </p>
                <div className={`rounded-xl border overflow-hidden ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                  <div className={`flex items-center justify-between px-4 py-2 ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor("POST")}`}>POST</span>
                      <code className={`text-sm ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>/claims</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(codeExamples.createClaim, "create")}
                      className={`flex items-center gap-1 text-sm ${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                      {copiedCode === "create" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className={`p-4 overflow-x-auto text-sm ${isDark ? "bg-neutral-900 text-neutral-300" : "bg-white text-neutral-700"}`}>
                    <code>{codeExamples.createClaim}</code>
                  </pre>
                </div>
              </section>

              {/* Predict Denial */}
              <section>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Predict Denial Risk
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Use AI to predict the denial risk for a claim and get recommendations.
                </p>
                <div className={`rounded-xl border overflow-hidden ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                  <div className={`flex items-center justify-between px-4 py-2 ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor("POST")}`}>POST</span>
                      <code className={`text-sm ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>/claims/{"{id}"}/predict</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(codeExamples.predictDenial, "predict")}
                      className={`flex items-center gap-1 text-sm ${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                      {copiedCode === "predict" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className={`p-4 overflow-x-auto text-sm ${isDark ? "bg-neutral-900 text-neutral-300" : "bg-white text-neutral-700"}`}>
                    <code>{codeExamples.predictDenial}</code>
                  </pre>
                </div>
              </section>

              {/* Generate Appeal */}
              <section>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Generate Appeal Letter
                </h2>
                <p className={`mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Generate an AI-powered appeal letter for a denied claim.
                </p>
                <div className={`rounded-xl border overflow-hidden ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                  <div className={`flex items-center justify-between px-4 py-2 ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor("POST")}`}>POST</span>
                      <code className={`text-sm ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>/appeals/generate</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(codeExamples.generateAppeal, "appeal")}
                      className={`flex items-center gap-1 text-sm ${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                      {copiedCode === "appeal" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className={`p-4 overflow-x-auto text-sm ${isDark ? "bg-neutral-900 text-neutral-300" : "bg-white text-neutral-700"}`}>
                    <code>{codeExamples.generateAppeal}</code>
                  </pre>
                </div>
              </section>
            </div>

            {/* Sidebar - Endpoints */}
            <div>
              <div className={`rounded-2xl border sticky top-24 ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}>
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                    API Endpoints
                  </h3>
                </div>
                
                {/* Category Filter */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          selectedCategory === cat
                            ? isDark
                              ? "bg-teal-500/20 text-teal-400"
                              : "bg-teal-50 text-teal-700"
                            : isDark
                              ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Endpoints List */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredEndpoints.map((endpoint, i) => (
                    <div 
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
                      } border-b border-neutral-200 dark:border-neutral-800 last:border-b-0`}
                    >
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <code className={`text-xs truncate block ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                          {endpoint.path}
                        </code>
                        <p className={`text-xs truncate ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                          {endpoint.description}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 flex-shrink-0 ${isDark ? "text-neutral-600" : "text-neutral-400"}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Support CTA */}
          <div className={`mt-16 rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${isDark ? "bg-teal-500/20" : "bg-teal-100"}`}>
                  <FileCode className={`h-8 w-8 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                    Need Help?
                  </h3>
                  <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Our developer support team is here to help you integrate
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="mailto:developers@clarityclaim.ai"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark 
                      ? "bg-teal-500 text-white hover:bg-teal-600" 
                      : "bg-teal-600 text-white hover:bg-teal-700"
                  }`}
                >
                  Contact Developer Support
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiDocsPage;
