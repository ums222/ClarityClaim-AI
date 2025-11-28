import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowRight, Search, HelpCircle, FileText } from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Button } from "../components/ui/button";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const NotFoundPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const helpfulLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Product", href: "/product", icon: FileText },
    { label: "Pricing", href: "/pricing", icon: FileText },
    { label: "Contact", href: "/contact", icon: HelpCircle },
  ];

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
      )}
    >
      <NavBar />

      <main className="pt-20 md:pt-24 pb-16 px-4 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Graphic */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="relative inline-block"
            >
              <span className="text-[150px] md:text-[200px] font-bold bg-gradient-to-br from-teal-500/20 to-cyan-500/20 bg-clip-text text-transparent select-none">
                404
              </span>
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Search
                  className={cn(
                    "h-16 w-16 md:h-20 md:w-20",
                    isDark ? "text-slate-700" : "text-slate-300"
                  )}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Content */}
          <h1
            className={cn(
              "text-3xl md:text-4xl font-bold mb-4",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Page Not Found
          </h1>
          <p
            className={cn(
              "text-lg mb-8 max-w-md mx-auto",
              isDark ? "text-slate-400" : "text-slate-600"
            )}
          >
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/">
              <Button size="lg">
                <Home className="h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div
            className={cn(
              "p-6 rounded-2xl",
              isDark ? "bg-slate-900/50" : "bg-slate-50"
            )}
          >
            <h2
              className={cn(
                "text-sm font-medium mb-4",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Or try one of these pages:
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {helpfulLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isDark
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Fun Message */}
          <p
            className={cn(
              "mt-8 text-sm",
              isDark ? "text-slate-600" : "text-slate-400"
            )}
          >
            If you believe this is an error, please{" "}
            <Link
              to="/contact"
              className="text-clarity-secondary hover:underline"
            >
              let us know
            </Link>
            . We're always improving!
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
