import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  FileText,
  Scale,
  TrendingUp,
  DollarSign,
  Brain,
  AlertTriangle,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

// Platform-wide stats
const platformStats = [
  {
    name: 'Total Tenants',
    value: '3',
    subtext: 'Active organizations',
    icon: Building2,
    color: 'amber',
  },
  {
    name: 'Total Users',
    value: '12',
    subtext: 'Across all tenants',
    icon: Users,
    color: 'blue',
  },
  {
    name: 'Total Claims',
    value: '1,600',
    subtext: 'Processed this month',
    icon: FileText,
    color: 'teal',
  },
  {
    name: 'Revenue Recovered',
    value: '$2.8M',
    subtext: 'YTD across platform',
    icon: DollarSign,
    color: 'green',
  },
];

// Tenant summary data
const tenantSummary = [
  {
    name: 'Aegis Health System',
    type: 'Health System',
    tier: 'Enterprise',
    claims: 800,
    denialRate: '11.5%',
    recovered: '$1.9M',
    trend: 'up',
  },
  {
    name: 'Unity Community Care Network',
    type: 'FQHC',
    tier: 'Professional',
    claims: 500,
    denialRate: '14.0%',
    recovered: '$620K',
    trend: 'up',
  },
  {
    name: 'Sunrise Pediatrics Group',
    type: 'Specialty Practice',
    tier: 'Starter',
    claims: 300,
    denialRate: '9.0%',
    recovered: '$280K',
    trend: 'up',
  },
];

// AI activity summary
const aiActivity = [
  { action: 'Denial Risk Predictions', count: '4,250', trend: '+12%' },
  { action: 'Appeal Letters Generated', count: '890', trend: '+24%' },
  { action: 'Equity Analyses Run', count: '156', trend: '+8%' },
];

// Recent platform events
const recentEvents = [
  { type: 'ai', message: 'AI model ccai-denial-risk-v1.3 completed 500 inferences', time: '2 minutes ago' },
  { type: 'tenant', message: 'Aegis Health System processed 45 appeals today', time: '15 minutes ago' },
  { type: 'alert', message: 'Equity disparity detected in Unity Care ZIP 48207', time: '1 hour ago' },
  { type: 'success', message: 'Appeal APL-AEG-2024-001234 approved - $47,500 recovered', time: '2 hours ago' },
];

const AdminDashboardPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getStatColor = (color: string) => {
    const colors = {
      amber: isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600',
      blue: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600',
      teal: isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600',
      green: isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600',
    };
    return colors[color as keyof typeof colors] || colors.teal;
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'enterprise':
        return isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700';
      case 'professional':
        return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-700';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Brain className="h-4 w-4" />;
      case 'tenant':
        return <Building2 className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'ai':
        return isDark ? 'text-teal-400' : 'text-teal-600';
      case 'alert':
        return isDark ? 'text-amber-400' : 'text-amber-600';
      case 'success':
        return isDark ? 'text-green-400' : 'text-green-600';
      default:
        return isDark ? 'text-neutral-400' : 'text-neutral-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn(
              "text-2xl font-semibold tracking-tight",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Admin Dashboard
            </h1>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Platform-wide overview and cross-tenant management
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/admin/demo-scenarios">
                <Sparkles className="h-4 w-4 mr-2" />
                Demo Scenarios
              </Link>
            </Button>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformStats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "p-2 rounded-lg",
                    getStatColor(stat.color)
                  )}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className={cn(
                    "text-2xl font-semibold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    {stat.value}
                  </p>
                  <p className={cn(
                    "text-xs mt-1",
                    isDark ? "text-neutral-500" : "text-neutral-500"
                  )}>
                    {stat.name}
                  </p>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-neutral-600" : "text-neutral-400"
                  )}>
                    {stat.subtext}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tenant Summary */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className={cn(
                  "font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Tenant Overview
                </h2>
                <Link
                  to="/app/admin/tenants"
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    isDark
                      ? "text-amber-400 hover:text-amber-300"
                      : "text-amber-600 hover:text-amber-700"
                  )}
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={cn(
                      "border-b",
                      isDark ? "border-neutral-800" : "border-neutral-200"
                    )}>
                      <th className={cn(
                        "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        Organization
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        Tier
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-right text-xs font-medium uppercase tracking-wider",
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        Claims
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-right text-xs font-medium uppercase tracking-wider",
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        Denial Rate
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-right text-xs font-medium uppercase tracking-wider",
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      )}>
                        Recovered
                      </th>
                    </tr>
                  </thead>
                  <tbody className={cn(
                    "divide-y",
                    isDark ? "divide-neutral-800" : "divide-neutral-200"
                  )}>
                    {tenantSummary.map((tenant) => (
                      <tr
                        key={tenant.name}
                        className={cn(
                          "transition-colors",
                          isDark
                            ? "hover:bg-neutral-800/50"
                            : "hover:bg-neutral-50"
                        )}
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className={cn(
                              "text-sm font-medium",
                              isDark ? "text-white" : "text-neutral-900"
                            )}>
                              {tenant.name}
                            </p>
                            <p className={cn(
                              "text-xs",
                              isDark ? "text-neutral-500" : "text-neutral-500"
                            )}>
                              {tenant.type}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            getTierColor(tenant.tier)
                          )}>
                            {tenant.tier}
                          </span>
                        </td>
                        <td className={cn(
                          "px-4 py-4 text-right text-sm",
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        )}>
                          {tenant.claims.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className={cn(
                              "text-sm font-medium",
                              isDark ? "text-neutral-300" : "text-neutral-700"
                            )}>
                              {tenant.denialRate}
                            </span>
                            <TrendingUp className={cn(
                              "h-3 w-3",
                              isDark ? "text-green-400" : "text-green-600"
                            )} />
                          </div>
                        </td>
                        <td className={cn(
                          "px-4 py-4 text-right text-sm font-medium",
                          isDark ? "text-green-400" : "text-green-600"
                        )}>
                          {tenant.recovered}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Activity */}
            <Card className="p-4">
              <h3 className={cn(
                "font-semibold mb-4",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                AI Platform Activity
              </h3>
              <div className="space-y-3">
                {aiActivity.map((item) => (
                  <div
                    key={item.action}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className={cn(
                        "h-4 w-4",
                        isDark ? "text-teal-400" : "text-teal-600"
                      )} />
                      <span className={cn(
                        "text-sm",
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      )}>
                        {item.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-medium",
                        isDark ? "text-white" : "text-neutral-900"
                      )}>
                        {item.count}
                      </span>
                      <span className={cn(
                        "text-xs",
                        isDark ? "text-green-400" : "text-green-600"
                      )}>
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <Link
                  to="/app/admin/ai-governance"
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    isDark
                      ? "text-amber-400 hover:text-amber-300"
                      : "text-amber-600 hover:text-amber-700"
                  )}
                >
                  AI Governance
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>

            {/* Recent Events */}
            <Card className="p-4">
              <h3 className={cn(
                "font-semibold mb-4",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                Recent Platform Events
              </h3>
              <div className="space-y-3">
                {recentEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-3 p-2 rounded-lg",
                      isDark ? "bg-neutral-800/30" : "bg-neutral-50"
                    )}
                  >
                    <div className={getEventColor(event.type)}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs",
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      )}>
                        {event.message}
                      </p>
                      <p className={cn(
                        "text-xs flex items-center gap-1 mt-1",
                        isDark ? "text-neutral-500" : "text-neutral-400"
                      )}>
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <Link
                  to="/app/admin/audit-log"
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    isDark
                      ? "text-amber-400 hover:text-amber-300"
                      : "text-amber-600 hover:text-amber-700"
                  )}
                >
                  View Audit Log
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/app/admin/tenants">
            <Card className={cn(
              "p-4 transition-all cursor-pointer",
              isDark
                ? "hover:bg-neutral-800/50 hover:border-neutral-700"
                : "hover:bg-neutral-50 hover:border-neutral-300"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-amber-500/10" : "bg-amber-50"
                )}>
                  <Building2 className={cn(
                    "h-5 w-5",
                    isDark ? "text-amber-400" : "text-amber-600"
                  )} />
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    Manage Tenants
                  </p>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-neutral-500" : "text-neutral-500"
                  )}>
                    View & configure orgs
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/app/admin/users">
            <Card className={cn(
              "p-4 transition-all cursor-pointer",
              isDark
                ? "hover:bg-neutral-800/50 hover:border-neutral-700"
                : "hover:bg-neutral-50 hover:border-neutral-300"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-blue-500/10" : "bg-blue-50"
                )}>
                  <Users className={cn(
                    "h-5 w-5",
                    isDark ? "text-blue-400" : "text-blue-600"
                  )} />
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    Manage Users
                  </p>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-neutral-500" : "text-neutral-500"
                  )}>
                    All platform users
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/app/admin/integrations">
            <Card className={cn(
              "p-4 transition-all cursor-pointer",
              isDark
                ? "hover:bg-neutral-800/50 hover:border-neutral-700"
                : "hover:bg-neutral-50 hover:border-neutral-300"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-teal-500/10" : "bg-teal-50"
                )}>
                  <Scale className={cn(
                    "h-5 w-5",
                    isDark ? "text-teal-400" : "text-teal-600"
                  )} />
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    Integrations
                  </p>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-neutral-500" : "text-neutral-500"
                  )}>
                    EHR & payer status
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/app/admin/demo-scenarios">
            <Card className={cn(
              "p-4 transition-all cursor-pointer",
              isDark
                ? "hover:bg-neutral-800/50 hover:border-neutral-700"
                : "hover:bg-neutral-50 hover:border-neutral-300"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-purple-500/10" : "bg-purple-50"
                )}>
                  <Sparkles className={cn(
                    "h-5 w-5",
                    isDark ? "text-purple-400" : "text-purple-600"
                  )} />
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    Demo Scenarios
                  </p>
                  <p className={cn(
                    "text-xs",
                    isDark ? "text-neutral-500" : "text-neutral-500"
                  )}>
                    Hero claims & stories
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
