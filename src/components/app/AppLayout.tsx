import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Scale,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Bell,
  User,
  Plug,
  CreditCard,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { AIAssistant, AIAssistantButton } from '../ai';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Claims', href: '/app/claims', icon: FileText },
  { name: 'Appeals', href: '/app/appeals', icon: Scale },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Integrations', href: '/app/integrations', icon: Plug },
];

const bottomNavigation = [
  { name: 'Billing', href: '/app/billing', icon: CreditCard },
  { name: 'Security', href: '/app/security', icon: Shield },
  { name: 'Settings', href: '/app/settings', icon: Settings },
  { name: 'Help', href: '/app/help', icon: HelpCircle },
];

// Admin navigation item (shown to admin users only)
const adminNavItem = { name: 'Admin Console', href: '/app/admin', icon: ShieldCheck };

export function AppLayout({ children }: AppLayoutProps) {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, organization, signOut } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActiveRoute = (href: string) => {
    if (href === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "min-h-screen",
      isDark ? "bg-neutral-950" : "bg-neutral-50"
    )}>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          isDark
            ? "bg-neutral-900 border-r border-neutral-800"
            : "bg-white border-r border-neutral-200"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
            <Link to="/app" className="flex items-center">
              <img
                src={isDark ? '/orbitlogo-dark.svg' : '/orbitlogo.svg'}
                alt="ClarityClaim AI"
                className="h-7 w-auto"
              />
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className={cn(
                "h-5 w-5",
                isDark ? "text-neutral-400" : "text-neutral-500"
              )} />
            </button>
          </div>

          {/* Organization selector */}
          {organization && (
            <div className="px-3 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <button
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                  isDark
                    ? "hover:bg-neutral-800"
                    : "hover:bg-neutral-100"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium",
                  isDark
                    ? "bg-teal-500/20 text-teal-400"
                    : "bg-teal-50 text-teal-600"
                )}>
                  {organization.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    {organization.name}
                  </p>
                  <p className={cn(
                    "text-xs truncate capitalize",
                    isDark ? "text-neutral-500" : "text-neutral-500"
                  )}>
                    {organization.subscription_tier} plan
                  </p>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4",
                  isDark ? "text-neutral-500" : "text-neutral-400"
                )} />
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActiveRoute(item.href)
                    ? isDark
                      ? "bg-teal-500/10 text-teal-400"
                      : "bg-teal-50 text-teal-600"
                    : isDark
                      ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Admin link (shown for demo - in production, check for admin role) */}
          <div className="px-3 py-2 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              to={adminNavItem.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActiveRoute(adminNavItem.href)
                  ? isDark
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-amber-50 text-amber-700"
                  : isDark
                    ? "text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10"
                    : "text-amber-600/70 hover:text-amber-700 hover:bg-amber-50"
              )}
            >
              <adminNavItem.icon className="h-5 w-5" />
              {adminNavItem.name}
              <span className={cn(
                "ml-auto px-1.5 py-0.5 text-xs font-semibold rounded",
                isDark
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-amber-100 text-amber-700"
              )}>
                ADMIN
              </span>
            </Link>
          </div>

          {/* Bottom navigation */}
          <div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
            {bottomNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActiveRoute(item.href)
                    ? isDark
                      ? "bg-teal-500/10 text-teal-400"
                      : "bg-teal-50 text-teal-600"
                    : isDark
                      ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className={cn(
          "sticky top-0 z-30 h-16 border-b",
          isDark
            ? "bg-neutral-950/80 backdrop-blur-lg border-neutral-800"
            : "bg-white/80 backdrop-blur-lg border-neutral-200"
        )}>
          <div className="flex h-full items-center justify-between px-4 lg:px-6">
            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className={cn(
                "h-6 w-6",
                isDark ? "text-neutral-400" : "text-neutral-500"
              )} />
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDark
                    ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <button
                className={cn(
                  "p-2 rounded-lg transition-colors relative",
                  isDark
                    ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 p-1.5 rounded-lg transition-colors",
                    isDark
                      ? "hover:bg-neutral-800"
                      : "hover:bg-neutral-100"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isDark
                      ? "bg-teal-500/20 text-teal-400"
                      : "bg-teal-50 text-teal-600"
                  )}>
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4",
                    isDark ? "text-neutral-500" : "text-neutral-400"
                  )} />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute right-0 mt-2 w-56 rounded-xl shadow-lg z-50 py-1 ring-1",
                          isDark
                            ? "bg-neutral-900 ring-neutral-800"
                            : "bg-white ring-neutral-200"
                        )}
                      >
                        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                          <p className={cn(
                            "text-sm font-medium",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {profile?.full_name || 'User'}
                          </p>
                          <p className={cn(
                            "text-xs truncate",
                            isDark ? "text-neutral-500" : "text-neutral-500"
                          )}>
                            {profile?.email}
                          </p>
                        </div>
                        
                        <div className="py-1">
                          <Link
                            to="/app/settings"
                            onClick={() => setUserMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                              isDark
                                ? "text-neutral-300 hover:bg-neutral-800"
                                : "text-neutral-700 hover:bg-neutral-100"
                            )}
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                        </div>
                        
                        <div className="py-1 border-t border-neutral-200 dark:border-neutral-800">
                          <button
                            onClick={handleSignOut}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 text-sm w-full transition-colors",
                              isDark
                                ? "text-red-400 hover:bg-neutral-800"
                                : "text-red-600 hover:bg-neutral-100"
                            )}
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistantButton onClick={() => setIsAIAssistantOpen(true)} />
      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
    </div>
  );
}

export default AppLayout;
