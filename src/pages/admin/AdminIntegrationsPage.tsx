import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plug,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Activity,
  Database,
  Wifi,
  Clock,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

// Mock integration data
const ehrConnections = [
  {
    id: '1',
    name: 'Epic - Aegis Production',
    provider: 'epic',
    organization: 'Aegis Health System',
    status: 'connected',
    lastSync: '5 minutes ago',
    recordsSynced: 12450,
    environment: 'production',
  },
  {
    id: '2',
    name: 'Cerner - Aegis Clinics',
    provider: 'cerner',
    organization: 'Aegis Health System',
    status: 'connected',
    lastSync: '1 hour ago',
    recordsSynced: 4200,
    environment: 'production',
  },
  {
    id: '3',
    name: 'Athena - Unity Primary Care',
    provider: 'athena',
    organization: 'Unity Community Care Network',
    status: 'warning',
    lastSync: '6 hours ago',
    recordsSynced: 3100,
    environment: 'production',
    warning: 'Token expires in 2 days',
  },
  {
    id: '4',
    name: 'eClinicalWorks - Sunrise',
    provider: 'eclinicalworks',
    organization: 'Sunrise Pediatrics Group',
    status: 'connected',
    lastSync: '30 minutes ago',
    recordsSynced: 1800,
    environment: 'production',
  },
];

const payerConnections = [
  {
    id: '1',
    name: 'Availity Clearinghouse',
    type: 'clearinghouse',
    organizations: ['Aegis Health System', 'Unity Community Care Network'],
    status: 'connected',
    claimsSubmitted: 8500,
    acceptanceRate: 0.97,
  },
  {
    id: '2',
    name: 'Change Healthcare',
    type: 'clearinghouse',
    organizations: ['Sunrise Pediatrics Group'],
    status: 'connected',
    claimsSubmitted: 2100,
    acceptanceRate: 0.95,
  },
  {
    id: '3',
    name: 'Medicare Direct',
    type: 'direct',
    organizations: ['Aegis Health System', 'Unity Community Care Network'],
    status: 'connected',
    claimsSubmitted: 4200,
    acceptanceRate: 0.98,
  },
  {
    id: '4',
    name: 'BCBS Portal',
    type: 'portal',
    organizations: ['Aegis Health System'],
    status: 'error',
    error: 'Authentication failed - credentials expired',
  },
];

const AdminIntegrationsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'ehr' | 'payer'>('ehr');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50';
      case 'warning':
        return isDark ? 'text-amber-400 bg-amber-500/10' : 'text-amber-600 bg-amber-50';
      case 'error':
        return isDark ? 'text-red-400 bg-red-500/10' : 'text-red-600 bg-red-50';
      default:
        return isDark ? 'text-neutral-400 bg-neutral-500/10' : 'text-neutral-500 bg-neutral-50';
    }
  };

  const getProviderLogo = (provider: string) => {
    const colors: Record<string, string> = {
      epic: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600',
      cerner: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600',
      athena: isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600',
      eclinicalworks: isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600',
    };
    return colors[provider] || (isDark ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-100 text-neutral-600');
  };

  const connectedEHRs = ehrConnections.filter(c => c.status === 'connected').length;
  const connectedPayers = payerConnections.filter(c => c.status === 'connected').length;

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
              Integrations
            </h1>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Monitor EHR and payer connections across all tenants
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-teal-500/10" : "bg-teal-50"
              )}>
                <Database className={cn("h-5 w-5", isDark ? "text-teal-400" : "text-teal-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {ehrConnections.length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  EHR Connections
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-blue-500/10" : "bg-blue-50"
              )}>
                <Wifi className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {payerConnections.length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Payer Connections
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-green-500/10" : "bg-green-50"
              )}>
                <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {connectedEHRs + connectedPayers}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Healthy
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-amber-500/10" : "bg-amber-50"
              )}>
                <AlertTriangle className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
              </div>
              <div>
                <p className={cn("text-2xl font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                  {ehrConnections.filter(c => c.status !== 'connected').length + payerConnections.filter(c => c.status !== 'connected').length}
                </p>
                <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Need Attention
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('ehr')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === 'ehr'
                ? isDark
                  ? "text-amber-400 border-amber-400"
                  : "text-amber-600 border-amber-600"
                : isDark
                  ? "text-neutral-400 border-transparent hover:text-white"
                  : "text-neutral-500 border-transparent hover:text-neutral-900"
            )}
          >
            EHR Connections ({ehrConnections.length})
          </button>
          <button
            onClick={() => setActiveTab('payer')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === 'payer'
                ? isDark
                  ? "text-amber-400 border-amber-400"
                  : "text-amber-600 border-amber-600"
                : isDark
                  ? "text-neutral-400 border-transparent hover:text-white"
                  : "text-neutral-500 border-transparent hover:text-neutral-900"
            )}
          >
            Payer Connections ({payerConnections.length})
          </button>
        </div>

        {/* EHR Connections */}
        {activeTab === 'ehr' && (
          <div className="grid gap-4">
            {ehrConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold uppercase",
                        getProviderLogo(connection.provider)
                      )}>
                        {connection.provider.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-semibold",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {connection.name}
                          </h3>
                          <span className={cn(
                            "flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
                            getStatusColor(connection.status)
                          )}>
                            {getStatusIcon(connection.status)}
                            {connection.status === 'connected' ? 'Connected' : connection.status}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm mt-0.5",
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          {connection.organization}
                        </p>
                        {connection.warning && (
                          <p className={cn(
                            "text-xs mt-1 flex items-center gap-1",
                            isDark ? "text-amber-400" : "text-amber-600"
                          )}>
                            <AlertTriangle className="h-3 w-3" />
                            {connection.warning}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div>
                      <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        Last Sync
                      </p>
                      <p className={cn("text-sm font-medium mt-1", isDark ? "text-white" : "text-neutral-900")}>
                        {connection.lastSync}
                      </p>
                    </div>
                    <div>
                      <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        Records Synced
                      </p>
                      <p className={cn("text-sm font-medium mt-1", isDark ? "text-white" : "text-neutral-900")}>
                        {connection.recordsSynced.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        Environment
                      </p>
                      <p className={cn("text-sm font-medium mt-1 capitalize", isDark ? "text-white" : "text-neutral-900")}>
                        {connection.environment}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Payer Connections */}
        {activeTab === 'payer' && (
          <div className="grid gap-4">
            {payerConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"
                      )}>
                        <Plug className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-semibold",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {connection.name}
                          </h3>
                          <span className={cn(
                            "flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
                            getStatusColor(connection.status)
                          )}>
                            {getStatusIcon(connection.status)}
                            {connection.status === 'connected' ? 'Connected' : connection.status}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                            isDark ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600"
                          )}>
                            {connection.type}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm mt-0.5",
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          {connection.organizations.join(', ')}
                        </p>
                        {connection.error && (
                          <p className={cn(
                            "text-xs mt-1 flex items-center gap-1",
                            isDark ? "text-red-400" : "text-red-600"
                          )}>
                            <XCircle className="h-3 w-3" />
                            {connection.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {connection.claimsSubmitted && (
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <div>
                        <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                          Claims Submitted
                        </p>
                        <p className={cn("text-sm font-medium mt-1", isDark ? "text-white" : "text-neutral-900")}>
                          {connection.claimsSubmitted.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                          Acceptance Rate
                        </p>
                        <p className={cn(
                          "text-sm font-medium mt-1",
                          connection.acceptanceRate >= 0.95
                            ? isDark ? "text-green-400" : "text-green-600"
                            : isDark ? "text-amber-400" : "text-amber-600"
                        )}>
                          {(connection.acceptanceRate * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminIntegrationsPage;
