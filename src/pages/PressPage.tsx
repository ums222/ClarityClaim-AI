import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Calendar, 
  ExternalLink, 
  Download, 
  Mail,
  FileText,
  Image,
  ArrowRight
} from "lucide-react";

interface PressRelease {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
}

interface MediaCoverage {
  id: string;
  outlet: string;
  title: string;
  date: string;
  url: string;
  logo: string;
}

const pressReleases: PressRelease[] = [
  {
    id: "series-b",
    title: "ClarityClaim AI Raises $45M Series B to Accelerate AI-Powered Healthcare Claims Management",
    date: "November 15, 2025",
    excerpt: "Funding led by Andreessen Horowitz will fuel expansion into new markets and advance AI capabilities for denial prevention.",
    category: "Funding"
  },
  {
    id: "500-customers",
    title: "ClarityClaim AI Surpasses 500 Healthcare Organization Customers",
    date: "October 28, 2025",
    excerpt: "Milestone reflects growing demand for AI-powered claims management solutions across health systems, hospitals, and medical groups.",
    category: "Milestone"
  },
  {
    id: "epic-integration",
    title: "ClarityClaim AI Announces Deep Integration with Epic Systems",
    date: "September 10, 2025",
    excerpt: "New integration enables seamless workflow for Epic users, with real-time denial prediction directly in the EHR.",
    category: "Product"
  },
  {
    id: "hipaa-certification",
    title: "ClarityClaim AI Achieves HITRUST CSF Certification",
    date: "August 5, 2025",
    excerpt: "Certification demonstrates commitment to the highest standards of healthcare data security and compliance.",
    category: "Security"
  },
  {
    id: "appeal-ai",
    title: "ClarityClaim AI Launches GPT-4 Powered Appeal Generation",
    date: "July 20, 2025",
    excerpt: "New AI engine generates personalized appeal letters in seconds, achieving 87% success rate in pilot programs.",
    category: "Product"
  }
];

const mediaCoverage: MediaCoverage[] = [
  {
    id: "techcrunch",
    outlet: "TechCrunch",
    title: "ClarityClaim AI is using GPT-4 to help hospitals fight claim denials",
    date: "November 15, 2025",
    url: "#",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "forbes",
    outlet: "Forbes",
    title: "How AI Is Transforming Healthcare Revenue Cycle Management",
    date: "October 30, 2025",
    url: "#",
    logo: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "healthcare-it-news",
    outlet: "Healthcare IT News",
    title: "ClarityClaim AI helps health system recover $3.2M in denied claims",
    date: "October 15, 2025",
    url: "#",
    logo: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "modern-healthcare",
    outlet: "Modern Healthcare",
    title: "AI-powered denial management: The next frontier in revenue cycle",
    date: "September 25, 2025",
    url: "#",
    logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=100&q=80"
  }
];

const companyFacts = [
  { label: "Founded", value: "2022" },
  { label: "Headquarters", value: "San Francisco, CA" },
  { label: "Employees", value: "50+" },
  { label: "Customers", value: "500+" },
  { label: "Revenue Recovered", value: "$250M+" },
  { label: "Total Funding", value: "$60M" }
];

const PressPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Press & Media
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
              News & Press Releases
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              The latest news, announcements, and media coverage about ClarityClaim AI.
            </p>
          </div>

          {/* Company Facts */}
          <div className={`rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"} p-8 mb-16`}>
            <h2 className={`text-xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-neutral-900"}`}>
              Company at a Glance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {companyFacts.map((fact) => (
                <div key={fact.label} className="text-center">
                  <p className={`text-2xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                    {fact.value}
                  </p>
                  <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Press Releases */}
            <div className="lg:col-span-2">
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
                Press Releases
              </h2>
              <div className="space-y-4">
                {pressReleases.map((release) => (
                  <div 
                    key={release.id}
                    className={`rounded-xl border p-6 transition-all hover:shadow-lg ${
                      isDark ? "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700" : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                        {release.category}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                        <Calendar className="h-3 w-3" />
                        {release.date}
                      </span>
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                      {release.title}
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {release.excerpt}
                    </p>
                    <button className={`flex items-center gap-1 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Media Coverage */}
              <div>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Media Coverage
                </h2>
                <div className="space-y-3">
                  {mediaCoverage.map((coverage) => (
                    <a 
                      key={coverage.id}
                      href={coverage.url}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                        isDark ? "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700" : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex-shrink-0 ${isDark ? "bg-neutral-800" : "bg-neutral-100"} flex items-center justify-center`}>
                        <FileText className={`h-5 w-5 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                          {coverage.outlet}
                        </p>
                        <p className={`text-sm font-medium line-clamp-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                          {coverage.title}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                          {coverage.date}
                        </p>
                      </div>
                      <ExternalLink className={`h-4 w-4 flex-shrink-0 ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Press Kit */}
              <div className={`rounded-xl border p-6 ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Press Kit
                </h3>
                <p className={`text-sm mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Download logos, product screenshots, and executive headshots.
                </p>
                <div className="space-y-2">
                  <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark 
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700" 
                      : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  }`}>
                    <Image className="h-4 w-4" />
                    Logo Package
                    <Download className="h-4 w-4 ml-auto" />
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark 
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700" 
                      : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  }`}>
                    <Image className="h-4 w-4" />
                    Product Screenshots
                    <Download className="h-4 w-4 ml-auto" />
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark 
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700" 
                      : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  }`}>
                    <FileText className="h-4 w-4" />
                    Company Fact Sheet
                    <Download className="h-4 w-4 ml-auto" />
                  </button>
                </div>
              </div>

              {/* Media Contact */}
              <div className={`rounded-xl border p-6 ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"}`}>
                <Mail className={`h-8 w-8 mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Media Contact
                </h3>
                <p className={`text-sm mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  For press inquiries, interview requests, or additional information:
                </p>
                <a 
                  href="mailto:press@clarityclaim.ai"
                  className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}
                >
                  press@clarityclaim.ai
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

export default PressPage;
