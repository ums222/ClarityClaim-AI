import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '../../components/app/AppLayout';
import {
  Scale,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  Sparkles,
  RefreshCw,
  Eye,
  Edit,
  Send,
  MoreVertical,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { 
  Appeal, 
  AppealFilters, 
  AppealStats,
  getAppeals, 
  getAppealStats,
  STATUS_LABELS, 
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  APPEAL_TYPE_LABELS,
  OUTCOME_LABELS,
  AppealStatus,
  AppealPriority,
} from '../../lib/appeals';
import { CreateAppealModal } from '../../components/appeals/CreateAppealModal';

// Status Badge Component
function StatusBadge({ status, size = 'md' }: { status: AppealStatus; size?: 'sm' | 'md' }) {
  const colorMap: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    lime: 'bg-lime-50 text-lime-700 border-lime-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const color = STATUS_COLORS[status] || 'gray';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${colorMap[color]}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// Priority Badge Component  
function PriorityBadge({ priority }: { priority: AppealPriority }) {
  const colorMap: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  const color = PRIORITY_COLORS[priority] || 'slate';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorMap[color]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = 'blue' 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    amber: 'bg-gradient-to-br from-amber-500 to-amber-600',
    red: 'bg-gradient-to-br from-red-500 to-red-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className={`w-3 h-3 mr-1 ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={trend.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-gray-400 ml-1">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Appeal Row Component
function AppealRow({ appeal }: { appeal: Appeal }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const daysToDeadline = appeal.days_to_deadline;
  const isUrgent = daysToDeadline !== null && daysToDeadline !== undefined && daysToDeadline <= 7 && daysToDeadline >= 0;
  const isPastDeadline = daysToDeadline !== null && daysToDeadline !== undefined && daysToDeadline < 0;

  return (
    <motion.tr 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group hover:bg-gray-50/50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {appeal.ai_generated ? (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </div>
          <div className="ml-3">
            <Link 
              to={`/app/appeals/${appeal.id}`}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              {appeal.appeal_number}
            </Link>
            <p className="text-xs text-gray-500">
              Level {appeal.appeal_level} • {APPEAL_TYPE_LABELS[appeal.appeal_type]}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {appeal.claim ? (
          <div>
            <Link 
              to={`/app/claims/${appeal.claim_id}`}
              className="text-sm text-gray-900 hover:text-blue-600 transition-colors"
            >
              {appeal.claim.claim_number}
            </Link>
            <p className="text-xs text-gray-500">{appeal.claim.patient_name}</p>
          </div>
        ) : (
          <span className="text-sm text-gray-400">No linked claim</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={appeal.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <PriorityBadge priority={appeal.priority} />
      </td>
      <td className="px-6 py-4">
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate">
            {appeal.original_denial_reason || 'No denial reason specified'}
          </p>
          {appeal.original_denial_code && (
            <p className="text-xs text-gray-500">Code: {appeal.original_denial_code}</p>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <p className="text-sm font-medium text-gray-900">
          ${(appeal.amount_appealed || 0).toLocaleString()}
        </p>
        {appeal.amount_recovered && appeal.amount_recovered > 0 && (
          <p className="text-xs text-green-600">
            +${appeal.amount_recovered.toLocaleString()} recovered
          </p>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {appeal.deadline ? (
          <div className={`flex items-center ${isPastDeadline ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-gray-500'}`}>
            {isPastDeadline ? (
              <AlertCircle className="w-4 h-4 mr-1" />
            ) : isUrgent ? (
              <AlertTriangle className="w-4 h-4 mr-1" />
            ) : (
              <Calendar className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm">
              {isPastDeadline 
                ? `${Math.abs(daysToDeadline!)} days overdue`
                : daysToDeadline === 0
                ? 'Due today'
                : `${daysToDeadline} days left`
              }
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">No deadline</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {appeal.outcome ? (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            appeal.outcome === 'approved' ? 'bg-green-100 text-green-700' :
            appeal.outcome === 'partially_approved' ? 'bg-lime-100 text-lime-700' :
            appeal.outcome === 'denied' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {OUTCOME_LABELS[appeal.outcome]}
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => navigate(`/app/appeals/${appeal.id}`)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/app/appeals/${appeal.id}/edit`)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                <button
                  onClick={() => {
                    navigate(`/app/appeals/${appeal.id}`);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement submit
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Appeal
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </motion.tr>
  );
}

export default function AppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [stats, setStats] = useState<AppealStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AppealFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy] = useState('created_at');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchAppeals = useCallback(async () => {
    setLoading(true);
    try {
      const searchFilters = { ...filters };
      if (searchQuery) {
        searchFilters.search = searchQuery;
      }
      
      const { appeals: data, total: totalCount } = await getAppeals(
        searchFilters,
        page,
        pageSize,
        sortBy,
        sortOrder
      );
      setAppeals(data);
      setTotal(totalCount);
    } catch (error) {
      console.error('Failed to fetch appeals:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, page, pageSize, sortBy, sortOrder]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getAppealStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchAppeals();
    fetchStats();
  }, [fetchAppeals, fetchStats]);

  const handleFilterChange = (key: keyof AppealFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto px-2 py-4 lg:px-6 lg:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Appeals Management
            </h1>
            <p className="text-gray-500 mt-1">
              Track, manage, and optimize your claim appeals workflow
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchAppeals(); fetchStats(); }}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              New Appeal
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Total Appeals"
            value={stats?.total || 0}
            icon={Scale}
            color="blue"
          />
          <StatCard
            title="In Progress"
            value={(stats?.byStatus?.draft || 0) + (stats?.byStatus?.submitted || 0) + (stats?.byStatus?.under_review || 0)}
            subtitle="Active appeals"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Success Rate"
            value={`${(stats?.successRate || 0).toFixed(1)}%`}
            subtitle="Appeals won"
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Total Recovered"
            value={`$${((stats?.totalRecovered || 0) / 1000).toFixed(0)}K`}
            subtitle={`${((stats?.recoveryRate || 0)).toFixed(1)}% recovery rate`}
            icon={DollarSign}
            color="purple"
          />
          <StatCard
            title="Pending Deadlines"
            value={stats?.pendingDeadlines || 0}
            subtitle="Due within 7 days"
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="Avg Resolution"
            value={`${stats?.avgDaysToResolution || 0} days`}
            subtitle="Time to outcome"
            icon={TrendingUp}
            color="blue"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="p-4 flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appeals by number or denial reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAppeals()}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Clear Filters */}
            {(Object.keys(filters).length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-gray-100"
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status?.[0] || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value as AppealStatus] : undefined)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={filters.priority?.[0] || ''}
                      onChange={(e) => handleFilterChange('priority', e.target.value ? [e.target.value as AppealPriority] : undefined)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Priorities</option>
                      {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Outcome Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
                    <select
                      value={(filters.outcome as string[])?.[0] || ''}
                      onChange={(e) => handleFilterChange('outcome', e.target.value ? [e.target.value] : undefined)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Outcomes</option>
                      {Object.entries(OUTCOME_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Appeal Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appeal Type</label>
                    <select
                      value={filters.appeal_type?.[0] || ''}
                      onChange={(e) => handleFilterChange('appeal_type', e.target.value ? [e.target.value] : undefined)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {Object.entries(APPEAL_TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Appeals Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Appeal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Linked Claim
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Denial Reason
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Outcome
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-20">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500">Loading appeals...</p>
                      </div>
                    </td>
                  </tr>
                ) : appeals.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-20">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Scale className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No appeals found</h3>
                        <p className="text-gray-500 mb-4">
                          {Object.keys(filters).length > 0 || searchQuery
                            ? 'Try adjusting your filters or search query'
                            : 'Create your first appeal to get started'
                          }
                        </p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Create Appeal
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  appeals.map((appeal) => (
                    <AppealRow key={appeal.id} appeal={appeal} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > pageSize && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} appeals
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link 
            to="/app/appeals/templates"
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Appeal Templates
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Browse and manage pre-built templates
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </Link>

          <Link 
            to="/app/analytics"
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Appeals Analytics
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View success rates and patterns
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </Link>

          <Link 
            to="/app/claims?status=denied"
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  Denied Claims
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View claims needing appeals
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
            </div>
          </Link>
        </div>

        {/* Create Appeal Modal */}
        <CreateAppealModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchAppeals();
            fetchStats();
          }}
        />
      </div>
    </AppLayout>
  );
}
