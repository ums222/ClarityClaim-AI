import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/useTheme";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Product",
    href: "/product",
    children: [
      { label: "Features", href: "/product", description: "AI-powered claims management" },
      { label: "Integrations", href: "/integrations", description: "Connect your systems" },
      { label: "Security", href: "/security", description: "Enterprise-grade protection" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog", href: "/resources", description: "Industry insights" },
      { label: "Case Studies", href: "/resources", description: "Success stories" },
      { label: "Help Center", href: "/help", description: "Get support" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", description: "Our mission & team" },
      { label: "Careers", href: "/careers", description: "Join us" },
      { label: "Contact", href: "/contact", description: "Get in touch" },
    ],
  },
];

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
          onClick={handleLogoClick}
          className="flex items-center"
        >
          <img 
            src={isDark ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"} 
            alt="ClarityClaim AI" 
            className="h-7 w-auto" 
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.children ? (
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                      isDark 
                        ? "text-neutral-400 hover:text-white hover:bg-neutral-800/50" 
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      activeDropdown === item.label && "rotate-180"
                    )} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                      location.pathname === item.href
                        ? isDark
                          ? "text-white bg-neutral-800/50"
                          : "text-neutral-900 bg-neutral-100"
                        : isDark 
                          ? "text-neutral-400 hover:text-white hover:bg-neutral-800/50" 
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    )}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div
                    className={cn(
                      "absolute top-full left-0 mt-1 w-56 rounded-xl border p-2 shadow-lg",
                      isDark
                        ? "bg-neutral-900 border-neutral-800"
                        : "bg-white border-neutral-200"
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className={cn(
                          "block rounded-lg px-3 py-2 transition-colors",
                          isDark
                            ? "hover:bg-neutral-800"
                            : "hover:bg-neutral-50"
                        )}
                      >
                        <div className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>
                          {child.label}
                        </div>
                        {child.description && (
                          <div className={cn(
                            "text-xs mt-0.5",
                            isDark ? "text-neutral-500" : "text-neutral-500"
                          )}>
                            {child.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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

            {/* Login */}
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>

            {/* CTA */}
            <Link to="/contact">
              <Button size="sm">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
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
            "border-t lg:hidden",
            isDark
              ? "border-neutral-800 bg-neutral-950/95 backdrop-blur-lg"
              : "border-neutral-200 bg-white/95 backdrop-blur-lg"
          )}
        >
          <div className="mx-auto flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(
                        activeDropdown === item.label ? null : item.label
                      )}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isDark 
                          ? "text-neutral-300 hover:bg-neutral-800" 
                          : "text-neutral-600 hover:bg-neutral-100"
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        activeDropdown === item.label && "rotate-180"
                      )} />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="ml-3 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors",
                              isDark 
                                ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" 
                                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? isDark
                          ? "text-white bg-neutral-800"
                          : "text-neutral-900 bg-neutral-100"
                        : isDark 
                          ? "text-neutral-300 hover:bg-neutral-800" 
                          : "text-neutral-600 hover:bg-neutral-100"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setOpen(false)}>
                <Button size="md" className="w-full">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
