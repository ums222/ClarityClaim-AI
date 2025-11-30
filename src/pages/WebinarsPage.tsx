import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { 
  Calendar, 
  Clock, 
  Play, 
  Users, 
  ArrowRight,
  Video
} from "lucide-react";

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  speakers: {
    name: string;
    role: string;
    avatar: string;
  }[];
  type: "upcoming" | "on-demand";
  thumbnail: string;
  attendees?: number;
  topics: string[];
}

const webinars: Webinar[] = [
  {
    id: "ai-denial-prevention-2025",
    title: "AI-Powered Denial Prevention: Strategies for 2025",
    description: "Learn how leading health systems are using AI to predict and prevent denials before submission, achieving 35%+ reduction in denial rates.",
    date: "December 10, 2025",
    time: "2:00 PM EST",
    duration: "60 min",
    speakers: [
      {
        name: "Dr. Sarah Chen",
        role: "CEO, ClarityClaim AI",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Jennifer Thompson",
        role: "VP Revenue Cycle, Regional Health",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
      }
    ],
    type: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    attendees: 156,
    topics: ["Denial Prevention", "AI/ML", "Revenue Cycle"]
  },
  {
    id: "appeal-mastery",
    title: "Appeal Letter Mastery: Winning Strategies That Work",
    description: "Our analysis of 50,000+ successful appeals reveals the key elements that increase your chances of overturning denials.",
    date: "December 17, 2025",
    time: "1:00 PM EST",
    duration: "45 min",
    speakers: [
      {
        name: "Jennifer Martinez",
        role: "Chief Revenue Officer",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
      }
    ],
    type: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
    attendees: 89,
    topics: ["Appeals", "Best Practices", "Documentation"]
  },
  {
    id: "cms-changes-2025",
    title: "CMS 2025 Changes: What You Need to Know",
    description: "Breaking down the latest CMS regulatory changes and how they impact your claims management and denial strategies.",
    date: "November 20, 2025",
    time: "2:00 PM EST",
    duration: "60 min",
    speakers: [
      {
        name: "Dr. Sarah Chen",
        role: "CEO, ClarityClaim AI",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
      }
    ],
    type: "on-demand",
    thumbnail: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
    attendees: 342,
    topics: ["Regulatory", "CMS", "Compliance"]
  },
  {
    id: "prior-auth-automation",
    title: "Automating Prior Authorization: A Deep Dive",
    description: "Step-by-step guide to implementing automated prior authorization workflows that reduce turnaround time by 75%.",
    date: "November 5, 2025",
    time: "1:00 PM EST",
    duration: "45 min",
    speakers: [
      {
        name: "David Park",
        role: "VP of Engineering",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
      }
    ],
    type: "on-demand",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    attendees: 287,
    topics: ["Prior Auth", "Automation", "Workflow"]
  },
  {
    id: "denial-analytics",
    title: "Denial Analytics: Turning Data Into Action",
    description: "How to use denial analytics to identify patterns, track trends, and make data-driven decisions that improve your bottom line.",
    date: "October 15, 2025",
    time: "2:00 PM EST",
    duration: "50 min",
    speakers: [
      {
        name: "Michael Roberts",
        role: "CTO, ClarityClaim AI",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
      }
    ],
    type: "on-demand",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    attendees: 412,
    topics: ["Analytics", "Data", "Reporting"]
  }
];

const WebinarsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [filter, setFilter] = useState<"all" | "upcoming" | "on-demand">("all");

  const upcomingWebinars = webinars.filter(w => w.type === "upcoming");
  const onDemandWebinars = webinars.filter(w => w.type === "on-demand");
  
  const filteredWebinars = filter === "all" 
    ? webinars 
    : webinars.filter(w => w.type === filter);

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Webinars & Events
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Learn From the Experts
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Join our webinars to learn best practices for healthcare claims management, denial prevention, and revenue cycle optimization.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? isDark
                    ? "bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30"
                    : "bg-teal-50 text-teal-700 ring-1 ring-teal-500/30"
                  : isDark
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({webinars.length})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "upcoming"
                  ? isDark
                    ? "bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30"
                    : "bg-teal-50 text-teal-700 ring-1 ring-teal-500/30"
                  : isDark
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Upcoming ({upcomingWebinars.length})
            </button>
            <button
              onClick={() => setFilter("on-demand")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "on-demand"
                  ? isDark
                    ? "bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30"
                    : "bg-teal-50 text-teal-700 ring-1 ring-teal-500/30"
                  : isDark
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              On-Demand ({onDemandWebinars.length})
            </button>
          </div>

          {/* Featured Upcoming Webinar */}
          {filter !== "on-demand" && upcomingWebinars.length > 0 && (
            <div className={`rounded-2xl border overflow-hidden mb-12 ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"}`}>
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <img 
                    src={upcomingWebinars[0].thumbnail} 
                    alt={upcomingWebinars[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-teal-500 text-white`}>
                      Featured • Live
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {upcomingWebinars[0].title}
                  </h2>
                  <p className={`mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {upcomingWebinars[0].description}
                  </p>
                  
                  <div className={`flex flex-wrap gap-4 mb-6 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {upcomingWebinars[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {upcomingWebinars[0].time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {upcomingWebinars[0].attendees} registered
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    {upcomingWebinars[0].speakers.map((speaker) => (
                      <div key={speaker.name} className="flex items-center gap-2">
                        <img 
                          src={speaker.avatar} 
                          alt={speaker.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                            {speaker.name}
                          </p>
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                            {speaker.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark 
                      ? "bg-teal-500 text-white hover:bg-teal-600" 
                      : "bg-teal-600 text-white hover:bg-teal-700"
                  }`}>
                    Register Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Webinar Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebinars.slice(filter !== "on-demand" ? 1 : 0).map((webinar) => (
              <div 
                key={webinar.id}
                className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
                  isDark ? "border-slate-800 bg-slate-900/50 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="relative h-48">
                  <img 
                    src={webinar.thumbnail} 
                    alt={webinar.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      webinar.type === "upcoming" 
                        ? "bg-teal-500 text-white" 
                        : isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700"
                    }`}>
                      {webinar.type === "upcoming" ? "Upcoming" : "On-Demand"}
                    </span>
                  </div>
                  {webinar.type === "on-demand" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`p-4 rounded-full ${isDark ? "bg-white/20" : "bg-black/30"}`}>
                        <Play className="h-8 w-8 text-white fill-current" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {webinar.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {webinar.description}
                  </p>

                  <div className={`flex flex-wrap gap-3 mb-4 text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {webinar.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {webinar.duration}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {webinar.topics.map((topic) => (
                      <span 
                        key={topic}
                        className={`px-2 py-0.5 rounded text-xs ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <button className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    webinar.type === "upcoming"
                      ? isDark 
                        ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30" 
                        : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                      : isDark
                        ? "border border-slate-700 text-slate-300 hover:bg-slate-800"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}>
                    {webinar.type === "upcoming" ? (
                      <>Register<ArrowRight className="h-4 w-4" /></>
                    ) : (
                      <>Watch Now<Play className="h-4 w-4" /></>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className={`mt-16 rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 text-center`}>
            <Video className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Never Miss a Webinar
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Subscribe to get notified about upcoming webinars and receive on-demand content directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  isDark 
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" 
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WebinarsPage;
