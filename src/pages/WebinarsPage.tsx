import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Video, 
  Calendar, 
  Clock, 
  Play,
  Bell,
  User
} from "lucide-react";

const WebinarsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedCategory, setSelectedCategory] = useState("All");

  const upcomingWebinars = [
    {
      id: 1,
      title: "AI-Powered Denial Prevention: A Practical Guide for 2025",
      description: "Learn how to implement AI-driven denial prevention strategies that deliver measurable ROI. Includes live demo and Q&A.",
      date: "December 5, 2025",
      time: "2:00 PM ET",
      duration: "60 min",
      speakers: [
        { name: "Dr. Sarah Chen", role: "CEO, ClarityClaim AI" },
        { name: "Jennifer Martinez", role: "CRO, ClarityClaim AI" }
      ],
      category: "Product Demo",
      registrants: 245
    },
    {
      id: 2,
      title: "Prior Authorization Automation: Reducing Delays & Improving Patient Care",
      description: "Discover how healthcare organizations are automating prior authorization to reduce delays and improve patient outcomes.",
      date: "December 12, 2025",
      time: "1:00 PM ET",
      duration: "45 min",
      speakers: [
        { name: "Michael Roberts", role: "CTO, ClarityClaim AI" }
      ],
      category: "Best Practices",
      registrants: 189
    },
    {
      id: 3,
      title: "Health Equity in Revenue Cycle: Using Data to Drive Equitable Outcomes",
      description: "Explore how analytics can identify and address disparities in claim denials across patient populations.",
      date: "December 19, 2025",
      time: "11:00 AM ET",
      duration: "60 min",
      speakers: [
        { name: "Dr. Sarah Chen", role: "CEO, ClarityClaim AI" },
        { name: "Dr. Marcus Williams", role: "Health Equity Advisor" }
      ],
      category: "Industry Trends",
      registrants: 312
    }
  ];

  const onDemandWebinars = [
    {
      id: 4,
      title: "Getting Started with ClarityClaim AI: Complete Platform Overview",
      description: "A comprehensive walkthrough of the ClarityClaim AI platform, including setup, configuration, and best practices.",
      date: "Recorded November 2025",
      duration: "45 min",
      views: 1245,
      category: "Product Demo",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Writing Winning Appeals: AI-Assisted Strategies That Work",
      description: "Learn the art and science of crafting effective appeal letters with AI assistance. Real examples from successful appeals.",
      date: "Recorded October 2025",
      duration: "55 min",
      views: 2890,
      category: "Best Practices",
      thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "2025 Revenue Cycle Trends: What Healthcare Leaders Need to Know",
      description: "Industry experts discuss the top trends shaping healthcare revenue cycle management in 2025 and beyond.",
      date: "Recorded September 2025",
      duration: "60 min",
      views: 3567,
      category: "Industry Trends",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7,
      title: "HIPAA Compliance in the Age of AI: Best Practices",
      description: "Understanding compliance requirements when using AI for healthcare claims management.",
      date: "Recorded August 2025",
      duration: "50 min",
      views: 2134,
      category: "Compliance",
      thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8,
      title: "Case Study: How Regional Medical Center Achieved 40% Denial Reduction",
      description: "A deep dive into the strategies and implementation that led to dramatic improvement in denial rates.",
      date: "Recorded July 2025",
      duration: "40 min",
      views: 1876,
      category: "Case Studies",
      thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 9,
      title: "API Integration Deep Dive: Technical Best Practices",
      description: "Technical session for developers on integrating ClarityClaim AI API into healthcare applications.",
      date: "Recorded June 2025",
      duration: "75 min",
      views: 987,
      category: "Technical",
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const categories = ["All", "Product Demo", "Best Practices", "Industry Trends", "Compliance", "Case Studies", "Technical"];

  const filteredOnDemand = selectedCategory === "All" 
    ? onDemandWebinars 
    : onDemandWebinars.filter(w => w.category === selectedCategory);

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark ? "bg-teal-500/20" : "bg-teal-50"}`}>
              <Video className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                Learning Center
              </span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Webinars & Events
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Join our experts for live sessions and on-demand content about healthcare claims optimization and AI innovation.
            </p>
          </div>

          {/* Upcoming Webinars */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Upcoming Live Webinars
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingWebinars.map((webinar) => (
                <div 
                  key={webinar.id}
                  className={`p-6 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-700"}`}>
                          {webinar.category}
                        </span>
                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                          {webinar.registrants} registered
                        </span>
                      </div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {webinar.title}
                      </h3>
                      <p className={`mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {webinar.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="flex items-center gap-2 text-sm">
                          <Calendar className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                          <span className={isDark ? "text-slate-300" : "text-slate-700"}>{webinar.date}</span>
                        </span>
                        <span className="flex items-center gap-2 text-sm">
                          <Clock className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                          <span className={isDark ? "text-slate-300" : "text-slate-700"}>{webinar.time} • {webinar.duration}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>Speakers:</span>
                        {webinar.speakers.map((speaker, idx) => (
                          <span key={speaker.name} className="flex items-center gap-2">
                            <User className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                            <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              {speaker.name}
                            </span>
                            {idx < webinar.speakers.length - 1 && <span className={isDark ? "text-slate-600" : "text-slate-400"}>•</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                        Register Now
                      </button>
                      <button className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-slate-300 text-slate-700 hover:bg-slate-100"}`}>
                        <Bell className="h-4 w-4" />
                        Set Reminder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-Demand Webinars */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Play className={`h-5 w-5 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  On-Demand Library
                </h2>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === category 
                      ? isDark 
                        ? "bg-teal-500 text-white" 
                        : "bg-teal-600 text-white"
                      : isDark 
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Webinar Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOnDemand.map((webinar) => (
                <div 
                  key={webinar.id}
                  className={`rounded-xl overflow-hidden border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} hover:shadow-lg transition-shadow cursor-pointer group`}
                >
                  <div className="relative h-40">
                    <img 
                      src={webinar.thumbnail} 
                      alt={webinar.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`p-3 rounded-full bg-teal-500 text-white`}>
                        <Play className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                      {webinar.duration}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                        {webinar.category}
                      </span>
                      <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                        {webinar.views.toLocaleString()} views
                      </span>
                    </div>
                    <h3 className={`font-semibold mb-2 line-clamp-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {webinar.title}
                    </h3>
                    <p className={`text-sm mb-3 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {webinar.description}
                    </p>
                    <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                      {webinar.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className={`mt-16 rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <Bell className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Never Miss a Webinar
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Subscribe to get notified about upcoming webinars, new on-demand content, and exclusive events.
            </p>
            <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"} border focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              <button className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WebinarsPage;
