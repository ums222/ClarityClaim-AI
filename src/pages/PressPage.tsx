import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Calendar, 
  ExternalLink, 
  Download, 
  Mail,
  Award,
  TrendingUp,
  Users
} from "lucide-react";

const PressPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pressReleases = [
    {
      date: "November 15, 2025",
      title: "ClarityClaim AI Raises $50M Series B to Expand AI-Powered Healthcare Claims Platform",
      excerpt: "Funding led by Andreessen Horowitz will accelerate product development and market expansion.",
      link: "#"
    },
    {
      date: "October 3, 2025",
      title: "ClarityClaim AI Achieves HITRUST CSF Certification",
      excerpt: "Company demonstrates commitment to healthcare data security with industry-leading certification.",
      link: "#"
    },
    {
      date: "September 12, 2025",
      title: "ClarityClaim AI Partners with Epic Systems for EHR Integration",
      excerpt: "New partnership enables seamless integration with Epic's MyChart and revenue cycle modules.",
      link: "#"
    },
    {
      date: "August 1, 2025",
      title: "ClarityClaim AI Launches Health Equity Analytics Dashboard",
      excerpt: "New feature helps healthcare organizations identify and address disparities in claim denials.",
      link: "#"
    },
    {
      date: "June 15, 2025",
      title: "ClarityClaim AI Named to Forbes AI 50 List",
      excerpt: "Recognition highlights company's innovative approach to healthcare revenue cycle management.",
      link: "#"
    }
  ];

  const mediaHighlights = [
    {
      outlet: "TechCrunch",
      title: "ClarityClaim AI is using GPT-4 to fight healthcare's $25B denial problem",
      date: "November 2025",
      link: "#"
    },
    {
      outlet: "Healthcare IT News",
      title: "AI startup tackles prior authorization bottlenecks",
      date: "October 2025",
      link: "#"
    },
    {
      outlet: "Modern Healthcare",
      title: "Revenue cycle AI: The next frontier in healthcare automation",
      date: "September 2025",
      link: "#"
    },
    {
      outlet: "Becker's Health IT",
      title: "10 revenue cycle startups to watch in 2025",
      date: "August 2025",
      link: "#"
    },
    {
      outlet: "HIMSS",
      title: "Case Study: AI-powered appeals at Regional Medical Center",
      date: "July 2025",
      link: "#"
    },
    {
      outlet: "Forbes",
      title: "These AI startups are transforming healthcare operations",
      date: "June 2025",
      link: "#"
    }
  ];

  const awards = [
    { year: "2025", award: "Forbes AI 50", description: "Most promising AI companies in America" },
    { year: "2025", award: "CB Insights Digital Health 150", description: "Top digital health startups" },
    { year: "2025", award: "KLAS Points of Light", description: "Healthcare IT innovation recognition" },
    { year: "2024", award: "Healthcare Innovation Award", description: "Best AI/ML solution in healthcare" }
  ];

  const companyStats = [
    { label: "Revenue Recovered", value: "$250M+", icon: TrendingUp },
    { label: "Healthcare Organizations", value: "500+", icon: Users },
    { label: "Team Members", value: "50+", icon: Users },
    { label: "Funding Raised", value: "$75M", icon: Award }
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Newsroom
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Press & Media
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              News, press releases, and media resources about ClarityClaim AI.
            </p>
          </div>

          {/* Company Stats */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-12`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {companyStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  <p className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{stat.value}</p>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Press Releases */}
              <div>
                <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Press Releases
                </h2>
                <div className="space-y-4">
                  {pressReleases.map((release) => (
                    <article 
                      key={release.title}
                      className={`p-6 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"} transition-colors`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{release.date}</span>
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {release.title}
                      </h3>
                      <p className={`text-sm mb-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {release.excerpt}
                      </p>
                      <a 
                        href={release.link}
                        className={`inline-flex items-center gap-1 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}
                      >
                        Read More
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              {/* Media Coverage */}
              <div>
                <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Media Coverage
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {mediaHighlights.map((article) => (
                    <a 
                      key={article.title}
                      href={article.link}
                      className={`p-5 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"} transition-colors block`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold uppercase ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                          {article.outlet}
                        </span>
                        <ExternalLink className={`h-3 w-3 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                      </div>
                      <h3 className={`font-medium mb-2 line-clamp-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {article.title}
                      </h3>
                      <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>{article.date}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Awards */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6`}>
                <div className="flex items-center gap-2 mb-4">
                  <Award className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Awards & Recognition</h3>
                </div>
                <div className="space-y-4">
                  {awards.map((award) => (
                    <div key={award.award} className={`pb-4 border-b ${isDark ? "border-slate-800" : "border-slate-200"} last:border-0 last:pb-0`}>
                      <span className={`text-xs ${isDark ? "text-teal-400" : "text-teal-600"}`}>{award.year}</span>
                      <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{award.award}</p>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>{award.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Kit */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6`}>
                <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Media Kit</h3>
                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Download logos, executive headshots, and company information for media use.
                </p>
                <button className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}>
                  <Download className="h-4 w-4" />
                  Download Media Kit
                </button>
              </div>

              {/* Press Contact */}
              <div className={`rounded-xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-6`}>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Press Inquiries</h3>
                </div>
                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  For media inquiries, interview requests, or press information, please contact our communications team.
                </p>
                <a 
                  href="mailto:press@clarityclaim.ai"
                  className={`block w-full text-center px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}
                >
                  press@clarityclaim.ai
                </a>
              </div>

              {/* Boilerplate */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6`}>
                <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>About ClarityClaim AI</h3>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  ClarityClaim AI is the leading AI-powered healthcare claims management platform, helping healthcare organizations predict denials, optimize submissions, and automate appeals. Founded in 2022 and headquartered in San Francisco, the company has helped over 500 healthcare organizations recover more than $250 million in revenue. For more information, visit clarityclaim.ai.
                </p>
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
