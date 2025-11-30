import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Zap, 
  GraduationCap,
  DollarSign,
  Home,
  Plane,
  HeartPulse,
  ArrowRight,
  Building2
} from "lucide-react";

const CareersPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const benefits = [
    { icon: HeartPulse, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision coverage for you and your family" },
    { icon: DollarSign, title: "Competitive Compensation", description: "Top-of-market salary with equity participation for all employees" },
    { icon: Home, title: "Remote-First", description: "Work from anywhere with flexible hours and home office stipend" },
    { icon: GraduationCap, title: "Learning & Development", description: "$5,000 annual learning budget plus conference attendance" },
    { icon: Plane, title: "Unlimited PTO", description: "Take the time you need with our unlimited vacation policy" },
    { icon: Users, title: "Team Offsites", description: "Quarterly team gatherings in exciting locations" }
  ];

  const values = [
    { icon: Heart, title: "Patient-First", description: "Every line of code we write helps patients get the care they deserve." },
    { icon: Zap, title: "Move Fast", description: "We ship quickly, iterate constantly, and aren't afraid to take calculated risks." },
    { icon: Users, title: "Transparency", description: "We default to openness in communication, metrics, and decision-making." }
  ];

  const openPositions = [
    {
      title: "Senior Machine Learning Engineer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      description: "Build and optimize ML models for healthcare claim prediction and denial prevention."
    },
    {
      title: "Full Stack Engineer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      description: "Develop our React + Node.js platform that processes millions of healthcare claims."
    },
    {
      title: "Healthcare Data Scientist",
      department: "Data Science",
      location: "Remote (US)",
      type: "Full-time",
      description: "Analyze healthcare claims data to uncover patterns and improve our AI models."
    },
    {
      title: "Product Manager - Platform",
      department: "Product",
      location: "Remote (US)",
      type: "Full-time",
      description: "Define and execute product strategy for our core claims management platform."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote (US)",
      type: "Full-time",
      description: "Partner with healthcare organizations to maximize their success with ClarityClaim AI."
    },
    {
      title: "Revenue Cycle Consultant",
      department: "Professional Services",
      location: "Remote (US)",
      type: "Full-time",
      description: "Advise healthcare clients on RCM best practices and platform implementation."
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      description: "Build and maintain our HIPAA-compliant cloud infrastructure on AWS."
    },
    {
      title: "Technical Writer",
      department: "Product",
      location: "Remote (US)",
      type: "Full-time",
      description: "Create clear, comprehensive documentation for our platform and APIs."
    }
  ];

  const departments = [
    { name: "All Departments", count: openPositions.length },
    { name: "Engineering", count: 3 },
    { name: "Product", count: 2 },
    { name: "Data Science", count: 1 },
    { name: "Customer Success", count: 1 },
    { name: "Professional Services", count: 1 }
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Join Our Team
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Build the Future of Healthcare
            </h1>
            <p className={`text-lg max-w-3xl mx-auto mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              We're on a mission to solve the $25.7 billion problem of healthcare claim denials. Join our team of engineers, data scientists, and healthcare experts transforming revenue cycle management with AI.
            </p>
            <a 
              href="#open-positions"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}
            >
              View Open Positions
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Stats */}
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 mb-16`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className={`text-3xl md:text-4xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>50+</p>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Team Members</p>
              </div>
              <div>
                <p className={`text-3xl md:text-4xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>12</p>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Countries</p>
              </div>
              <div>
                <p className={`text-3xl md:text-4xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>$50M+</p>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Funding Raised</p>
              </div>
              <div>
                <p className={`text-3xl md:text-4xl font-bold ${isDark ? "text-teal-400" : "text-teal-600"}`}>4.8</p>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Glassdoor Rating</p>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value) => (
                <div 
                  key={value.title}
                  className={`p-6 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}
                >
                  <div className={`p-3 rounded-xl inline-block mb-4 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                    <value.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {value.title}
                  </h3>
                  <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Benefits & Perks
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.title}
                  className={`p-6 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <benefit.icon className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {benefit.title}
                      </h3>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div id="open-positions" className="scroll-mt-24">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              Open Positions
            </h2>
            
            {/* Department Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {departments.map((dept) => (
                <button 
                  key={dept.name}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    dept.name === "All Departments" 
                      ? isDark 
                        ? "bg-teal-500 text-white" 
                        : "bg-teal-600 text-white"
                      : isDark 
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {dept.name} ({dept.count})
                </button>
              ))}
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {openPositions.map((job) => (
                <div 
                  key={job.title}
                  className={`p-6 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"} transition-colors cursor-pointer`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {job.title}
                      </h3>
                      <p className={`text-sm mb-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1 text-sm">
                          <Building2 className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                          <span className={isDark ? "text-slate-400" : "text-slate-600"}>{job.department}</span>
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                          <span className={isDark ? "text-slate-400" : "text-slate-600"}>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                          <span className={isDark ? "text-slate-400" : "text-slate-600"}>{job.type}</span>
                        </span>
                      </div>
                    </div>
                    <button className={`flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}>
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Don't See Your Role? */}
          <div className={`mt-16 rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <Briefcase className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Don't See Your Role?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              We're always looking for talented people to join our team. Send us your resume and tell us how you'd like to contribute to our mission.
            </p>
            <a 
              href="mailto:careers@clarityclaim.ai?subject=General%20Application"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800"}`}
            >
              Send Us Your Resume
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
