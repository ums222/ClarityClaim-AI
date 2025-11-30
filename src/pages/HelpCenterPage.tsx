import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Search, 
  Book, 
  Video, 
  MessageCircle,
  FileText,
  Settings,
  Shield,
  Zap,
  Users,
  ChevronRight,
  Mail,
  Phone
} from "lucide-react";

const HelpCenterPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "New to ClarityClaim AI? Start here.",
      articles: 12,
      color: "teal"
    },
    {
      icon: Settings,
      title: "Account & Settings",
      description: "Manage your account, users, and preferences.",
      articles: 8,
      color: "blue"
    },
    {
      icon: FileText,
      title: "Claims & Appeals",
      description: "Learn how to analyze claims and generate appeals.",
      articles: 15,
      color: "purple"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "HIPAA, SOC 2, and data security information.",
      articles: 6,
      color: "amber"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Add users, manage roles, and collaborate.",
      articles: 7,
      color: "green"
    },
    {
      icon: Book,
      title: "API Documentation",
      description: "Technical guides for developers.",
      articles: 10,
      color: "rose"
    }
  ];

  const popularArticles = [
    { title: "How to submit your first claim for analysis", category: "Getting Started", views: 3245 },
    { title: "Understanding denial risk scores", category: "Claims & Appeals", views: 2890 },
    { title: "Setting up EHR integration with Epic", category: "Integrations", views: 2456 },
    { title: "Generating appeal letters with AI", category: "Claims & Appeals", views: 2234 },
    { title: "Managing team member permissions", category: "Team Management", views: 1987 },
    { title: "Configuring payer-specific rules", category: "Settings", views: 1876 },
    { title: "Exporting reports and analytics", category: "Reports", views: 1654 },
    { title: "Understanding HIPAA compliance features", category: "Security", views: 1543 }
  ];

  const quickLinks = [
    { title: "Video Tutorials", icon: Video, href: "/webinars", description: "Watch step-by-step guides" },
    { title: "API Reference", icon: Book, href: "/api-docs", description: "Technical documentation" },
    { title: "Release Notes", icon: FileText, href: "#", description: "What's new in ClarityClaim AI" },
    { title: "Community Forum", icon: MessageCircle, href: "#", description: "Connect with other users" }
  ];

  const faqs = [
    {
      question: "How accurate is the denial prediction?",
      answer: "Our AI models achieve 94.2% prediction accuracy based on validation against historical claim outcomes. Accuracy varies by payer and claim type, with some categories reaching 97%+ accuracy."
    },
    {
      question: "How long does it take to integrate with our EHR?",
      answer: "Most EHR integrations are completed within 2-4 weeks. Epic and Cerner integrations typically take 2 weeks, while custom integrations may take longer depending on complexity."
    },
    {
      question: "Is my data secure and HIPAA compliant?",
      answer: "Yes. ClarityClaim AI is SOC 2 Type II certified and fully HIPAA compliant. All data is encrypted at rest and in transit, and we sign BAAs with all customers."
    },
    {
      question: "Can I customize the appeal letter templates?",
      answer: "Yes. While our AI generates custom appeals based on each denial, you can also create and manage your own templates, add standard paragraphs, and customize the tone and format."
    },
    {
      question: "What happens if I exceed my plan's claim limit?",
      answer: "You'll receive a notification when approaching your limit. You can either upgrade your plan or purchase additional claim capacity. We never cut off service mid-month."
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header with Search */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 md:p-12 mb-12 text-center`}>
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              How can we help you?
            </h1>
            <p className={`mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Search our knowledge base or browse categories below
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input 
                type="text"
                placeholder="Search for articles, guides, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl text-base ${isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"} border focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className={`p-4 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"} transition-colors`}
              >
                <link.icon className={`h-5 w-5 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <p className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{link.title}</p>
                <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>{link.description}</p>
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.title}
                  className={`p-5 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"} transition-colors cursor-pointer`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                        <category.icon className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {category.title}
                        </h3>
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {category.description}
                        </p>
                        <p className={`text-xs mt-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                          {category.articles} articles
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Articles & FAQs */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Popular Articles */}
            <div>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Popular Articles
              </h2>
              <div className={`rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"} overflow-hidden`}>
                {popularArticles.map((article, idx) => (
                  <div 
                    key={article.title}
                    className={`p-4 flex items-center justify-between ${isDark ? "hover:bg-slate-900/50" : "hover:bg-slate-50"} transition-colors cursor-pointer ${idx !== popularArticles.length - 1 ? `border-b ${isDark ? "border-slate-800" : "border-slate-200"}` : ""}`}
                  >
                    <div>
                      <p className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                        {article.title}
                      </p>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                        {article.category} • {article.views.toLocaleString()} views
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details 
                    key={faq.question}
                    className={`rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} group`}
                  >
                    <summary className={`p-4 cursor-pointer list-none flex items-center justify-between ${isDark ? "text-white" : "text-slate-900"} font-medium`}>
                      {faq.question}
                      <ChevronRight className={`h-4 w-4 transition-transform group-open:rotate-90 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                    </summary>
                    <div className={`px-4 pb-4 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8`}>
            <div className="text-center mb-8">
              <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Still Need Help?
              </h2>
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Our support team is here to help you succeed
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-xl text-center ${isDark ? "bg-slate-800" : "bg-white"}`}>
                <MessageCircle className={`h-8 w-8 mx-auto mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Live Chat</h3>
                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Chat with our support team in real-time
                </p>
                <button className={`text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                  Start Chat →
                </button>
              </div>
              <div className={`p-6 rounded-xl text-center ${isDark ? "bg-slate-800" : "bg-white"}`}>
                <Mail className={`h-8 w-8 mx-auto mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Email Support</h3>
                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  We'll respond within 24 hours
                </p>
                <a href="mailto:support@clarityclaim.ai" className={`text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                  support@clarityclaim.ai →
                </a>
              </div>
              <div className={`p-6 rounded-xl text-center ${isDark ? "bg-slate-800" : "bg-white"}`}>
                <Phone className={`h-8 w-8 mx-auto mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Phone Support</h3>
                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Available Mon-Fri, 9 AM - 6 PM ET
                </p>
                <a href="tel:+15551234567" className={`text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                  +1 (555) 123-4567 →
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
