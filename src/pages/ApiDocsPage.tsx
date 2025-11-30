import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Code, 
  Shield, 
  Book, 
  Zap, 
  CheckCircle2,
  Copy,
  Terminal,
  FileJson,
  Lock,
  Clock
} from "lucide-react";

const ApiDocsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const apiFeatures = [
    { icon: Zap, title: "RESTful API", description: "Clean, predictable URLs and JSON responses" },
    { icon: Shield, title: "HIPAA Compliant", description: "All endpoints are secured and audited" },
    { icon: Clock, title: "99.99% Uptime", description: "Enterprise-grade reliability SLA" },
    { icon: Lock, title: "OAuth 2.0", description: "Industry-standard authentication" }
  ];

  const endpoints = [
    {
      category: "Claims",
      items: [
        { method: "POST", path: "/v1/claims/analyze", description: "Analyze a claim for denial risk" },
        { method: "GET", path: "/v1/claims/{claim_id}", description: "Get claim details and analysis" },
        { method: "POST", path: "/v1/claims/batch", description: "Submit multiple claims for analysis" },
        { method: "GET", path: "/v1/claims/{claim_id}/history", description: "Get claim processing history" }
      ]
    },
    {
      category: "Appeals",
      items: [
        { method: "POST", path: "/v1/appeals/generate", description: "Generate an appeal letter" },
        { method: "GET", path: "/v1/appeals/{appeal_id}", description: "Get appeal details" },
        { method: "PUT", path: "/v1/appeals/{appeal_id}", description: "Update appeal status" },
        { method: "GET", path: "/v1/appeals/{appeal_id}/letter", description: "Download appeal letter" }
      ]
    },
    {
      category: "Validation",
      items: [
        { method: "POST", path: "/v1/validate/claim", description: "Validate claim before submission" },
        { method: "POST", path: "/v1/validate/prior-auth", description: "Check prior authorization requirements" },
        { method: "GET", path: "/v1/validate/eligibility", description: "Verify patient eligibility" }
      ]
    },
    {
      category: "Analytics",
      items: [
        { method: "GET", path: "/v1/analytics/denials", description: "Get denial analytics and trends" },
        { method: "GET", path: "/v1/analytics/revenue", description: "Get revenue recovery metrics" },
        { method: "GET", path: "/v1/analytics/equity", description: "Get equity analytics data" }
      ]
    }
  ];

  const codeExamples = {
    analyze: `curl -X POST https://api.clarityclaim.ai/v1/claims/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "claim_id": "CLM-2025-001234",
    "patient": {
      "mrn": "MRN12345",
      "dob": "1985-03-15",
      "insurance_id": "INS789456"
    },
    "payer_id": "BCBS_CA",
    "service_date": "2025-11-15",
    "cpt_codes": ["99213", "71046"],
    "icd10_codes": ["J06.9", "R05.9"],
    "total_charges": 450.00
  }'`,
    response: `{
  "claim_id": "CLM-2025-001234",
  "analysis": {
    "denial_risk_score": 0.23,
    "risk_level": "LOW",
    "confidence": 0.94
  },
  "issues": [],
  "recommendations": [
    {
      "type": "INFO",
      "message": "Claim appears clean for submission",
      "code": "READY_TO_SUBMIT"
    }
  ],
  "payer_rules_checked": 47,
  "processing_time_ms": 245
}`,
    appeal: `curl -X POST https://api.clarityclaim.ai/v1/appeals/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "claim_id": "CLM-2025-001234",
    "denial_code": "CO-4",
    "denial_reason": "Missing modifier",
    "include_clinical_refs": true,
    "tone": "professional"
  }'`,
    appealResponse: `{
  "appeal_id": "APL-2025-005678",
  "claim_id": "CLM-2025-001234",
  "letter": {
    "content": "Dear Appeals Department...\\n\\n[Generated appeal letter content]",
    "format": "text",
    "word_count": 487
  },
  "citations": [
    {
      "source": "CMS LCD L35062",
      "relevance": 0.95
    }
  ],
  "success_probability": 0.87,
  "generated_at": "2025-11-28T14:30:00Z"
}`
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
              <Code className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                Developer Documentation
              </span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              API Documentation
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Integrate ClarityClaim AI into your healthcare applications with our RESTful API. Full HL7 FHIR R4 support included.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {apiFeatures.map((feature) => (
              <div 
                key={feature.title}
                className={`p-4 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
              >
                <feature.icon className={`h-5 w-5 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <p className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{feature.title}</p>
                <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Getting Started */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-12`}>
            <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Getting Started
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-600"} font-bold text-sm`}>
                  1
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Get Your API Key</h3>
                  <p className={`text-sm mb-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Sign up for a ClarityClaim AI account and generate your API key from the dashboard.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/#contact'}
                    className={`text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}
                  >
                    Request API Access →
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-600"} font-bold text-sm`}>
                  2
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Base URL</h3>
                  <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    All API requests should be made to:
                  </p>
                  <code className={`block p-3 rounded-lg text-sm font-mono ${isDark ? "bg-slate-800 text-teal-400" : "bg-slate-900 text-teal-400"}`}>
                    https://api.clarityclaim.ai/v1
                  </code>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-600"} font-bold text-sm`}>
                  3
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Authentication</h3>
                  <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Include your API key in the Authorization header:
                  </p>
                  <code className={`block p-3 rounded-lg text-sm font-mono ${isDark ? "bg-slate-800 text-teal-400" : "bg-slate-900 text-teal-400"}`}>
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              API Endpoints
            </h2>
            
            <div className="space-y-6">
              {endpoints.map((category) => (
                <div key={category.category} className={`rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"} overflow-hidden`}>
                  <div className={`px-6 py-4 ${isDark ? "bg-slate-900" : "bg-slate-50"} border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                    <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{category.category}</h3>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {category.items.map((endpoint) => (
                      <div 
                        key={endpoint.path}
                        className={`px-6 py-4 flex items-center justify-between ${isDark ? "hover:bg-slate-900/50" : "hover:bg-slate-50"} transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                            endpoint.method === "GET" 
                              ? "bg-green-500/20 text-green-500"
                              : endpoint.method === "POST"
                              ? "bg-blue-500/20 text-blue-500"
                              : "bg-amber-500/20 text-amber-500"
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className={`text-sm font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            {endpoint.path}
                          </code>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm hidden md:block ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                            {endpoint.description}
                          </span>
                          <button 
                            onClick={() => copyToClipboard(endpoint.path, endpoint.path)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                          >
                            {copiedEndpoint === endpoint.path ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Examples */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Code Examples
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Analyze Claim */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"} overflow-hidden`}>
                <div className={`px-4 py-3 flex items-center justify-between ${isDark ? "bg-slate-900" : "bg-slate-50"} border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                  <div className="flex items-center gap-2">
                    <Terminal className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                    <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Analyze Claim</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(codeExamples.analyze, 'analyze')}
                    className={`p-1.5 rounded transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                  >
                    {copiedEndpoint === 'analyze' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                    )}
                  </button>
                </div>
                <pre className={`p-4 overflow-x-auto text-xs font-mono ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-900 text-slate-300"}`}>
                  {codeExamples.analyze}
                </pre>
              </div>

              {/* Response */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"} overflow-hidden`}>
                <div className={`px-4 py-3 flex items-center justify-between ${isDark ? "bg-slate-900" : "bg-slate-50"} border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                  <div className="flex items-center gap-2">
                    <FileJson className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                    <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Response</span>
                  </div>
                  <span className="text-xs text-green-500">200 OK</span>
                </div>
                <pre className={`p-4 overflow-x-auto text-xs font-mono ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-900 text-slate-300"}`}>
                  {codeExamples.response}
                </pre>
              </div>

              {/* Generate Appeal */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"} overflow-hidden`}>
                <div className={`px-4 py-3 flex items-center justify-between ${isDark ? "bg-slate-900" : "bg-slate-50"} border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                  <div className="flex items-center gap-2">
                    <Terminal className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                    <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Generate Appeal</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(codeExamples.appeal, 'appeal')}
                    className={`p-1.5 rounded transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                  >
                    {copiedEndpoint === 'appeal' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                    )}
                  </button>
                </div>
                <pre className={`p-4 overflow-x-auto text-xs font-mono ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-900 text-slate-300"}`}>
                  {codeExamples.appeal}
                </pre>
              </div>

              {/* Appeal Response */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"} overflow-hidden`}>
                <div className={`px-4 py-3 flex items-center justify-between ${isDark ? "bg-slate-900" : "bg-slate-50"} border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                  <div className="flex items-center gap-2">
                    <FileJson className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                    <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Response</span>
                  </div>
                  <span className="text-xs text-green-500">201 Created</span>
                </div>
                <pre className={`p-4 overflow-x-auto text-xs font-mono ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-900 text-slate-300"}`}>
                  {codeExamples.appealResponse}
                </pre>
              </div>
            </div>
          </div>

          {/* Rate Limits & SDKs */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className={`rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6`}>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Rate Limits</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Starter Plan</span>
                  <span className={`text-sm font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>100 req/min</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Professional Plan</span>
                  <span className={`text-sm font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>1,000 req/min</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Enterprise Plan</span>
                  <span className={`text-sm font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>Custom</span>
                </div>
              </div>
            </div>

            <div className={`rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6`}>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>SDKs Available</h3>
              <div className="flex flex-wrap gap-2">
                {["Python", "Node.js", "Java", ".NET", "Go", "Ruby"].map((sdk) => (
                  <span 
                    key={sdk}
                    className={`px-3 py-1.5 rounded-lg text-sm ${isDark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-700 shadow-sm"}`}
                  >
                    {sdk}
                  </span>
                ))}
              </div>
              <p className={`mt-4 text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                All SDKs are available on GitHub with MIT license.
              </p>
            </div>
          </div>

          {/* Support Section */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <Book className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Need Help?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Our developer support team is here to help you integrate ClarityClaim AI into your applications.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:developers@clarityclaim.ai"
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}
              >
                Contact Developer Support
              </a>
              <Link 
                to="/help"
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-slate-300 text-slate-700 hover:bg-slate-100"}`}
              >
                Visit Help Center
              </Link>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiDocsPage;
