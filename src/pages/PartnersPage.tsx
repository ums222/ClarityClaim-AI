import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Handshake, 
  Building2, 
  Code, 
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Users,
  Zap,
  Award
} from "lucide-react";

const PartnersPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const partnerTypes = [
    {
      icon: Building2,
      title: "Technology Partners",
      description: "EHR vendors, clearinghouses, and healthcare IT companies looking to enhance their offerings with AI-powered claims capabilities.",
      benefits: [
        "Pre-built integration APIs",
        "Co-marketing opportunities",
        "Technical support & training",
        "Revenue sharing programs"
      ],
      cta: "Become a Tech Partner"
    },
    {
      icon: Users,
      title: "Referral Partners",
      description: "Healthcare consultants, RCM advisors, and industry experts who want to recommend ClarityClaim AI to their clients.",
      benefits: [
        "Competitive referral fees",
        "Sales enablement resources",
        "Dedicated partner manager",
        "Priority support for referrals"
      ],
      cta: "Join Referral Program"
    },
    {
      icon: Code,
      title: "Implementation Partners",
      description: "Healthcare IT consultants and system integrators who specialize in revenue cycle implementations.",
      benefits: [
        "Implementation certification",
        "Technical documentation",
        "Partner portal access",
        "Lead sharing opportunities"
      ],
      cta: "Become Implementation Partner"
    },
    {
      icon: GraduationCap,
      title: "Academic Partners",
      description: "Research institutions and universities interested in collaborating on healthcare AI research and innovation.",
      benefits: [
        "Research data access",
        "Joint publication opportunities",
        "Student internship programs",
        "Grant collaboration"
      ],
      cta: "Explore Research Partnerships"
    }
  ];

  const currentPartners = [
    { name: "Epic", type: "Technology" },
    { name: "Cerner", type: "Technology" },
    { name: "Availity", type: "Technology" },
    { name: "Change Healthcare", type: "Technology" },
    { name: "Waystar", type: "Technology" },
    { name: "KLAS Research", type: "Research" },
    { name: "HFMA", type: "Industry" },
    { name: "MGMA", type: "Industry" }
  ];

  const partnerStats = [
    { label: "Active Partners", value: "75+", icon: Users },
    { label: "Joint Customers", value: "200+", icon: Building2 },
    { label: "Partner Revenue", value: "$5M+", icon: DollarSign },
    { label: "Integrations", value: "50+", icon: Zap }
  ];

  const testimonials = [
    {
      quote: "Partnering with ClarityClaim AI has allowed us to offer our clients a complete revenue cycle solution. The integration was seamless and the results speak for themselves.",
      author: "Mike Johnson",
      role: "VP of Partnerships",
      company: "HealthTech Solutions"
    },
    {
      quote: "The referral program has been incredibly rewarding. Our clients love the product, and the partner support team is always responsive.",
      author: "Sarah Williams",
      role: "RCM Consultant",
      company: "Revenue Cycle Advisors"
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
              <Handshake className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                Partner Program
              </span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Partner With Us
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Join our partner ecosystem and help healthcare organizations transform their revenue cycle with AI. Together, we can deliver better outcomes for providers and patients.
            </p>
          </div>

          {/* Partner Stats */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-16`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partnerStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  <p className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{stat.value}</p>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Types */}
          <div className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Partnership Opportunities
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {partnerTypes.map((type) => (
                <div 
                  key={type.title}
                  className={`p-6 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}
                >
                  <div className={`p-3 rounded-xl inline-block mb-4 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                    <type.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {type.title}
                  </h3>
                  <p className={`mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {type.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                        <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => window.location.href = '/#contact'}
                    className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}
                  >
                    {type.cta}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Current Partners */}
          <div className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Our Partners
            </h2>
            <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8`}>
              <div className="flex flex-wrap justify-center gap-6">
                {currentPartners.map((partner) => (
                  <div 
                    key={partner.name}
                    className={`px-6 py-3 rounded-xl ${isDark ? "bg-slate-800" : "bg-white shadow-sm"}`}
                  >
                    <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{partner.name}</span>
                    <span className={`ml-2 text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>{partner.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partner Testimonials */}
          <div className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              What Our Partners Say
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.author}
                  className={`p-6 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
                >
                  <p className={`text-lg mb-6 italic ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{testimonial.author}</p>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Benefits Summary */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-16`}>
            <h2 className={`text-xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Why Partner With ClarityClaim AI?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Award className={`h-8 w-8 mx-auto mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Market Leader</h3>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Partner with the leading AI-powered claims management platform in healthcare.
                </p>
              </div>
              <div className="text-center">
                <DollarSign className={`h-8 w-8 mx-auto mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Revenue Opportunity</h3>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Earn competitive commissions and grow your business with our partner programs.
                </p>
              </div>
              <div className="text-center">
                <Users className={`h-8 w-8 mx-auto mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Dedicated Support</h3>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Get a dedicated partner manager and access to our partner success team.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <Handshake className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Ready to Partner?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Let's discuss how we can work together to transform healthcare revenue cycle management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => window.location.href = '/#contact'}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}
              >
                Apply to Partner Program
              </button>
              <a 
                href="mailto:partners@clarityclaim.ai"
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-slate-300 text-slate-700 hover:bg-slate-100"}`}
              >
                Contact Partner Team
              </a>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PartnersPage;
