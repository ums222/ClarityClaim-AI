import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, ArrowRight, User, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { label: "Product", href: "#solution" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate("/");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

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

            {/* Auth buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors",
                    isDark
                      ? "hover:bg-neutral-800"
                      : "hover:bg-neutral-100"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium",
                      isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-700"
                    )}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      isDark ? "text-neutral-200" : "text-neutral-700"
                    )}
                  >
                    {displayName}
                  </span>
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div
                    className={cn(
                      "absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-50",
                      isDark
                        ? "bg-neutral-900 border-neutral-800"
                        : "bg-white border-neutral-200"
                    )}
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                        isDark
                          ? "text-neutral-300 hover:bg-neutral-800"
                          : "text-neutral-700 hover:bg-neutral-100"
                      )}
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={cn(
                        "flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors",
                        isDark
                          ? "text-neutral-300 hover:bg-neutral-800"
                          : "text-neutral-700 hover:bg-neutral-100"
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
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
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    <Button size="md" className="w-full">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    size="md"
                    variant="outline"
                    className="w-full"
                    onClick={() => { handleSignOut(); setOpen(false); }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button size="md" variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button size="md" className="w-full">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
