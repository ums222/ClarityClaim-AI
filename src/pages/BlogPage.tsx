import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: "ai-denial-prediction-2025",
    title: "How AI is Revolutionizing Claim Denial Prediction in 2025",
    excerpt: "Discover how machine learning models are achieving 94% accuracy in predicting claim denials before submission, saving healthcare organizations millions.",
    category: "AI & Technology",
    author: {
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
      role: "CEO & Co-Founder"
    },
    publishedAt: "Nov 28, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "appeal-letter-best-practices",
    title: "10 Best Practices for Writing Winning Appeal Letters",
    excerpt: "Our analysis of 50,000+ successful appeals reveals the key elements that increase your chances of overturning denials.",
    category: "Best Practices",
    author: {
      name: "Jennifer Martinez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80",
      role: "Chief Revenue Officer"
    },
    publishedAt: "Nov 25, 2025",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "prior-auth-automation",
    title: "Automating Prior Authorization: A Step-by-Step Guide",
    excerpt: "Learn how to implement automated prior authorization workflows that reduce turnaround time by 75%.",
    category: "Guides",
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      role: "VP of Engineering"
    },
    publishedAt: "Nov 20, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "denial-trends-q4-2025",
    title: "Healthcare Denial Trends: Q4 2025 Report",
    excerpt: "Our quarterly analysis reveals shifting payer behaviors, new denial codes, and strategies for staying ahead.",
    category: "Industry Insights",
    author: {
      name: "Michael Roberts",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      role: "CTO & Co-Founder"
    },
    publishedAt: "Nov 15, 2025",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cms-2025-updates",
    title: "CMS 2025 Updates: What Healthcare Providers Need to Know",
    excerpt: "Breaking down the latest CMS regulatory changes and how they impact your claims management strategy.",
    category: "Regulatory",
    author: {
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
      role: "CEO & Co-Founder"
    },
    publishedAt: "Nov 10, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "revenue-cycle-metrics",
    title: "The 15 Revenue Cycle Metrics Every CFO Should Track",
    excerpt: "From denial rates to days in A/R, these KPIs provide actionable insights for optimizing your revenue cycle.",
    category: "Best Practices",
    author: {
      name: "Jennifer Martinez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80",
      role: "Chief Revenue Officer"
    },
    publishedAt: "Nov 5, 2025",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  }
];

const categories = ["All", "AI & Technology", "Best Practices", "Guides", "Industry Insights", "Regulatory"];

const BlogPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              ClarityClaim Blog
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Insights & Resources
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Expert insights on healthcare claims management, denial prevention, and revenue cycle optimization.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  isDark 
                    ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500" 
                    : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400"
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? isDark
                        ? "bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30"
                        : "bg-teal-50 text-teal-700 ring-1 ring-teal-500/30"
                      : isDark
                        ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && selectedCategory === "All" && !searchQuery && (
            <div className={`rounded-2xl border overflow-hidden mb-12 ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"}`}>
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
                      Featured
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                      <Tag className="h-3 w-3" />
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
                    {featuredPost.title}
                  </h2>
                  <p className={`mb-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={featuredPost.author.avatar} 
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                        {featuredPost.author.name}
                      </p>
                      <div className={`flex items-center gap-3 text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {featuredPost.publishedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery || selectedCategory !== "All" ? filteredPosts : regularPosts).map((post) => (
              <article 
                key={post.id}
                className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
                  isDark ? "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700" : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="h-48">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}>
                      {post.category}
                    </span>
                    <span className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className={`text-xs font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                          {post.author.name}
                        </p>
                        <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                          {post.publishedAt}
                        </p>
                      </div>
                    </div>
                    <button className={`flex items-center gap-1 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
                      Read
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                No articles found matching your criteria.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className={`mt-4 text-sm font-medium ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className={`mt-16 rounded-2xl border ${isDark ? "border-teal-500/30 bg-teal-500/5" : "border-teal-200 bg-teal-50"} p-8 text-center`}>
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Subscribe to Our Newsletter
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Get the latest insights on healthcare claims management, AI innovations, and industry trends delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  isDark 
                    ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500" 
                    : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400"
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

export default BlogPage;
