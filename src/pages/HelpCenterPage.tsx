import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Search, 
  Book, 
  FileText, 
  Video, 
  MessageCircle, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
  Shield,
  CreditCard,
  Users,
  Settings
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "getting-started",
    question: "How do I get started with ClarityClaim AI?",
    answer: "Getting started is easy! After signing up, you'll be guided through a simple onboarding process. You can connect your EHR system, upload your first claims, and start seeing denial predictions within minutes. Our customer success team is available to help with setup.",
    category: "Getting Started"
  },
  {
    id: "integration",
    question: "What EHR systems do you integrate with?",
    answer: "We integrate with all major EHR systems including Epic, Cerner, Meditech, Allscripts, athenahealth, and eClinicalWorks. We also support direct integrations with major clearinghouses and payers. Custom integrations are available for Enterprise customers.",
    category: "Getting Started"
  },
  {
    id: "denial-prediction",
    question: "How accurate is the denial prediction?",
    answer: "Our AI models achieve 94% accuracy in predicting claim denials before submission. The system analyzes over 200 data points including diagnosis codes, procedure codes, payer rules, patient history, and historical denial patterns to make predictions.",
    category: "Features"
  },
  {
    id: "appeal-generation",
    question: "How does the AI generate appeals?",
    answer: "Our appeal generation engine uses GPT-4 trained on millions of successful appeals. It analyzes the denial reason, relevant medical documentation, and payer-specific guidelines to create compelling, customized appeal letters. You can edit and customize generated appeals before sending.",
    category: "Features"
  },
  {
    id: "data-security",
    question: "How do you protect my data?",
    answer: "We take security seriously. ClarityClaim AI is SOC 2 Type II certified, HIPAA compliant, and HITRUST certified. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We maintain strict access controls and undergo regular security audits.",
    category: "Security"
  },
  {
    id: "hipaa",
    question: "Is ClarityClaim AI HIPAA compliant?",
    answer: "Yes, ClarityClaim AI is fully HIPAA compliant. We sign Business Associate Agreements (BAAs) with all customers, implement required safeguards, and maintain comprehensive audit logs. Our compliance program is regularly reviewed and updated.",
    category: "Security"
  },
  {
    id: "pricing",
    question: "How is pricing determined?",
    answer: "Pricing is based on your organization type and claim volume. We offer Starter plans for small practices, Professional plans for regional health systems, and custom Enterprise pricing for large organizations. All plans include a 14-day free trial.",
    category: "Billing"
  },
  {
    id: "cancel",
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. Monthly plans can be canceled with 30 days notice. Annual plans can be canceled at the end of the contract period. We'll help you export your data when you leave.",
    category: "Billing"
  },
  {
    id: "team-access",
    question: "Can I add team members to my account?",
    answer: "Yes! You can invite unlimited team members on Professional and Enterprise plans. Each user can have different roles and permissions (Admin, Editor, Viewer). Starter plans include up to 5 users.",
    category: "Account"
  },
  {
    id: "support",
    question: "What support options are available?",
    answer: "Starter plans include email support (response within 24 hours). Professional plans include 24/7 priority support via chat, email, and phone. Enterprise plans include a dedicated success manager and custom SLAs.",
    category: "Support"
  }
];

const categories = [
  { id: "getting-started", name: "Getting Started", icon: Book, count: 2 },
  { id: "features", name: "Features", icon: Zap, count: 2 },
  { id: "security", name: "Security", icon: Shield, count: 2 },
  { id: "billing", name: "Billing", icon: CreditCard, count: 2 },
  { id: "account", name: "Account", icon: Users, count: 1 },
  { id: "support", name: "Support", icon: Settings, count: 1 },
];

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API reference",
    icon: Book,
    link: "/api-docs"
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step walkthrough videos",
    icon: Video,
    link: "#"
  },
  {
    title: "Knowledge Base",
    description: "In-depth articles and best practices",
    icon: FileText,
    link: "#"
  },
  {
    title: "Community Forum",
    description: "Connect with other users",
    icon: MessageCircle,
    link: "#"
  }
];

const HelpCenterPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Hero */}
          <div className="text-center mb-12">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Help Center
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              How Can We Help?
            </h1>
            <p className={`text-lg max-w-2xl mx-auto mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Find answers, guides, and support resources for using ClarityClaim AI.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border text-lg ${
                  isDark 
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" 
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm"
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {resources.map((resource) => (
              <Link
                key={resource.title}
                to={resource.link}
                className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${
                  isDark 
                    ? "border-slate-800 bg-slate-900/50 hover:border-slate-700" 
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className={`p-3 rounded-xl inline-block mb-4 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                  <resource.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {resource.title}
                </h3>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Categories and FAQs */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                Categories
              </h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                    !selectedCategory
                      ? isDark
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-teal-50 text-teal-700"
                      : isDark
                        ? "text-slate-400 hover:bg-slate-800"
                        : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    All Topics
                  </span>
                  <span className="text-sm">{faqs.length}</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.name
                        ? isDark
                          ? "bg-teal-500/20 text-teal-400"
                          : "bg-teal-50 text-teal-700"
                        : isDark
                          ? "text-slate-400 hover:bg-slate-800"
                          : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </span>
                    <span className="text-sm">{category.count}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* FAQs */}
            <div className="lg:col-span-3">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                Frequently Asked Questions
              </h2>
              
              {filteredFAQs.length === 0 ? (
                <div className={`text-center py-12 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                  <HelpCircle className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    No results found. Try a different search term.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFAQs.map((faq) => (
                    <div 
                      key={faq.id}
                      className={`rounded-xl border overflow-hidden ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <span className={`font-medium pr-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                          {faq.question}
                        </span>
                        {expandedFAQ === faq.id ? (
                          <ChevronUp className={`h-5 w-5 flex-shrink-0 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                        ) : (
                          <ChevronDown className={`h-5 w-5 flex-shrink-0 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                        )}
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className={`px-4 pb-4 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                          <p className={`pt-4 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className={`mt-16 rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${isDark ? "bg-teal-500/20" : "bg-teal-100"}`}>
                  <MessageCircle className={`h-8 w-8 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    Still Need Help?
                  </h3>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Our support team is here to assist you
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="mailto:support@clarityclaim.ai"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark 
                      ? "bg-teal-500 text-white hover:bg-teal-600" 
                      : "bg-teal-600 text-white hover:bg-teal-700"
                  }`}
                >
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a 
                  href="/status"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark 
                      ? "border border-slate-700 text-slate-300 hover:bg-slate-800" 
                      : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  System Status
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

export default HelpCenterPage;
