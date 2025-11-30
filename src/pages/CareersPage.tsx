import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Heart, 
  Users, 
  Zap,
  Globe,
  Building,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const jobs: Job[] = [
  {
    id: "senior-ml-engineer",
    title: "Senior Machine Learning Engineer",
    department: "Engineering",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    description: "Build and deploy ML models that predict claim denials and generate appeals. Work with healthcare data at scale.",
    requirements: [
      "5+ years ML/AI experience",
      "Python, TensorFlow/PyTorch",
      "Healthcare or NLP experience preferred",
      "MS/PhD in CS, Statistics, or related field"
    ]
  },
  {
    id: "full-stack-engineer",
    title: "Full Stack Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    description: "Build intuitive interfaces for healthcare professionals. Work across our React/Node.js stack.",
    requirements: [
      "4+ years full-stack experience",
      "React, TypeScript, Node.js",
      "Experience with healthcare systems a plus",
      "Strong UI/UX sensibility"
    ]
  },
  {
    id: "healthcare-data-scientist",
    title: "Healthcare Data Scientist",
    department: "Data Science",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    description: "Analyze healthcare claims data to identify patterns and improve our AI models' accuracy.",
    requirements: [
      "3+ years data science experience",
      "Healthcare domain knowledge required",
      "SQL, Python, statistical analysis",
      "Experience with claims/billing data"
    ]
  },
  {
    id: "customer-success-manager",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote (US)",
    type: "Full-time",
    description: "Help healthcare organizations maximize value from ClarityClaim AI. Own customer relationships end-to-end.",
    requirements: [
      "3+ years customer success in SaaS/healthcare",
      "Strong communication skills",
      "Revenue cycle experience preferred",
      "Ability to travel occasionally"
    ]
  },
  {
    id: "product-manager",
    title: "Senior Product Manager",
    department: "Product",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    description: "Define product strategy for our claims management platform. Work closely with customers and engineering.",
    requirements: [
      "5+ years product management",
      "Healthcare technology experience",
      "Data-driven decision making",
      "Technical background preferred"
    ]
  },
  {
    id: "sales-executive",
    title: "Enterprise Sales Executive",
    department: "Sales",
    location: "Remote (US)",
    type: "Full-time",
    description: "Sell ClarityClaim AI to health systems and large medical groups. Build relationships with C-suite executives.",
    requirements: [
      "5+ years enterprise healthcare sales",
      "Track record closing $500K+ deals",
      "Revenue cycle/HIT experience",
      "Existing health system relationships"
    ]
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Healthcare Coverage",
    description: "Comprehensive medical, dental, and vision for you and your family"
  },
  {
    icon: Zap,
    title: "Equity Package",
    description: "Meaningful equity so you share in our success"
  },
  {
    icon: Globe,
    title: "Remote-First",
    description: "Work from anywhere in the US with flexible hours"
  },
  {
    icon: Users,
    title: "Team Events",
    description: "Quarterly team gatherings and annual company retreats"
  },
  {
    icon: Clock,
    title: "Unlimited PTO",
    description: "Take the time you need to recharge and be your best"
  },
  {
    icon: Building,
    title: "Learning Budget",
    description: "$2,000/year for courses, conferences, and professional development"
  }
];

const values = [
  {
    title: "Patient Impact",
    description: "Every claim we help process means a patient gets the care they need."
  },
  {
    title: "Move Fast",
    description: "Healthcare can't wait. We ship early, learn fast, and iterate."
  },
  {
    title: "Data-Driven",
    description: "We let the data guide our decisions, not assumptions."
  },
  {
    title: "Transparency",
    description: "Open communication across the company. No surprises."
  }
];

const CareersPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const departments = ["All", ...Array.from(new Set(jobs.map(job => job.department)))];
  
  const filteredJobs = selectedDepartment === "All" 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment);

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Hero */}
          <div className="text-center mb-16">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Join Our Team
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Help Us Transform Healthcare
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              We're building AI that helps healthcare organizations recover billions in denied claims. 
              Join a mission-driven team making healthcare more accessible for everyone.
            </p>
          </div>

          {/* Stats */}
          <div className={`rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"} p-8 mb-16`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className={`text-3xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>50+</p>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Team Members</p>
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>$45M</p>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Series B Funding</p>
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>500+</p>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Customers</p>
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>$250M+</p>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Revenue Recovered</p>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-neutral-900"}`}>
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div 
                  key={value.title}
                  className={`p-6 rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-neutral-900"}`}>
              Benefits & Perks
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.title}
                  className={`flex items-start gap-4 p-6 rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}
                >
                  <div className={`p-3 rounded-xl ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                    <benefit.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-neutral-900"}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-neutral-900"}`}>
              Open Positions
            </h2>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDepartment === dept
                      ? isDark
                        ? "bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30"
                        : "bg-teal-50 text-teal-700 ring-1 ring-teal-500/30"
                      : isDark
                        ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  className={`rounded-2xl border overflow-hidden ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}
                >
                  <button
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                          {job.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-200 text-neutral-600"}`}>
                          {job.department}
                        </span>
                      </div>
                      <div className={`flex flex-wrap items-center gap-4 text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    {expandedJob === job.id ? (
                      <ChevronUp className={`h-5 w-5 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                    ) : (
                      <ChevronDown className={`h-5 w-5 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                    )}
                  </button>
                  
                  {expandedJob === job.id && (
                    <div className={`px-6 pb-6 pt-2 border-t ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                      <p className={`mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                        {job.description}
                      </p>
                      <div className="mb-4">
                        <h4 className={`font-medium mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                          Requirements:
                        </h4>
                        <ul className={`list-disc pl-5 space-y-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                          {job.requirements.map((req, i) => (
                            <li key={i} className="text-sm">{req}</li>
                          ))}
                        </ul>
                      </div>
                      <a 
                        href={`mailto:careers@clarityclaim.ai?subject=Application: ${job.title}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isDark 
                            ? "bg-teal-500 text-white hover:bg-teal-600" 
                            : "bg-teal-600 text-white hover:bg-teal-700"
                        }`}
                      >
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Don't See the Right Role?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              We're always looking for talented people who are passionate about healthcare and AI. 
              Send us your resume and tell us how you'd like to contribute.
            </p>
            <a 
              href="mailto:careers@clarityclaim.ai"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isDark 
                  ? "bg-teal-500 text-white hover:bg-teal-600" 
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareersPage;
