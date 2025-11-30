import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/useTheme";

const navItems = [
  { label: "Product", href: "#solution" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

// App URL for login/signup - different in prod vs dev
const APP_URL = import.meta.env.VITE_APP_URL || 'https://app.apclaims.net';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-200",
        scrolled
          ? isDark
            ? "bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800"
            : "bg-white/80 backdrop-blur-lg border-b border-neutral-200"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center"
        >
          <img 
            src={isDark ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"} 
            alt="ClarityClaim AI" 
            className="h-7 w-auto" 
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isDark 
                    ? "text-neutral-400 hover:text-white" 
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "rounded-lg p-2 transition-colors",
                isDark
                  ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              )}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Login link */}
            <a
              href={`${APP_URL}/login`}
              className={cn(
                "text-sm font-medium transition-colors",
                isDark 
                  ? "text-neutral-400 hover:text-white" 
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Login
            </a>

            {/* CTA */}
            <a href={`${APP_URL}/signup`}>
              <Button size="sm">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className={cn(
              "rounded-lg p-2",
              isDark ? "text-neutral-400" : "text-neutral-500"
            )}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className={cn(
              "rounded-lg p-2",
              isDark ? "text-neutral-400" : "text-neutral-500"
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
            isDark
              ? "border-neutral-800 bg-neutral-950/95 backdrop-blur-lg"
              : "border-neutral-200 bg-white/95 backdrop-blur-lg"
          )}
        >
          <div className="mx-auto flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isDark 
                    ? "text-neutral-300 hover:bg-neutral-800" 
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              <a
                href={`${APP_URL}/login`}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium text-center transition-colors",
                  isDark 
                    ? "text-neutral-300 hover:bg-neutral-800" 
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
                onClick={() => setOpen(false)}
              >
                Login
              </a>
              <a href={`${APP_URL}/signup`} onClick={() => setOpen(false)}>
                <Button size="md" className="w-full">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
