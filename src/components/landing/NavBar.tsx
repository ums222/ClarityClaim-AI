import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/useTheme";

const navItems = [
  { label: "Product", href: "#features", hasDropdown: true },
  { label: "Contact Us", href: "#contact" },
];

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all",
        scrolled
          ? theme === "dark"
            ? "bg-slate-950/85 backdrop-blur-md border-b border-slate-800"
            : "bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2"
        >
          {/* Theme-aware logo: light version for light mode, dark version for dark mode */}
          <img 
            src={theme === "dark" ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"} 
            alt="ClarityClaim AI Logo" 
            className="h-8 w-auto" 
          />
        </Link>

        {/* Desktop nav - Aegis style */}
        <div className="hidden items-center gap-6 md:flex">
          <div className={cn(
            "flex items-center gap-6 text-sm",
            theme === "dark" ? "text-slate-300" : "text-slate-600"
          )}>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1 transition-colors",
                  theme === "dark" ? "hover:text-slate-50" : "hover:text-slate-900"
                )}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
              </a>
            ))}
          </div>

          {/* Theme toggle button - Aegis style */}
          <button
            onClick={toggleTheme}
            className={cn(
              "rounded-full p-2 transition-colors",
              theme === "dark"
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            )}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* CTA Button - Aegis style */}
          <Button
            size="sm"
            className={cn(
              "rounded-full px-5",
              theme === "dark"
                ? "bg-white text-slate-900 hover:bg-slate-100"
                : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            Request Demo
            <ChevronDown className="ml-1 h-4 w-4 rotate-[-90deg]" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className={cn(
              "rounded-full p-2 transition-colors",
              theme === "dark"
                ? "bg-slate-800 text-slate-300"
                : "bg-slate-100 text-slate-600"
            )}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            className={cn(
              "inline-flex items-center justify-center rounded-full border p-2",
              theme === "dark"
                ? "border-slate-700/60 bg-slate-900/70 text-slate-100"
                : "border-slate-200 bg-white text-slate-700"
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className={cn(
            "border-t md:hidden",
            theme === "dark"
              ? "border-slate-800 bg-slate-950/95"
              : "border-slate-200 bg-white/95"
          )}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm flex items-center gap-1",
                  theme === "dark" ? "text-slate-200" : "text-slate-700"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
              </a>
            ))}
            <div className="mt-2">
              <Button
                size="md"
                className={cn(
                  "w-full rounded-full",
                  theme === "dark"
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                Request Demo
                <ChevronDown className="ml-1 h-4 w-4 rotate-[-90deg]" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
