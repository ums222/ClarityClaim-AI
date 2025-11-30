import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  User,
  FileText,
  Settings,
  Database,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  getAuditLogs,
  exportAuditLogs,
  AuditLogEntry,
  AuditLogFilters,
  ACTION_CATEGORIES,
  SEVERITY_LEVELS,
  formatRelativeTime,
  formatDate,
} from '../../lib/security';

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAuditLogs({
        ...filters,
        page,
        page_size: pageSize,
      });
      setLogs(result.logs);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await exportAuditLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting logs:', error);
    } finally {
      setExporting(false);
    }
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case 'auth':
        return <Shield className="w-4 h-4" />;
      case 'phi_access':
        return <Eye className="w-4 h-4" />;
      case 'data_export':
        return <Download className="w-4 h-4" />;
      case 'admin':
        return <Settings className="w-4 h-4" />;
      case 'api':
        return <Database className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  }

  function getSeverityBadge(severity: string) {
    const level = SEVERITY_LEVELS.find((l) => l.id === severity);
    const colorClasses: Record<string, string> = {
      gray: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${
          colorClasses[level?.color || 'gray']
        }`}
      >
        {level?.label || severity}
      </span>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  const filteredLogs = searchQuery
    ? logs.filter(
        (log) =>
          log.action_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : logs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Audit Logs
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track all security-relevant actions and PHI access
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={loadLogs}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value || undefined })
                }
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
              >
                <option value="">All Categories</option>
                {ACTION_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Severity
              </label>
              <select
                value={filters.severity || ''}
                onChange={(e) =>
                  setFilters({ ...filters, severity: e.target.value || undefined })
                }
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
              >
                <option value="">All Severities</option>
                {SEVERITY_LEVELS.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Start Date
              </label>
              <Input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) =>
                  setFilters({ ...filters, start_date: e.target.value || undefined })
                }
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                End Date
              </label>
              <Input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) =>
                  setFilters({ ...filters, end_date: e.target.value || undefined })
                }
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.phi_only === true}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    phi_only: e.target.checked ? true : undefined,
                  })
                }
                className="rounded border-slate-300"
              />
              <span className="text-slate-600 dark:text-slate-400">
                PHI Access Only
              </span>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({});
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    PHI
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-900 dark:text-white">
                            {formatRelativeTime(log.created_at)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(log.created_at)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-900 dark:text-white">
                            {log.user_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-slate-500">{log.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {log.action_type?.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-500 max-w-xs truncate">
                        {log.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`p-1 rounded ${
                            ACTION_CATEGORIES.find((c) => c.id === log.action_category)
                              ?.color === 'purple'
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {getCategoryIcon(log.action_category)}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                          {log.action_category?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {log.phi_accessed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          <Eye className="w-3 h-3" />
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <code className="text-xs text-slate-500 dark:text-slate-400">
                        {log.ip_address || '-'}
                      </code>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && total > pageSize && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, total)} of {total} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* HIPAA Notice */}
      <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              HIPAA Audit Requirements
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Audit logs are retained for 7 years as required by HIPAA. All PHI access is tracked
              and logged automatically. Export logs regularly for compliance documentation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AuditLogs;
