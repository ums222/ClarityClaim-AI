import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Search, 
  CheckCircle2, 
  ArrowRight,
  Plug,
  Zap,
  Shield,
  Clock,
  ExternalLink
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  features: string[];
  status: "available" | "coming-soon" | "beta";
}

const integrations: Integration[] = [
  {
    id: "epic",
    name: "Epic Systems",
    category: "EHR",
    description: "Seamless integration with Epic EHR for real-time denial prediction and claim validation.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Real-time claim validation", "Embedded workflow", "ADT notifications", "Revenue cycle integration"],
    status: "available"
  },
  {
    id: "cerner",
    name: "Cerner",
    category: "EHR",
    description: "Deep integration with Cerner Millennium for automated claims optimization.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Claim scrubbing", "Prior auth automation", "Appeal generation", "Analytics dashboard"],
    status: "available"
  },
  {
    id: "meditech",
    name: "Meditech",
    category: "EHR",
    description: "Integration with Meditech Expanse for claims management and denial prevention.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Batch claim processing", "Denial analytics", "Appeal workflows", "Custom reporting"],
    status: "available"
  },
  {
    id: "allscripts",
    name: "Allscripts",
    category: "EHR",
    description: "Connect ClarityClaim AI with Allscripts Sunrise and Professional EHR.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Claim validation", "Documentation review", "Appeal generation", "Payer rules engine"],
    status: "available"
  },
  {
    id: "athenahealth",
    name: "athenahealth",
    category: "EHR",
    description: "Integration with athenaOne for cloud-native claims management.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["API integration", "Real-time validation", "Denial prediction", "Performance analytics"],
    status: "available"
  },
  {
    id: "change-healthcare",
    name: "Change Healthcare",
    category: "Clearinghouse",
    description: "Connect to Change Healthcare for enhanced claim submission and tracking.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["EDI 837/835", "Real-time eligibility", "Claim status tracking", "Remittance processing"],
    status: "available"
  },
  {
    id: "availity",
    name: "Availity",
    category: "Clearinghouse",
    description: "Seamless integration with Availity for multi-payer connectivity.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Payer connectivity", "Eligibility verification", "Prior auth", "Claim submission"],
    status: "available"
  },
  {
    id: "waystar",
    name: "Waystar",
    category: "Clearinghouse",
    description: "Integration with Waystar for end-to-end revenue cycle management.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Unified platform", "Denial management", "Patient payments", "Analytics"],
    status: "available"
  },
  {
    id: "unitedhealth",
    name: "UnitedHealthcare",
    category: "Payer",
    description: "Direct payer connection for real-time authorization and claim status.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Prior auth automation", "Real-time eligibility", "Claim status API", "EOB processing"],
    status: "available"
  },
  {
    id: "anthem",
    name: "Anthem Blue Cross",
    category: "Payer",
    description: "Direct integration with Anthem for streamlined claims and authorizations.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Authorization portal", "Claim submission", "Status tracking", "Appeal submission"],
    status: "available"
  },
  {
    id: "aetna",
    name: "Aetna",
    category: "Payer",
    description: "Connect directly to Aetna for automated authorization and claims.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Prior auth API", "Eligibility check", "Claims API", "Provider portal"],
    status: "available"
  },
  {
    id: "cigna",
    name: "Cigna",
    category: "Payer",
    description: "Integration with Cigna for real-time verification and claims processing.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Real-time eligibility", "Prior auth", "Claims submission", "Appeal tracking"],
    status: "beta"
  },
  {
    id: "humana",
    name: "Humana",
    category: "Payer",
    description: "Direct connection to Humana for Medicare Advantage and commercial claims.",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
    features: ["Medicare processing", "Eligibility API", "Prior authorization", "Claims status"],
    status: "coming-soon"
  }
];

const categories = ["All", "EHR", "Clearinghouse", "Payer"];

const IntegrationsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return isDark ? "bg-green-500/20 text-green-400" : "bg-green-50 text-green-700";
      case "beta":
        return isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-700";
      case "coming-soon":
        return isDark ? "bg-neutral-700 text-neutral-400" : "bg-neutral-100 text-neutral-600";
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
              Integrations
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Connect Your Healthcare Stack
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              ClarityClaim AI integrates with your existing EHR, clearinghouse, and payer systems for seamless claims management.
            </p>
          </div>

          {/* Integration Benefits */}
          <div className={`rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"} p-8 mb-12`}>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`p-3 rounded-xl inline-block mb-3 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                  <Plug className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                </div>
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>Easy Setup</h3>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Most integrations live in minutes</p>
              </div>
              <div className="text-center">
                <div className={`p-3 rounded-xl inline-block mb-3 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                  <Zap className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                </div>
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>Real-Time Sync</h3>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Automatic bi-directional data flow</p>
              </div>
              <div className="text-center">
                <div className={`p-3 rounded-xl inline-block mb-3 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                  <Shield className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                </div>
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>HIPAA Compliant</h3>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Secure, encrypted connections</p>
              </div>
              <div className="text-center">
                <div className={`p-3 rounded-xl inline-block mb-3 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                  <Clock className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                </div>
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>24/7 Monitoring</h3>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Proactive issue detection</p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  isDark 
                    ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500" 
                    : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400"
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? isDark
                        ? "bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30"
                        : "bg-teal-50 text-teal-700 ring-1 ring-teal-500/30"
                      : isDark
                        ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredIntegrations.map((integration) => (
              <div 
                key={integration.id}
                className={`rounded-2xl border p-6 transition-all hover:shadow-lg ${
                  isDark ? "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700" : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                      <Plug className={`h-6 w-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                        {integration.name}
                      </h3>
                      <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                        {integration.category}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusBadge(integration.status)}`}>
                    {integration.status === "coming-soon" ? "Coming Soon" : integration.status}
                  </span>
                </div>

                <p className={`text-sm mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  {integration.description}
                </p>

                <div className="space-y-2 mb-4">
                  {integration.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    integration.status === "available"
                      ? isDark 
                        ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30" 
                        : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                      : isDark
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  }`}
                  disabled={integration.status !== "available"}
                >
                  {integration.status === "available" ? (
                    <>Learn More <ArrowRight className="h-4 w-4" /></>
                  ) : integration.status === "beta" ? (
                    <>Join Beta <ArrowRight className="h-4 w-4" /></>
                  ) : (
                    "Coming Soon"
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Custom Integration CTA */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Don't See Your System?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              We're constantly adding new integrations. Contact us about custom integrations for your healthcare stack.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/api-docs"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? "bg-teal-500 text-white hover:bg-teal-600" 
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                View API Docs
                <ExternalLink className="h-4 w-4" />
              </a>
              <a 
                href="mailto:integrations@clarityclaim.ai"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? "border border-neutral-700 text-neutral-300 hover:bg-neutral-800" 
                    : "border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                Request Integration
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IntegrationsPage;
