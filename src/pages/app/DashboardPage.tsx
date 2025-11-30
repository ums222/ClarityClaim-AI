import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Scale,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Loader2,
  Brain,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import AppLayout from '../../components/app/AppLayout';
import { ClaimUploadModal } from '../../components/claims/ClaimUploadModal';
import { CreateAppealModal } from '../../components/appeals/CreateAppealModal';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalClaims: number;
  totalRevenue: number;
  activeAppeals: number;
  denialRate: number;
  claimsChange: number;
  revenueChange: number;
  appealsChange: number;
  denialRateChange: number;
}

interface RecentClaim {
  id: string;
  claim_number: string;
  patient_name: string;
  billed_amount: number;
  status: string;
  denial_risk_score: number | null;
  created_at: string;
}

interface PendingAppeal {
  id: string;
  appeal_number: string;
  claim_id: string;
  original_denial_reason: string | null;
  amount_appealed: number | null;
  deadline: string | null;
  claims?: {
    claim_number: string;
  } | null;
}

const DashboardPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile, organization } = useAuth();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  
  // Real data state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentClaims, setRecentClaims] = useState<RecentClaim[]>([]);
  const [pendingAppeals, setPendingAppeals] = useState<PendingAppeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!supabase) {
      setError('Database not configured');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch claims stats
      const { data: claimsData, error: claimsError } = await supabase
        .from('claims')
        .select('id, status, billed_amount, paid_amount, denial_risk_score, created_at');

      if (claimsError) throw claimsError;

      // Fetch appeals
      const { data: appealsData, error: appealsError } = await supabase
        .from('appeals')
        .select(`
          id,
          appeal_number,
          claim_id,
          original_denial_reason,
          amount_appealed,
          deadline,
          status,
          amount_recovered,
          claims (claim_number)
        `)
        .in('status', ['draft', 'pending_review', 'submitted', 'under_review']);

      if (appealsError) throw appealsError;

      // Fetch recent claims
      const { data: recentClaimsData, error: recentError } = await supabase
        .from('claims')
        .select('id, claim_number, patient_name, billed_amount, status, denial_risk_score, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // Calculate stats
      const totalClaims = claimsData?.length || 0;
      const deniedClaims = claimsData?.filter(c => c.status === 'denied' || c.status === 'partially_denied').length || 0;
      const paidClaims = claimsData?.filter(c => c.status === 'paid' || c.status === 'appeal_won');
      const totalRevenue = paidClaims?.reduce((sum, c) => sum + (c.paid_amount || 0), 0) || 0;
      const denialRate = totalClaims > 0 ? (deniedClaims / totalClaims) * 100 : 0;

      setStats({
        totalClaims,
        totalRevenue,
        activeAppeals: appealsData?.length || 0,
        denialRate,
        // Mock changes for now - could calculate from historical data
        claimsChange: 12,
        revenueChange: 18,
        appealsChange: -8,
        denialRateChange: -24,
      });

      setRecentClaims(recentClaimsData || []);
      // Transform appeals data - Supabase returns claims as array, take first item
      const transformedAppeals = (appealsData || []).map(appeal => ({
        ...appeal,
        claims: Array.isArray(appeal.claims) ? appeal.claims[0] : appeal.claims
      }));
      setPendingAppeals(transformedAppeals);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleExportReport = () => {
    if (!stats) return;
    
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ['Total Claims', stats.totalClaims.toString(), `+${stats.claimsChange}%`],
      ['Revenue Recovered', `$${stats.totalRevenue.toLocaleString()}`, `+${stats.revenueChange}%`],
      ['Active Appeals', stats.activeAppeals.toString(), `${stats.appealsChange}%`],
      ['Denial Rate', `${stats.denialRate.toFixed(1)}%`, `${stats.denialRateChange}%`],
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clarityclaim-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'appeal_won':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'denied':
      case 'appeal_lost':
        return isDark ? 'text-red-400' : 'text-red-600';
      case 'pending':
      case 'pending_review':
      case 'in_process':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return isDark ? 'text-blue-400' : 'text-blue-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'appeal_won':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'denied':
      case 'appeal_lost':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
      case 'pending_review':
      case 'in_process':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRiskLevel = (score: number | null): string => {
    if (score === null) return 'unknown';
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      case 'medium':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
      case 'low':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-50 text-neutral-600';
    }
  };


  const formatDeadline = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  };

  const statsDisplay = stats ? [
    {
      name: 'Total Claims',
      value: stats.totalClaims.toLocaleString(),
      change: `+${stats.claimsChange}%`,
      trend: 'up' as const,
      icon: FileText,
    },
    {
      name: 'Revenue Recovered',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `+${stats.revenueChange}%`,
      trend: 'up' as const,
      icon: DollarSign,
    },
    {
      name: 'Active Appeals',
      value: stats.activeAppeals.toString(),
      change: `${stats.appealsChange}%`,
      trend: stats.appealsChange > 0 ? 'up' as const : 'down' as const,
      icon: Scale,
    },
    {
      name: 'Denial Rate',
      value: `${stats.denialRate.toFixed(1)}%`,
      change: `${stats.denialRateChange}%`,
      trend: 'down' as const,
      icon: AlertTriangle,
    },
  ] : [];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className={cn(
              "h-8 w-8 animate-spin mx-auto mb-4",
              isDark ? "text-teal-400" : "text-teal-600"
            )} />
            <p className={cn(
              "text-sm",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Loading dashboard...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertTriangle className={cn(
              "h-8 w-8 mx-auto mb-4",
              isDark ? "text-red-400" : "text-red-600"
            )} />
            <p className={cn(
              "text-sm font-medium mb-2",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              {error}
            </p>
            <Button onClick={fetchDashboardData}>
              Try Again
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn(
              "text-2xl font-semibold tracking-tight",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}
            </h1>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              {organization?.name ? `${organization.name} • ` : ''}Here's what's happening with your claims today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
              Upload Claims
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsDisplay.map((stat, index) => (
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
                    isDark ? "bg-neutral-800" : "bg-neutral-100"
                  )}>
                    <stat.icon className={cn(
                      "h-5 w-5",
                      isDark ? "text-teal-400" : "text-teal-600"
                    )} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    stat.name === 'Denial Rate'
                      ? isDark ? "text-green-400" : "text-green-600"
                      : stat.trend === 'up'
                        ? isDark ? "text-green-400" : "text-green-600"
                        : isDark ? "text-red-400" : "text-red-600"
                  )}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stat.change}
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
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Insights Banner */}
        {stats && stats.denialRate > 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={cn(
              "p-4",
              isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200"
            )}>
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-amber-500/20" : "bg-amber-100"
                )}>
                  <Brain className={cn(
                    "h-5 w-5",
                    isDark ? "text-amber-400" : "text-amber-600"
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium",
                    isDark ? "text-amber-300" : "text-amber-800"
                  )}>
                    AI Insight: High Denial Rate Detected
                  </h3>
                  <p className={cn(
                    "text-sm mt-1",
                    isDark ? "text-amber-400/80" : "text-amber-700"
                  )}>
                    Your current denial rate of {stats.denialRate.toFixed(1)}% is above the industry average. 
                    ClarityAI has identified patterns that could help reduce denials by up to 40%.
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className={cn(
                    isDark 
                      ? "border-amber-500/50 text-amber-400 hover:bg-amber-500/20" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100"
                  )}
                  onClick={() => navigate('/app/claims?risk=high')}
                >
                  View Analysis
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Claims */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className={cn(
                  "font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Recent Claims
                </h2>
                <Link
                  to="/app/claims"
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    isDark
                      ? "text-teal-400 hover:text-teal-300"
                      : "text-teal-600 hover:text-teal-700"
                  )}
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {recentClaims.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className={cn(
                      "h-8 w-8 mx-auto mb-2",
                      isDark ? "text-neutral-600" : "text-neutral-400"
                    )} />
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    )}>
                      No claims yet. Upload your first claim to get started.
                    </p>
                  </div>
                ) : (
                  recentClaims.map((claim) => (
                    <Link
                      key={claim.id}
                      to={`/app/claims/${claim.id}`}
                      className={cn(
                        "flex items-center gap-4 p-4 transition-colors",
                        isDark
                          ? "hover:bg-neutral-800/50"
                          : "hover:bg-neutral-50"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn(
                            "text-sm font-medium",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {claim.claim_number}
                          </p>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                            getRiskColor(getRiskLevel(claim.denial_risk_score))
                          )}>
                            {getRiskLevel(claim.denial_risk_score)} risk
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm mt-0.5",
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          {claim.patient_name}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>
                          ${claim.billed_amount?.toLocaleString() || '0'}
                        </p>
                        <div className={cn(
                          "flex items-center justify-end gap-1 text-xs mt-0.5 capitalize",
                          getStatusColor(claim.status)
                        )}>
                          {getStatusIcon(claim.status)}
                          {claim.status.replace('_', ' ')}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Pending Appeals */}
          <div>
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className={cn(
                  "font-semibold",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Pending Appeals
                </h2>
                <Link
                  to="/app/appeals"
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    isDark
                      ? "text-teal-400 hover:text-teal-300"
                      : "text-teal-600 hover:text-teal-700"
                  )}
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="p-4 space-y-4">
                {pendingAppeals.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className={cn(
                      "h-8 w-8 mx-auto mb-2",
                      isDark ? "text-green-400" : "text-green-600"
                    )} />
                    <p className={cn(
                      "text-sm font-medium",
                      isDark ? "text-white" : "text-neutral-900"
                    )}>
                      All caught up!
                    </p>
                    <p className={cn(
                      "text-xs mt-1",
                      isDark ? "text-neutral-500" : "text-neutral-500"
                    )}>
                      No pending appeals to review.
                    </p>
                  </div>
                ) : (
                  pendingAppeals.slice(0, 3).map((appeal) => (
                    <Link
                      key={appeal.id}
                      to={`/app/appeals/${appeal.id}`}
                      className={cn(
                        "block p-3 rounded-lg transition-colors",
                        isDark
                          ? "bg-neutral-800/50 ring-1 ring-neutral-800 hover:bg-neutral-800"
                          : "bg-neutral-50 ring-1 ring-neutral-200 hover:bg-neutral-100"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            isDark ? "text-white" : "text-neutral-900"
                          )}>
                            {appeal.appeal_number}
                          </p>
                          <p className={cn(
                            "text-xs mt-0.5",
                            isDark ? "text-neutral-500" : "text-neutral-500"
                          )}>
                            {appeal.claims?.claim_number || appeal.claim_id}
                          </p>
                        </div>
                        <p className={cn(
                          "text-sm font-medium",
                          isDark ? "text-teal-400" : "text-teal-600"
                        )}>
                          ${appeal.amount_appealed?.toLocaleString() || '0'}
                        </p>
                      </div>
                      
                      {appeal.original_denial_reason && (
                        <p className={cn(
                          "text-xs mt-2 line-clamp-2",
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        )}>
                          {appeal.original_denial_reason}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className={cn(
                          "flex items-center gap-1 text-xs",
                          isDark ? "text-yellow-400" : "text-yellow-600"
                        )}>
                          <Clock className="h-3 w-3" />
                          Due in {formatDeadline(appeal.deadline)}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4 p-4">
              <h3 className={cn(
                "font-medium mb-3",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Upload New Claims
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsAppealModalOpen(true)}
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Draft Appeal Letter
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/app/claims?risk=high')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Review High-Risk Claims
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ClaimUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          setIsUploadModalOpen(false);
          fetchDashboardData();
        }}
      />

      <CreateAppealModal
        isOpen={isAppealModalOpen}
        onClose={() => setIsAppealModalOpen(false)}
        onSuccess={() => {
          setIsAppealModalOpen(false);
          navigate('/app/appeals');
        }}
      />
    </AppLayout>
  );
};

export default DashboardPage;
