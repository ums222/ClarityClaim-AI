import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-white"}`}>
      <NavBar />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <div className={`rounded-2xl border ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-neutral-50"} p-8 md:p-12 text-center`}>
            <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${isDark ? "bg-clarity-secondary/20" : "bg-clarity-secondary/10"}`}>
              <Construction className="h-8 w-8 text-clarity-secondary" />
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-neutral-900"}`}>
              {title}
            </h1>
            
            <p className={`text-lg mb-8 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              {description || "This page is coming soon. We're working hard to bring you great content."}
            </p>
            
            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors ${
                isDark
                  ? "bg-white text-neutral-900 hover:bg-neutral-100"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
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

export default PlaceholderPage;
