import { Link } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";

const NotFoundPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <NavBar />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} p-8 md:p-12 text-center`}>
            <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${isDark ? "bg-clarity-secondary/20" : "bg-clarity-secondary/10"}`}>
              <FileQuestion className="h-8 w-8 text-clarity-secondary" />
            </div>

            <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              404
            </h1>

            <h2 className={`text-xl md:text-2xl font-semibold mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Page Not Found
            </h2>

            <p className={`text-base mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              The page you're looking for doesn't exist or has been moved.
            </p>

            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors ${
                isDark
                  ? "bg-white text-slate-900 hover:bg-slate-100"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
