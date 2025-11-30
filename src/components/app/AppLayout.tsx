import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Sun,
  Moon,
  BarChart3,
  Users,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "Appeals Studio", href: "/app/appeals", icon: FileText },
  { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { name: "Patients", href: "/app/patients", icon: Users },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

const AppLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mock user data - replace with actual auth
  const user = {
    name: "Demo User",
    email: "demo@clarityclaim.ai",
    organization: "Regional Medical Center",
  };

  const handleLogout = () => {
    // TODO: Implement actual logout with Supabase
    navigate("/login");
  };

  return (
    <div className={cn("min-h-screen", isDark ? "bg-neutral-950" : "bg-neutral-50")}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          isDark ? "bg-neutral-900 border-r border-neutral-800" : "bg-white border-r border-neutral-200"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
          <Link to="/app" className="flex items-center gap-2">
            <img
              src={isDark ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"}
              alt="ClarityClaim AI"
              className="h-7 w-auto"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/app" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                    : isDark
                    ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-teal-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
          <div className={cn(
            "p-3 rounded-lg",
            isDark ? "bg-neutral-800/50" : "bg-neutral-100"
          )}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/20 text-teal-600 font-medium text-sm">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium truncate", isDark ? "text-white" : "text-neutral-900")}>
                  {user.name}
                </p>
                <p className={cn("text-xs truncate", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  {user.organization}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className={cn(
          "sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b",
          isDark ? "bg-neutral-950/80 border-neutral-800 backdrop-blur-lg" : "bg-white/80 border-neutral-200 backdrop-blur-lg"
        )}>
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search - placeholder */}
          <div className="hidden lg:block flex-1 max-w-md">
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg",
              isDark ? "bg-neutral-900" : "bg-neutral-100"
            )}>
              <span className={cn("text-sm", isDark ? "text-neutral-500" : "text-neutral-400")}>
                Search claims, appeals...
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark ? "text-neutral-400 hover:text-white hover:bg-neutral-800" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              )}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button className={cn(
              "relative p-2 rounded-lg transition-colors",
              isDark ? "text-neutral-400 hover:text-white hover:bg-neutral-800" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            )}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-teal-500 rounded-full" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg transition-colors",
                  isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-teal-600 font-medium text-xs">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <ChevronDown className={cn("h-4 w-4", isDark ? "text-neutral-400" : "text-neutral-500")} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className={cn(
                    "absolute right-0 mt-2 w-56 rounded-xl shadow-lg ring-1 z-50",
                    isDark ? "bg-neutral-900 ring-neutral-800" : "bg-white ring-neutral-200"
                  )}>
                    <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
                      <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                        {user.name}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        {user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/app/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          isDark ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-700 hover:bg-neutral-100"
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          isDark ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-700 hover:bg-neutral-100"
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
