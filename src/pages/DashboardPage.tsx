import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Bell,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

// Sidebar navigation items
const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Claims', href: '/dashboard/claims', icon: FileText },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

// Mock stats for demonstration
const stats = [
  {
    label: 'Total Claims',
    value: '1,234',
    change: '+12%',
    changeType: 'positive' as const,
    icon: FileText,
  },
  {
    label: 'Approved',
    value: '892',
    change: '+8%',
    changeType: 'positive' as const,
    icon: CheckCircle,
  },
  {
    label: 'Pending Review',
    value: '156',
    change: '-3%',
    changeType: 'negative' as const,
    icon: Clock,
  },
  {
    label: 'Requires Action',
    value: '23',
    change: '+2%',
    changeType: 'neutral' as const,
    icon: AlertTriangle,
  },
];

// Mock recent activity
const recentActivity = [
  { id: 1, action: 'Claim #12345 approved', time: '2 minutes ago' },
  { id: 2, action: 'New claim submitted', time: '15 minutes ago' },
  { id: 3, action: 'Claim #12342 requires additional info', time: '1 hour ago' },
  { id: 4, action: 'Claim #12340 approved', time: '2 hours ago' },
  { id: 5, action: 'New claim submitted', time: '3 hours ago' },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get user display name
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div
      className={cn(
        'min-h-screen',
        isDark ? 'bg-neutral-950' : 'bg-neutral-100'
      )}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isDark
            ? 'bg-neutral-900 border-r border-neutral-800'
            : 'bg-white border-r border-neutral-200'
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
          <Link to="/" className="flex items-center">
            <img
              src={isDark ? '/orbitlogo-dark.svg' : '/orbitlogo.svg'}
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

        {/* Sidebar navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                item.href === '/dashboard'
                  ? isDark
                    ? 'bg-teal-500/10 text-teal-500'
                    : 'bg-teal-50 text-teal-600'
                  : isDark
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleSignOut}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isDark
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header
          className={cn(
            'sticky top-0 z-30 h-16 border-b',
            isDark
              ? 'bg-neutral-950/80 backdrop-blur-lg border-neutral-800'
              : 'bg-white/80 backdrop-blur-lg border-neutral-200'
          )}
        >
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={cn(
                'lg:hidden p-2 rounded-lg',
                isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
              )}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page title - hidden on mobile */}
            <h1
              className={cn(
                'hidden lg:block text-lg font-semibold',
                isDark ? 'text-white' : 'text-neutral-900'
              )}
            >
              Dashboard
            </h1>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isDark
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                )}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <button
                className={cn(
                  'p-2 rounded-lg transition-colors relative',
                  isDark
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                )}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-neutral-200 dark:border-neutral-800">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                  )}
                >
                  <User
                    className={cn(
                      'h-4 w-4',
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    )}
                  />
                </div>
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-white' : 'text-neutral-900'
                    )}
                  >
                    {displayName}
                  </p>
                  <p
                    className={cn(
                      'text-xs',
                      isDark ? 'text-neutral-500' : 'text-neutral-500'
                    )}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 lg:p-6">
          {/* Welcome message */}
          <div className="mb-6">
            <h2
              className={cn(
                'text-2xl font-bold',
                isDark ? 'text-white' : 'text-neutral-900'
              )}
            >
              Welcome back, {displayName.split(' ')[0]}
            </h2>
            <p
              className={cn(
                'text-sm mt-1',
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              )}
            >
              Here's an overview of your claims processing activity.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'p-4 rounded-xl border',
                  isDark
                    ? 'bg-neutral-900 border-neutral-800'
                    : 'bg-white border-neutral-200'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={cn(
                        'text-sm',
                        isDark ? 'text-neutral-400' : 'text-neutral-600'
                      )}
                    >
                      {stat.label}
                    </p>
                    <p
                      className={cn(
                        'text-2xl font-bold mt-1',
                        isDark ? 'text-white' : 'text-neutral-900'
                      )}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      isDark ? 'bg-neutral-800' : 'bg-neutral-100'
                    )}
                  >
                    <stat.icon
                      className={cn(
                        'h-5 w-5',
                        stat.changeType === 'positive'
                          ? 'text-teal-500'
                          : stat.changeType === 'negative'
                          ? 'text-red-500'
                          : 'text-amber-500'
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp
                    className={cn(
                      'h-4 w-4',
                      stat.changeType === 'positive'
                        ? 'text-teal-500'
                        : stat.changeType === 'negative'
                        ? 'text-red-500'
                        : 'text-amber-500'
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm font-medium',
                      stat.changeType === 'positive'
                        ? 'text-teal-500'
                        : stat.changeType === 'negative'
                        ? 'text-red-500'
                        : 'text-amber-500'
                    )}
                  >
                    {stat.change}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      isDark ? 'text-neutral-500' : 'text-neutral-500'
                    )}
                  >
                    vs last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div
            className={cn(
              'rounded-xl border',
              isDark
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-white border-neutral-200'
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3
                className={cn(
                  'font-semibold',
                  isDark ? 'text-white' : 'text-neutral-900'
                )}
              >
                Recent Activity
              </h3>
              <Button variant="ghost" size="sm">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4"
                >
                  <p
                    className={cn(
                      'text-sm',
                      isDark ? 'text-neutral-300' : 'text-neutral-700'
                    )}
                  >
                    {activity.action}
                  </p>
                  <span
                    className={cn(
                      'text-xs',
                      isDark ? 'text-neutral-500' : 'text-neutral-500'
                    )}
                  >
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
