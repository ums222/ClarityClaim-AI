import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Calendar, Clock, User, ArrowRight, TrendingUp } from "lucide-react";

const BlogPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const featuredPost = {
    title: "The $25.7 Billion Problem: How AI is Transforming Healthcare Claim Denials",
    excerpt: "Healthcare claim denials cost the U.S. healthcare system billions annually. Learn how artificial intelligence is revolutionizing the way providers prevent, predict, and appeal denied claims.",
    author: "Dr. Sarah Chen",
    authorRole: "CEO & Co-Founder",
    date: "November 28, 2025",
    readTime: "8 min read",
    category: "Industry Insights",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
  };

  const blogPosts = [
    {
      title: "Understanding Prior Authorization: A Complete Guide for Healthcare Providers",
      excerpt: "Prior authorization delays cost providers time and money. Here's everything you need to know about streamlining the prior auth process.",
      author: "Jennifer Martinez",
      date: "November 25, 2025",
      readTime: "6 min read",
      category: "Best Practices",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "5 Common Claim Denial Reasons and How to Prevent Them",
      excerpt: "From missing modifiers to incomplete documentation, we break down the top causes of claim denials and provide actionable prevention strategies.",
      author: "Michael Roberts",
      date: "November 22, 2025",
      readTime: "5 min read",
      category: "Tips & Tricks",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "The Rise of AI in Revenue Cycle Management: 2025 Trends",
      excerpt: "AI adoption in healthcare RCM is accelerating. We analyze the latest trends and what they mean for healthcare organizations.",
      author: "David Park",
      date: "November 18, 2025",
      readTime: "7 min read",
      category: "Industry Insights",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "HIPAA Compliance in the Age of AI: What You Need to Know",
      excerpt: "Using AI for claims management raises important questions about data security and HIPAA compliance. Here's our comprehensive guide.",
      author: "Dr. Sarah Chen",
      date: "November 15, 2025",
      readTime: "10 min read",
      category: "Compliance",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Case Study: How Regional Medical Center Reduced Denials by 40%",
      excerpt: "A deep dive into how one health system transformed their revenue cycle using AI-powered claim prediction and appeal automation.",
      author: "Jennifer Martinez",
      date: "November 12, 2025",
      readTime: "8 min read",
      category: "Case Studies",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "The Complete Guide to Writing Effective Appeal Letters",
      excerpt: "Master the art of crafting compelling appeal letters that get results. Includes templates and examples from successful appeals.",
      author: "Michael Roberts",
      date: "November 8, 2025",
      readTime: "12 min read",
      category: "Best Practices",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const categories = [
    { name: "All Posts", count: 24 },
    { name: "Industry Insights", count: 8 },
    { name: "Best Practices", count: 6 },
    { name: "Tips & Tricks", count: 5 },
    { name: "Case Studies", count: 3 },
    { name: "Compliance", count: 2 }
  ];

  const trendingTopics = [
    "AI in Healthcare",
    "Denial Management",
    "Prior Authorization",
    "Revenue Cycle",
    "HIPAA Compliance",
    "Appeal Letters"
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              ClarityClaim Blog
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Insights & Resources
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Expert insights on healthcare claims management, AI innovation, and revenue cycle optimization.
            </p>
          </div>

          {/* Featured Post */}
          <div className={`rounded-2xl overflow-hidden border ${isDark ? "border-slate-800" : "border-slate-200"} mb-12`}>
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-auto">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`p-8 ${isDark ? "bg-slate-900/50" : "bg-slate-50"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-700"}`}>
                    Featured
                  </span>
                  <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {featuredPost.title}
                </h2>
                <p className={`mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <User className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{featuredPost.readTime}</span>
                  </div>
                </div>
                <button className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <h3 className={`text-xl font-semibold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Latest Articles
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <article 
                    key={post.title}
                    className={`rounded-xl overflow-hidden border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} hover:shadow-lg transition-shadow`}
                  >
                    <div className="h-48">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <span className={`text-xs ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                        {post.category}
                      </span>
                      <h4 className={`text-lg font-semibold mt-2 mb-2 line-clamp-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {post.title}
                      </h4>
                      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                          {post.date}
                        </span>
                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}>
                  Load More Articles
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6`}>
                <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Categories
                </h4>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <button className={`flex items-center justify-between w-full text-sm py-2 px-3 rounded-lg transition-colors ${isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}>
                        <span>{cat.name}</span>
                        <span className={`text-xs ${isDark ? "text-slate-600" : "text-slate-400"}`}>({cat.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trending Topics */}
              <div className={`rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-6`}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className={`h-4 w-4 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    Trending Topics
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <span 
                      key={topic}
                      className={`text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"}`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className={`rounded-xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-6`}>
                <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Subscribe to Our Newsletter
                </h4>
                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Get the latest insights on healthcare claims management delivered to your inbox.
                </p>
                <form className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className={`w-full px-4 py-2 rounded-lg text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"} border focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  />
                  <button className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                    Subscribe
                  </button>
                </form>
                <p className={`text-xs mt-3 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                  No spam. Unsubscribe anytime.
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

export default BlogPage;
