import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  Quote
} from "lucide-react";

const CaseStudiesPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const caseStudies = [
    {
      id: 1,
      title: "Regional Medical Center Reduces Denial Rate by 40%",
      organization: "Regional Medical Center",
      type: "Health System",
      logo: null,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      metrics: [
        { label: "Denial Reduction", value: "40%", icon: TrendingUp },
        { label: "Revenue Recovered", value: "$4.2M", icon: DollarSign },
        { label: "Time Saved", value: "2,400 hrs/yr", icon: Clock }
      ],
      challenge: "With over 50,000 claims per month, Regional Medical Center was struggling with a 15% denial rate, costing them millions in lost revenue and requiring a team of 12 to manage appeals.",
      solution: "ClarityClaim AI was implemented to predict denials before submission and automate the appeal process for denied claims.",
      results: "Within 6 months, denial rates dropped to 9%, and the appeals team was able to focus on complex cases while AI handled routine appeals.",
      quote: "ClarityClaim AI transformed our revenue cycle. We went from firefighting denials to preventing them before they happen.",
      quotePerson: "Maria Rodriguez",
      quoteRole: "VP of Revenue Cycle",
      featured: true
    },
    {
      id: 2,
      title: "Multi-Site Physician Group Recovers $2.1M in First Year",
      organization: "Premier Physician Partners",
      type: "Physician Group",
      logo: null,
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80",
      metrics: [
        { label: "First-Pass Rate", value: "+28%", icon: TrendingUp },
        { label: "Revenue Recovered", value: "$2.1M", icon: DollarSign },
        { label: "Appeal Success", value: "89%", icon: CheckCircle2 }
      ],
      challenge: "A 40-physician multi-specialty group was losing revenue due to coding errors, missing authorizations, and slow appeals.",
      solution: "Pre-submission validation and AI-powered appeal generation helped catch issues before submission and respond to denials faster.",
      results: "First-pass acceptance rates improved by 28%, and the AI-generated appeals achieved an 89% success rate.",
      quote: "The ROI was clear within the first quarter. We're now spending less time on denials and more time on patient care.",
      quotePerson: "Dr. James Chen",
      quoteRole: "Chief Medical Officer",
      featured: false
    },
    {
      id: 3,
      title: "Rural Hospital Achieves Healthcare Equity Goals",
      organization: "Valley Community Hospital",
      type: "Critical Access Hospital",
      logo: null,
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
      metrics: [
        { label: "Disparity Reduction", value: "62%", icon: Users },
        { label: "Denial Rate", value: "8%", icon: TrendingUp },
        { label: "Annual Savings", value: "$890K", icon: DollarSign }
      ],
      challenge: "This rural critical access hospital discovered disparities in claim denials affecting underserved populations and needed to address equity while improving overall revenue cycle.",
      solution: "ClarityClaim AI's equity analytics identified patterns of disparate denial rates and helped the team develop targeted interventions.",
      results: "Denial disparities were reduced by 62%, overall denial rates dropped to 8%, and the hospital saved nearly $900K annually.",
      quote: "We weren't just improving our bottom line—we were ensuring all patients receive equitable access to care.",
      quotePerson: "Sarah Thompson",
      quoteRole: "CEO",
      featured: false
    },
    {
      id: 4,
      title: "Academic Medical Center Scales Appeals with AI",
      organization: "University Health Network",
      type: "Academic Medical Center",
      logo: null,
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      metrics: [
        { label: "Appeals Processed", value: "10x more", icon: TrendingUp },
        { label: "Revenue Recovered", value: "$12.8M", icon: DollarSign },
        { label: "Staff Efficiency", value: "+340%", icon: Users }
      ],
      challenge: "With complex cases and high claim volumes, the appeals backlog had grown to over 3,000 cases, with some waiting 90+ days for action.",
      solution: "AI-generated appeal letters reduced the time to process each appeal from 45 minutes to under 5 minutes.",
      results: "The backlog was cleared within 60 days, and the team now processes 10x more appeals with the same staff.",
      quote: "What used to take our team days now takes hours. The AI writes appeals that are better than what we were writing manually.",
      quotePerson: "Dr. Michael Park",
      quoteRole: "Director of Revenue Cycle",
      featured: false
    },
    {
      id: 5,
      title: "FQHC Network Improves First-Pass Rate by 35%",
      organization: "Community Health Alliance",
      type: "FQHC Network",
      logo: null,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      metrics: [
        { label: "First-Pass Rate", value: "+35%", icon: TrendingUp },
        { label: "Days in AR", value: "-22 days", icon: Clock },
        { label: "Revenue Increase", value: "$1.8M", icon: DollarSign }
      ],
      challenge: "A network of 12 FQHCs serving underserved communities was struggling with complex billing requirements and limited staff resources.",
      solution: "ClarityClaim AI's pre-submission validation and payer-specific rule engines ensured claims were clean before submission.",
      results: "First-pass acceptance improved by 35%, days in AR dropped by 22 days, and revenue increased by $1.8M annually.",
      quote: "As an FQHC, every dollar matters. ClarityClaim AI helps us maximize revenue so we can serve more patients.",
      quotePerson: "Linda Garcia",
      quoteRole: "CFO",
      featured: false
    }
  ];

  const featuredStudy = caseStudies.find(s => s.featured);
  const otherStudies = caseStudies.filter(s => !s.featured);

  const industries = [
    { name: "All Industries", count: caseStudies.length },
    { name: "Health Systems", count: 2 },
    { name: "Physician Groups", count: 1 },
    { name: "Rural/CAH", count: 1 },
    { name: "FQHCs", count: 1 }
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Success Stories
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Case Studies
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              See how healthcare organizations are transforming their revenue cycle with ClarityClaim AI.
            </p>
          </div>

          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {industries.map((industry) => (
              <button 
                key={industry.name}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  industry.name === "All Industries" 
                    ? isDark 
                      ? "bg-teal-500 text-white" 
                      : "bg-teal-600 text-white"
                    : isDark 
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {industry.name} ({industry.count})
              </button>
            ))}
          </div>

          {/* Featured Case Study */}
          {featuredStudy && (
            <div className={`rounded-2xl overflow-hidden border ${isDark ? "border-slate-800" : "border-slate-200"} mb-12`}>
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto">
                  <img 
                    src={featuredStudy.image} 
                    alt={featuredStudy.organization}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`p-8 ${isDark ? "bg-slate-900/50" : "bg-slate-50"}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-700"}`}>
                      Featured
                    </span>
                    <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                      {featuredStudy.type}
                    </span>
                  </div>
                  <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {featuredStudy.title}
                  </h2>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {featuredStudy.metrics.map((metric) => (
                      <div key={metric.label} className="text-center">
                        <p className={`text-xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>{metric.value}</p>
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  <p className={`mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {featuredStudy.challenge}
                  </p>
                  
                  <button className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                    Read Full Case Study
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Case Studies */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {otherStudies.map((study) => (
              <div 
                key={study.id}
                className={`rounded-xl overflow-hidden border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} hover:shadow-lg transition-shadow`}
              >
                <div className="h-48">
                  <img 
                    src={study.image} 
                    alt={study.organization}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{study.type}</span>
                  </div>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {study.title}
                  </h3>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {study.metrics.map((metric) => (
                      <div key={metric.label} className={`text-center p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                        <p className={`text-sm font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>{metric.value}</p>
                        <p className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  <div className={`p-4 rounded-lg ${isDark ? "bg-slate-800/50" : "bg-slate-50"} mb-4`}>
                    <Quote className={`h-4 w-4 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    <p className={`text-sm italic mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      "{study.quote}"
                    </p>
                    <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                      — {study.quotePerson}, {study.quoteRole}
                    </p>
                  </div>

                  <button className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                    Read Case Study
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Ready to Write Your Success Story?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Join hundreds of healthcare organizations using ClarityClaim AI to reduce denials, recover revenue, and improve patient care.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => {
                  window.location.href = '/#contact';
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}
              >
                Request a Demo
              </button>
              <Link 
                to="/about"
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-slate-300 text-slate-700 hover:bg-slate-100"}`}
              >
                Learn More About Us
              </Link>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
