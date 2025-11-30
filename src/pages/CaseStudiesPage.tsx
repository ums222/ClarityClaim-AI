import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  ArrowRight,
  Building,
  TrendingUp,
  CheckCircle2,
  Quote
} from "lucide-react";

interface CaseStudy {
  id: string;
  organization: string;
  type: string;
  logo: string;
  headline: string;
  summary: string;
  metrics: {
    label: string;
    value: string;
    description: string;
  }[];
  quote: {
    text: string;
    author: string;
    role: string;
  };
  challenges: string[];
  solutions: string[];
  image: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "regional-health-system",
    organization: "Regional Health System",
    type: "Health System",
    logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=100&q=80",
    headline: "Regional Health System Reduces Denials by 42% and Recovers $3.2M",
    summary: "A 12-hospital health system in the Midwest implemented ClarityClaim AI to tackle their $15M annual denial problem. Within 6 months, they achieved dramatic improvements across all denial metrics.",
    metrics: [
      { label: "Denial Rate Reduction", value: "42%", description: "From 14.2% to 8.2%" },
      { label: "Revenue Recovered", value: "$3.2M", description: "In first 12 months" },
      { label: "Appeal Success Rate", value: "89%", description: "Up from 45%" },
      { label: "Time Savings", value: "1,200 hrs", description: "Staff hours per month" }
    ],
    quote: {
      text: "ClarityClaim AI transformed our revenue cycle. We're catching issues before submission and winning appeals we would have lost before. The ROI has been incredible.",
      author: "Jennifer Thompson",
      role: "VP of Revenue Cycle"
    },
    challenges: [
      "14.2% denial rate costing $15M annually",
      "Manual appeal process with 45% success rate",
      "Staff overwhelmed with denial management",
      "Limited visibility into denial patterns"
    ],
    solutions: [
      "Implemented AI-powered denial prediction",
      "Automated appeal letter generation",
      "Real-time denial analytics dashboard",
      "Integration with Epic EHR system"
    ],
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "community-hospital",
    organization: "Mercy Community Hospital",
    type: "Community Hospital",
    logo: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=100&q=80",
    headline: "Community Hospital Saves $890K Annually with AI-Powered Appeals",
    summary: "A 200-bed community hospital struggled with denials from their primary commercial payers. ClarityClaim AI helped them identify patterns and generate winning appeals.",
    metrics: [
      { label: "Annual Savings", value: "$890K", description: "Net revenue impact" },
      { label: "Appeal Volume", value: "-65%", description: "Due to prevention" },
      { label: "Processing Time", value: "4 hrs", description: "Down from 3 days" },
      { label: "Clean Claim Rate", value: "97%", description: "Up from 82%" }
    ],
    quote: {
      text: "As a community hospital, every dollar matters. ClarityClaim AI paid for itself in the first month. Now we can focus on patient care instead of fighting with payers.",
      author: "Dr. Michael Chen",
      role: "Chief Medical Officer"
    },
    challenges: [
      "Limited revenue cycle staff (3 FTEs)",
      "High denial rates from major payers",
      "Manual processes taking 3 days per appeal",
      "Difficulty tracking appeal outcomes"
    ],
    solutions: [
      "AI identifies high-risk claims before submission",
      "Auto-generated appeals reduce manual work by 80%",
      "Payer-specific rule engine catches common issues",
      "Comprehensive analytics for CFO reporting"
    ],
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "multispecialty-practice",
    organization: "Pacific Multispecialty Group",
    type: "Medical Group",
    logo: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=100&q=80",
    headline: "50-Physician Practice Achieves 94% First-Pass Claim Rate",
    summary: "A large multispecialty group with 50 physicians and 12 locations was losing significant revenue to preventable denials. ClarityClaim AI transformed their claims process.",
    metrics: [
      { label: "First-Pass Rate", value: "94%", description: "Up from 76%" },
      { label: "Days in A/R", value: "-18", description: "Reduced from 45 to 27" },
      { label: "Revenue Increase", value: "+12%", description: "Year over year" },
      { label: "ROI", value: "8.5x", description: "Return on investment" }
    ],
    quote: {
      text: "We used to submit claims and hope for the best. Now we know exactly which claims need attention before they're submitted. It's like having a crystal ball for denials.",
      author: "Sarah Martinez",
      role: "Practice Administrator"
    },
    challenges: [
      "12 locations with inconsistent coding practices",
      "76% first-pass claim rate",
      "45 days average in A/R",
      "No centralized denial management"
    ],
    solutions: [
      "Pre-submission validation across all locations",
      "Standardized coding recommendations",
      "Centralized denial dashboard",
      "Automated payer rule updates"
    ],
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80"
  }
];

const CaseStudiesPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // State for future modal/detail view functionality
  const [_selectedStudy, _setSelectedStudy] = useState<CaseStudy | null>(null);
  void _selectedStudy; void _setSelectedStudy;

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Case Studies
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Real Results from Real Customers
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              See how healthcare organizations are using ClarityClaim AI to reduce denials, 
              recover revenue, and transform their revenue cycle operations.
            </p>
          </div>

          {/* Summary Stats */}
          <div className={`rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"} p-8 mb-16`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className={`text-3xl md:text-4xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>$250M+</p>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Revenue Recovered</p>
              </div>
              <div>
                <p className={`text-3xl md:text-4xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>35%</p>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Avg Denial Reduction</p>
              </div>
              <div>
                <p className={`text-3xl md:text-4xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>87%</p>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Appeal Success Rate</p>
              </div>
              <div>
                <p className={`text-3xl md:text-4xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>500+</p>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Organizations</p>
              </div>
            </div>
          </div>

          {/* Case Studies */}
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <div 
                key={study.id}
                className={`rounded-2xl border overflow-hidden ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}
              >
                <div className={`grid md:grid-cols-2 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  {/* Image */}
                  <div className="h-64 md:h-auto">
                    <img 
                      src={study.image} 
                      alt={study.organization}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Building className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                      <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                        {study.type}
                      </span>
                    </div>

                    <h2 className={`text-xl md:text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                      {study.headline}
                    </h2>

                    <p className={`mb-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {study.summary}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {study.metrics.map((metric) => (
                        <div key={metric.label}>
                          <p className={`text-2xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                            {metric.value}
                          </p>
                          <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                            {metric.label}
                          </p>
                          <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                            {metric.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Quote */}
                    <div className={`p-4 rounded-xl ${isDark ? "bg-neutral-800" : "bg-white"}`}>
                      <Quote className={`h-6 w-6 mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                      <p className={`text-sm italic mb-3 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                        "{study.quote.text}"
                      </p>
                      <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                        {study.quote.author}
                      </p>
                      <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                        {study.quote.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <div className={`grid md:grid-cols-2 gap-6 p-6 md:p-8 border-t ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                  <div>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                      <TrendingUp className={`h-4 w-4 ${isDark ? "text-red-400" : "text-red-600"}`} />
                      Challenges
                    </h3>
                    <ul className="space-y-2">
                      {study.challenges.map((challenge, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-red-400" : "bg-red-500"}`} />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                      <CheckCircle2 className={`h-4 w-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                      Solutions
                    </h3>
                    <ul className="space-y-2">
                      {study.solutions.map((solution, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? "text-green-400" : "text-green-600"}`} />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={`mt-16 rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Ready to Write Your Success Story?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Join hundreds of healthcare organizations recovering millions in denied claims with ClarityClaim AI.
            </p>
            <a 
              href="/#contact"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isDark 
                  ? "bg-teal-500 text-white hover:bg-teal-600" 
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              Request a Demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
