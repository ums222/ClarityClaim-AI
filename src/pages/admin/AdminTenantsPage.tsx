import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  TrendingDown,
  ExternalLink,
  Settings,
  Users,
  FileText,
  DollarSign,
  Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AdminLayout from '../../components/admin/AdminLayout';

// Mock tenant data
const tenants = [
  {
    id: '1',
    name: 'Aegis Health System',
    type: 'Health System',
    size: 'Enterprise',
    tier: 'enterprise',
    status: 'active',
    users: 8,
    facilities: 4,
    claims: {
      total: 12450,
      thisMonth: 800,
      denialRate: 0.115,
      baselineDenialRate: 0.19,
    },
    financials: {
      mrr: 4999,
      recovered: 1900000,
      arpu: 625,
    },
    createdAt: '2024-01-15',
    lastActivity: '2 minutes ago',
  },
  {
    id: '2',
    name: 'Unity Community Care Network',
    type: 'FQHC',
    size: 'Medium',
    tier: 'professional',
    status: 'active',
    users: 5,
    facilities: 3,
    claims: {
      total: 6200,
      thisMonth: 500,
      denialRate: 0.14,
      baselineDenialRate: 0.22,
    },
    financials: {
      mrr: 999,
      recovered: 620000,
      arpu: 200,
    },
    createdAt: '2024-03-01',
    lastActivity: '15 minutes ago',
  },
  {
    id: '3',
    name: 'Sunrise Pediatrics Group',
    type: 'Specialty Practice',
    size: 'Small',
    tier: 'starter',
    status: 'active',
    users: 4,
    facilities: 2,
    claims: {
      total: 2800,
      thisMonth: 300,
      denialRate: 0.09,
      baselineDenialRate: 0.15,
    },
    financials: {
      mrr: 299,
      recovered: 280000,
      arpu: 75,
    },
    createdAt: '2024-05-10',
    lastActivity: '1 hour ago',
  },
];

const AdminTenantsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700';
      case 'professional':
        return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'inactive':
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-500';
      case 'suspended':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
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
              Tenants
            </h1>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Manage organizations across the platform
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
              isDark ? "text-neutral-500" : "text-neutral-400"
            )} />
            <Input
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Tenant Cards */}
        <div className="grid gap-4">
          {filteredTenants.map((tenant, index) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "p-0 overflow-hidden cursor-pointer transition-all",
                  selectedTenant === tenant.id && (isDark ? "ring-1 ring-amber-500/50" : "ring-1 ring-amber-500")
                )}
                onClick={() => setSelectedTenant(selectedTenant === tenant.id ? null : tenant.id)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold",
                        isDark
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-amber-100 text-amber-700"
                      )}>
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-semibold",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {tenant.name}
                          </h3>
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                            getTierColor(tenant.tier)
                          )}>
                            {tenant.tier}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                            getStatusColor(tenant.status)
                          )}>
                            {tenant.status}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm mt-0.5",
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          {tenant.type} • {tenant.size} • {tenant.facilities} facilities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/app/admin/tenants/${tenant.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-800">
                    {/* Users */}
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className={cn(
                          "h-4 w-4",
                          isDark ? "text-neutral-500" : "text-neutral-400"
                        )} />
                        <span className={cn(
                          "text-xs uppercase tracking-wider",
                          isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                          Users
                        </span>
                      </div>
                      <p className={cn(
                        "text-lg font-semibold mt-1",
                        isDark ? "text-white" : "text-neutral-900"
                      )}>
                        {tenant.users}
                      </p>
                    </div>

                    {/* Claims */}
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className={cn(
                          "h-4 w-4",
                          isDark ? "text-neutral-500" : "text-neutral-400"
                        )} />
                        <span className={cn(
                          "text-xs uppercase tracking-wider",
                          isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                          Claims/Mo
                        </span>
                      </div>
                      <p className={cn(
                        "text-lg font-semibold mt-1",
                        isDark ? "text-white" : "text-neutral-900"
                      )}>
                        {tenant.claims.thisMonth.toLocaleString()}
                      </p>
                    </div>

                    {/* Denial Rate */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs uppercase tracking-wider",
                          isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                          Denial Rate
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <p className={cn(
                          "text-lg font-semibold",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>
                          {formatPercentage(tenant.claims.denialRate)}
                        </p>
                        <div className="flex items-center text-xs">
                          <TrendingDown className={cn(
                            "h-3 w-3",
                            isDark ? "text-green-400" : "text-green-600"
                          )} />
                          <span className={isDark ? "text-green-400" : "text-green-600"}>
                            from {formatPercentage(tenant.claims.baselineDenialRate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MRR */}
                    <div>
                      <div className="flex items-center gap-2">
                        <DollarSign className={cn(
                          "h-4 w-4",
                          isDark ? "text-neutral-500" : "text-neutral-400"
                        )} />
                        <span className={cn(
                          "text-xs uppercase tracking-wider",
                          isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                          MRR
                        </span>
                      </div>
                      <p className={cn(
                        "text-lg font-semibold mt-1",
                        isDark ? "text-white" : "text-neutral-900"
                      )}>
                        ${tenant.financials.mrr.toLocaleString()}
                      </p>
                    </div>

                    {/* Recovered */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs uppercase tracking-wider",
                          isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                          Recovered
                        </span>
                      </div>
                      <p className={cn(
                        "text-lg font-semibold mt-1",
                        isDark ? "text-green-400" : "text-green-600"
                      )}>
                        {formatCurrency(tenant.financials.recovered)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <p className={cn(
                      "text-xs",
                      isDark ? "text-neutral-500" : "text-neutral-500"
                    )}>
                      Last activity: {tenant.lastActivity}
                    </p>
                    <div className="flex gap-2">
                      <Link to="/app" target="_blank">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open as tenant
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTenants.length === 0 && (
          <Card className="p-8 text-center">
            <Building2 className={cn(
              "h-12 w-12 mx-auto mb-4",
              isDark ? "text-neutral-600" : "text-neutral-400"
            )} />
            <h3 className={cn(
              "font-semibold mb-1",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              No tenants found
            </h3>
            <p className={cn(
              "text-sm",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTenantsPage;
