import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Activity,
  Search,
  ArrowRight,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

type ResourceCategory = "all" | "blog" | "case-studies" | "webinars" | "help" | "status";

const ResourcesPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");

  const categories = [
    { id: "all" as const, label: "All Resources", icon: BookOpen },
    { id: "blog" as const, label: "Blog", icon: FileText },
    { id: "case-studies" as const, label: "Case Studies", icon: TrendingUp },
    { id: "webinars" as const, label: "Webinars", icon: Video },
    { id: "help" as const, label: "Help Center", icon: HelpCircle },
    { id: "status" as const, label: "Status", icon: Activity },
  ];

  const featuredArticle = {
    title: "The $262 Billion Problem: Understanding the True Cost of Claim Denials",
    excerpt:
      "Healthcare organizations lose billions annually to preventable claim denials. Learn about the financial and operational impact—and how AI is changing the game.",
    category: "Industry Insights",
    readTime: "8 min read",
    date: "November 2024",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  };

  const caseStudy = {
    title: "Regional Health System Recovers $1.8M in Q1",
    subtitle: "40% Reduction in Denial Rate",
    stats: [
      { value: "$1.8M", label: "Revenue Recovered" },
      { value: "40%", label: "Denial Reduction" },
      { value: "87%", label: "Appeal Win Rate" },
      { value: "3 weeks", label: "Time to ROI" },
    ],
    excerpt:
      "A 12-hospital regional health system implemented ClarityClaim AI and saw dramatic improvements in their revenue cycle within the first quarter.",
  };

  const resources = [
    {
      id: 1,
      category: "blog",
      title: "5 Warning Signs Your Denial Management Process Needs AI",
      excerpt: "Manual denial management can only scale so far. Here are the signs it's time to automate.",
      date: "Nov 15, 2024",
      readTime: "5 min",
    },
    {
      id: 2,
      category: "blog",
      title: "How AI Predicts Claim Denials Before They Happen",
      excerpt: "A deep dive into the machine learning models that power denial prediction.",
      date: "Nov 10, 2024",
      readTime: "7 min",
    },
    {
      id: 3,
      category: "case-studies",
      title: "FQHC Network Achieves 25% First-Pass Rate Improvement",
      excerpt: "How a safety-net provider network transformed their revenue cycle with AI.",
      date: "Oct 28, 2024",
      readTime: "4 min",
    },
    {
      id: 4,
      category: "webinars",
      title: "Webinar: The Future of AI in Revenue Cycle Management",
      excerpt: "Join our experts as they discuss the latest trends and technologies in RCM.",
      date: "Dec 5, 2024",
      readTime: "60 min",
    },
    {
      id: 5,
      category: "blog",
      title: "Understanding Health Equity in Claims Processing",
      excerpt: "Why equity analytics matter and how to ensure fair reimbursement across all populations.",
      date: "Oct 20, 2024",
      readTime: "6 min",
    },
    {
      id: 6,
      category: "webinars",
      title: "Demo: ClarityClaim AI Platform Walkthrough",
      excerpt: "A recorded walkthrough of the full ClarityClaim AI platform and its capabilities.",
      date: "Nov 1, 2024",
      readTime: "45 min",
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
    alert("Thanks for subscribing! Check your email for confirmation.");
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
      )}
    >
      <NavBar />

      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Resources
            </Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Learn, Grow,{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Transform
              </span>
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Insights, guides, and success stories to help you master revenue
              cycle management with AI.
            </p>
          </motion.div>
        </SectionContainer>

        {/* Search & Filter */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                  isDark ? "text-slate-500" : "text-slate-400"
                )}
              />
              <Input
                type="search"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
                      activeCategory === cat.id
                        ? "bg-clarity-secondary text-white"
                        : isDark
                        ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Article */}
          {activeCategory === "all" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <Card
                className={cn(
                  "overflow-hidden",
                  isDark ? "bg-slate-900/70" : "bg-white"
                )}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div
                    className="aspect-video md:aspect-auto bg-cover bg-center min-h-[200px]"
                    style={{ backgroundImage: `url(${featuredArticle.image})` }}
                  />
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge className="self-start mb-3">
                      {featuredArticle.category}
                    </Badge>
                    <CardTitle className="text-2xl md:text-3xl mb-3">
                      {featuredArticle.title}
                    </CardTitle>
                    <CardDescription
                      className={cn(
                        "text-base mb-4",
                        isDark ? "text-slate-300" : "text-slate-600"
                      )}
                    >
                      {featuredArticle.excerpt}
                    </CardDescription>
                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          isDark ? "text-slate-500" : "text-slate-500"
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {featuredArticle.readTime}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          isDark ? "text-slate-500" : "text-slate-500"
                        )}
                      >
                        <Calendar className="h-3 w-3" />
                        {featuredArticle.date}
                      </span>
                    </div>
                    <Button className="self-start">
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Case Study Highlight */}
          {(activeCategory === "all" || activeCategory === "case-studies") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-12"
            >
              <Card
                className={cn(
                  "p-6 md:p-8",
                  isDark
                    ? "bg-gradient-to-br from-clarity-secondary/20 to-slate-900 border-clarity-secondary/30"
                    : "bg-gradient-to-br from-clarity-secondary/10 to-white border-clarity-secondary/20"
                )}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <Badge className="mb-3">Case Study</Badge>
                    <h3
                      className={cn(
                        "text-2xl font-bold mb-2",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {caseStudy.title}
                    </h3>
                    <p className="text-clarity-secondary font-semibold mb-3">
                      {caseStudy.subtitle}
                    </p>
                    <p
                      className={cn(
                        "text-sm mb-4",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      {caseStudy.excerpt}
                    </p>
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                      Download Case Study
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {caseStudy.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className={cn(
                          "p-4 rounded-xl text-center",
                          isDark ? "bg-slate-800/50" : "bg-white/80"
                        )}
                      >
                        <div className="text-2xl font-bold text-clarity-secondary">
                          {stat.value}
                        </div>
                        <div
                          className={cn(
                            "text-xs",
                            isDark ? "text-slate-400" : "text-slate-500"
                          )}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Resource Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    "h-full hover:-translate-y-1 transition-all duration-200",
                    isDark
                      ? "bg-slate-900/70 hover:shadow-xl hover:shadow-slate-900/50"
                      : "bg-white hover:shadow-lg"
                  )}
                >
                  <CardHeader>
                    <Badge
                      variant="secondary"
                      className="self-start text-xs capitalize"
                    >
                      {resource.category.replace("-", " ")}
                    </Badge>
                    <CardTitle className="text-lg line-clamp-2">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription
                      className={cn(
                        "text-sm mb-4 line-clamp-2",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      {resource.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex items-center gap-3 text-xs",
                          isDark ? "text-slate-500" : "text-slate-500"
                        )}
                      >
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {resource.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.readTime}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-clarity-secondary"
                      >
                        Read
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                No resources found matching your criteria.
              </p>
            </div>
          )}
        </SectionContainer>

        {/* Newsletter Subscription */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "rounded-2xl p-8 md:p-12 text-center",
              isDark
                ? "bg-slate-900/70 border border-slate-800"
                : "bg-white border border-slate-200"
            )}
          >
            <Users className="h-12 w-12 mx-auto mb-4 text-clarity-secondary" />
            <h2
              className={cn(
                "text-2xl md:text-3xl font-bold mb-3",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Stay Updated
            </h2>
            <p
              className={cn(
                "text-base mb-6 max-w-xl mx-auto",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Get the latest insights on AI-powered revenue cycle management
              delivered to your inbox.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
            <p
              className={cn(
                "text-xs mt-3",
                isDark ? "text-slate-500" : "text-slate-500"
              )}
            >
              No spam, unsubscribe anytime.
            </p>
          </motion.div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesPage;
