import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Handshake, 
  Building, 
  Users, 
  DollarSign, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Award,
  HeadphonesIcon
} from "lucide-react";

interface PartnerType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  benefits: string[];
  ideal: string;
}

const partnerTypes: PartnerType[] = [
  {
    id: "referral",
    title: "Referral Partner",
    description: "Earn revenue by referring healthcare organizations to ClarityClaim AI.",
    icon: Users,
    benefits: [
      "10-20% referral commission",
      "No minimum commitment",
      "Marketing support materials",
      "Deal registration protection",
      "Quarterly partner payments"
    ],
    ideal: "Healthcare consultants, advisors, and industry professionals with existing relationships"
  },
  {
    id: "reseller",
    title: "Reseller Partner",
    description: "Sell ClarityClaim AI as part of your solution portfolio with wholesale pricing.",
    icon: Building,
    benefits: [
      "Wholesale pricing discounts",
      "Co-branded solutions",
      "Sales and technical training",
      "Dedicated partner manager",
      "Joint marketing opportunities"
    ],
    ideal: "Healthcare IT vendors, revenue cycle service providers, and managed services companies"
  },
  {
    id: "technology",
    title: "Technology Partner",
    description: "Integrate ClarityClaim AI with your platform to deliver enhanced value to customers.",
    icon: Zap,
    benefits: [
      "API access and documentation",
      "Technical integration support",
      "Joint product development",
      "Co-marketing programs",
      "Partner directory listing"
    ],
    ideal: "EHR vendors, practice management systems, clearinghouses, and healthcare platforms"
  },
  {
    id: "consulting",
    title: "Consulting Partner",
    description: "Implement and optimize ClarityClaim AI for healthcare organizations.",
    icon: Award,
    benefits: [
      "Implementation certification",
      "Priority support access",
      "Revenue share on services",
      "Training and enablement",
      "Customer referrals"
    ],
    ideal: "Healthcare consulting firms, revenue cycle specialists, and implementation partners"
  }
];

const existingPartners = [
  { name: "Epic Systems", type: "Technology" },
  { name: "Cerner", type: "Technology" },
  { name: "Change Healthcare", type: "Technology" },
  { name: "Availity", type: "Technology" },
  { name: "Advisory Board", type: "Consulting" },
  { name: "Huron Consulting", type: "Consulting" },
  { name: "KLAS Research", type: "Referral" },
  { name: "HFMA", type: "Association" }
];

const partnerBenefits = [
  {
    icon: DollarSign,
    title: "Revenue Opportunities",
    description: "Earn commissions, margins, or service revenue through partnership"
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Access to partner success team and priority technical support"
  },
  {
    icon: Globe,
    title: "Marketing Resources",
    description: "Co-branded materials, case studies, and joint marketing campaigns"
  },
  {
    icon: Award,
    title: "Training & Certification",
    description: "Comprehensive training programs and partner certifications"
  }
];

const PartnersPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Partner Program
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Partner With ClarityClaim AI
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Join our partner ecosystem and help healthcare organizations recover billions in denied claims 
              while growing your business.
            </p>
          </div>

          {/* Partner Benefits Overview */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-16`}>
            <h2 className={`text-xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Why Partner With Us
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnerBenefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className={`p-3 rounded-xl inline-block mb-4 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                    <benefit.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {benefit.title}
                  </h3>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Types */}
          <div className="mb-16">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Partnership Options
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {partnerTypes.map((type) => (
                <div 
                  key={type.id}
                  className={`rounded-2xl border p-6 ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                      <type.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {type.title}
                      </h3>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {type.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className={`text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Benefits:
                    </h4>
                    <ul className="space-y-2">
                      {type.benefits.map((benefit, i) => (
                        <li key={i} className={`flex items-center gap-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-3 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      <span className="font-medium">Ideal for:</span> {type.ideal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Partners */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-16`}>
            <h2 className={`text-xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Our Partner Ecosystem
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {existingPartners.map((partner) => (
                <div 
                  key={partner.name}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}`}
                >
                  <Building className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {partner.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${isDark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                    {partner.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              How to Become a Partner
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Apply", description: "Submit your partnership application" },
                { step: "2", title: "Connect", description: "Meet with our partnerships team" },
                { step: "3", title: "Onboard", description: "Complete training and certification" },
                { step: "4", title: "Launch", description: "Start earning and growing together" }
              ].map((step) => (
                <div key={step.step} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-600"
                  }`}>
                    <span className="text-xl font-bold">{step.step}</span>
                  </div>
                  <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={`rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <Handshake className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Ready to Partner?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Join our partner ecosystem and help healthcare organizations transform their revenue cycle 
              with AI-powered claims management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:partners@clarityclaim.ai"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? "bg-teal-500 text-white hover:bg-teal-600" 
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </a>
              <a 
                href="mailto:partners@clarityclaim.ai"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? "border border-slate-700 text-slate-300 hover:bg-slate-800" 
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Contact Partnerships Team
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
