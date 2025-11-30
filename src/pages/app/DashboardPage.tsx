import { useState } from 'react';
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

// Mock data for dashboard
const stats = [
  {
    name: 'Total Claims',
    value: '1,284',
    change: '+12%',
    trend: 'up',
    icon: FileText,
  },
  {
    name: 'Revenue Recovered',
    value: '$423,890',
    change: '+18%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    name: 'Active Appeals',
    value: '47',
    change: '-8%',
    trend: 'down',
    icon: Scale,
  },
  {
    name: 'Denial Rate',
    value: '8.2%',
    change: '-24%',
    trend: 'down',
    icon: AlertTriangle,
  },
];

const recentClaims = [
  {
    id: 'CLM-2024-001',
    patient: 'John Smith',
    amount: '$4,250',
    status: 'pending',
    risk: 'low',
    date: '2 hours ago',
  },
  {
    id: 'CLM-2024-002',
    patient: 'Sarah Johnson',
    amount: '$12,800',
    status: 'submitted',
    risk: 'medium',
    date: '4 hours ago',
  },
  {
    id: 'CLM-2024-003',
    patient: 'Michael Brown',
    amount: '$8,450',
    status: 'denied',
    risk: 'high',
    date: '1 day ago',
  },
  {
    id: 'CLM-2024-004',
    patient: 'Emily Davis',
    amount: '$3,200',
    status: 'approved',
    risk: 'low',
    date: '2 days ago',
  },
];

const pendingAppeals = [
  {
    id: 'APL-2024-001',
    claimId: 'CLM-2024-003',
    reason: 'Prior authorization required',
    amount: '$8,450',
    deadline: '3 days',
  },
  {
    id: 'APL-2024-002',
    claimId: 'CLM-2024-098',
    reason: 'Medical necessity not established',
    amount: '$15,200',
    deadline: '5 days',
  },
];

const DashboardPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);

  const handleExportReport = () => {
    // Create a simple CSV export of dashboard data
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ...stats.map(s => [s.name, s.value, s.change])
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
      case 'approved':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'denied':
        return isDark ? 'text-red-400' : 'text-red-600';
      case 'pending':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return isDark ? 'text-blue-400' : 'text-blue-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'denied':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      case 'medium':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
      default:
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
    }
  };

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
              Here's what's happening with your claims today.
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
          {stats.map((stat, index) => (
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
                    stat.trend === 'up'
                      ? stat.name === 'Denial Rate'
                        ? isDark ? "text-green-400" : "text-green-600"
                        : isDark ? "text-green-400" : "text-green-600"
                      : stat.name === 'Denial Rate'
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
                {recentClaims.map((claim) => (
                  <div
                    key={claim.id}
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
                          {claim.id}
                        </p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                          getRiskColor(claim.risk)
                        )}>
                          {claim.risk} risk
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm mt-0.5",
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      )}>
                        {claim.patient}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium",
                        isDark ? "text-white" : "text-neutral-900"
                      )}>
                        {claim.amount}
                      </p>
                      <div className={cn(
                        "flex items-center justify-end gap-1 text-xs mt-0.5 capitalize",
                        getStatusColor(claim.status)
                      )}>
                        {getStatusIcon(claim.status)}
                        {claim.status}
                      </div>
                    </div>
                  </div>
                ))}
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
                {pendingAppeals.map((appeal) => (
                  <div
                    key={appeal.id}
                    className={cn(
                      "p-3 rounded-lg",
                      isDark
                        ? "bg-neutral-800/50 ring-1 ring-neutral-800"
                        : "bg-neutral-50 ring-1 ring-neutral-200"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>
                          {appeal.id}
                        </p>
                        <p className={cn(
                          "text-xs mt-0.5",
                          isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                          {appeal.claimId}
                        </p>
                      </div>
                      <p className={cn(
                        "text-sm font-medium",
                        isDark ? "text-teal-400" : "text-teal-600"
                      )}>
                        {appeal.amount}
                      </p>
                    </div>
                    
                    <p className={cn(
                      "text-xs mt-2",
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    )}>
                      {appeal.reason}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className={cn(
                        "flex items-center gap-1 text-xs",
                        isDark ? "text-yellow-400" : "text-yellow-600"
                      )}>
                        <Clock className="h-3 w-3" />
                        Due in {appeal.deadline}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs"
                        onClick={() => setIsAppealModalOpen(true)}
                      >
                        Generate Appeal
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingAppeals.length === 0 && (
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
          // Could refresh data here
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
