import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Target, Heart, Users, TrendingUp, Building } from "lucide-react";

const AboutPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const values = [
    {
      icon: Heart,
      title: "Patient-Centered",
      description: "Every denied claim represents a patient who may not receive the care they need. We're driven by the mission to ensure patients get the coverage they deserve."
    },
    {
      icon: Target,
      title: "Accuracy First",
      description: "Our AI models are trained to be precise and reliable. We'd rather decline to make a prediction than make an inaccurate one."
    },
    {
      icon: Users,
      title: "Healthcare Equity",
      description: "We believe every healthcare organization, from rural clinics to major health systems, deserves access to cutting-edge claims technology."
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      description: "Healthcare regulations and payer rules constantly evolve. So do we. Our models learn and adapt to stay ahead of industry changes."
    }
  ];

  const stats = [
    { value: "$250M+", label: "Revenue Recovered" },
    { value: "500+", label: "Healthcare Organizations" },
    { value: "87%", label: "Appeal Success Rate" },
    { value: "35%", label: "Denial Rate Reduction" }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former Chief Medical Information Officer at a major health system. 15+ years in healthcare IT and revenue cycle management.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Michael Roberts",
      role: "CTO & Co-Founder",
      bio: "Previously led AI/ML teams at Google Health. PhD in Machine Learning from Stanford with a focus on healthcare applications.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Jennifer Martinez",
      role: "Chief Revenue Officer",
      bio: "20+ years in healthcare revenue cycle. Former VP of Revenue Cycle at Cleveland Clinic.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "David Park",
      role: "VP of Engineering",
      bio: "Former engineering lead at Epic Systems. Expert in healthcare interoperability and EHR integrations.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              About ClarityClaim AI
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Fighting Claim Denials with AI
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              We're on a mission to end the $25.7 billion problem of healthcare claim denials. Using advanced AI, we help healthcare organizations predict, prevent, and appeal denials—recovering millions in lost revenue.
            </p>
          </div>

          {/* Stats */}
          <div className={`rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"} p-8 mb-16`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-3xl md:text-4xl font-bold mb-1 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Story */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Our Story
                </h2>
                <div className={`space-y-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  <p>
                    ClarityClaim AI was founded in 2022 by healthcare and technology veterans who witnessed firsthand the devastating impact of claim denials on healthcare organizations and patients.
                  </p>
                  <p>
                    Dr. Sarah Chen, our CEO, spent 15 years watching hospitals struggle with denial rates that consumed countless staff hours and left millions of dollars on the table. Michael Roberts, our CTO, knew that modern AI could transform this broken process.
                  </p>
                  <p>
                    Together, they built a platform that doesn't just react to denials—it predicts and prevents them. By analyzing millions of claims and understanding the complex web of payer rules, ClarityClaim AI helps healthcare organizations get paid for the care they provide.
                  </p>
                </div>
              </div>
              <div className={`rounded-2xl overflow-hidden ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                  alt="Healthcare team collaboration"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-neutral-900"}`}>
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div 
                  key={value.title}
                  className={`p-6 rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
                      <value.icon className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                        {value.title}
                      </h3>
                      <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Team */}
          <div className="mb-16">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-neutral-900"}`}>
              Leadership Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div 
                  key={member.name}
                  className={`p-6 rounded-2xl border text-center ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}
                >
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-neutral-900"}`}>
                    {member.name}
                  </h3>
                  <p className={`text-sm font-medium mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                    {member.role}
                  </p>
                  <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Backed By */}
          <div className={`rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"} p-8 text-center`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                Backed by Leading Healthcare Investors
              </h2>
            </div>
            <p className={`mb-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              We're proud to be supported by investors who share our vision for transforming healthcare revenue cycle management.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {["Andreessen Horowitz", "General Catalyst", "Oak HC/FT", "GV"].map((investor) => (
                <span 
                  key={investor}
                  className={`text-lg font-semibold ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
                >
                  {investor}
                </span>
              ))}
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
