import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  GitBranch,
  Settings,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

// Mock AI model data
const aiModels = [
  {
    id: '1',
    name: 'ccai-denial-risk',
    version: 'v1.3',
    type: 'denial_risk',
    status: 'active',
    isDefault: true,
    accuracy: 0.89,
    precision: 0.87,
    recall: 0.91,
    f1Score: 0.89,
    aucRoc: 0.94,
    totalInferences: 124500,
    avgLatency: 45,
    deployedAt: '2024-09-01',
  },
  {
    id: '2',
    name: 'ccai-appeal-gen',
    version: 'v1.3',
    type: 'appeal_generation',
    status: 'active',
    isDefault: true,
    accuracy: 0.92,
    totalInferences: 28300,
    avgLatency: 850,
    deployedAt: '2024-10-01',
  },
  {
    id: '3',
    name: 'ccai-equity-analyzer',
    version: 'v1.0',
    type: 'equity_analysis',
    status: 'active',
    isDefault: true,
    totalInferences: 8500,
    avgLatency: 1200,
    deployedAt: '2024-11-01',
  },
  {
    id: '4',
    name: 'ccai-denial-risk',
    version: 'v1.2',
    type: 'denial_risk',
    status: 'deprecated',
    isDefault: false,
    accuracy: 0.85,
    aucRoc: 0.91,
    totalInferences: 450000,
    retiredAt: '2024-09-01',
  },
];

// Usage metrics
const usageMetrics = {
  today: { predictions: 1250, appeals: 89, equity: 23 },
  week: { predictions: 8400, appeals: 620, equity: 156 },
  month: { predictions: 32500, appeals: 2450, equity: 580 },
};

// Performance over time (last 7 days)
const performanceTrend = [
  { day: 'Mon', accuracy: 0.88, latency: 42 },
  { day: 'Tue', accuracy: 0.89, latency: 44 },
  { day: 'Wed', accuracy: 0.91, latency: 43 },
  { day: 'Thu', accuracy: 0.89, latency: 46 },
  { day: 'Fri', accuracy: 0.90, latency: 45 },
  { day: 'Sat', accuracy: 0.88, latency: 41 },
  { day: 'Sun', accuracy: 0.89, latency: 45 },
];

const AdminAIGovernancePage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');

  const getModelTypeLabel = (type: string) => {
    switch (type) {
      case 'denial_risk':
        return 'Denial Risk Prediction';
      case 'appeal_generation':
        return 'Appeal Generation';
      case 'equity_analysis':
        return 'Equity Analysis';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'deprecated':
        return isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700';
      case 'retired':
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-500';
      default:
        return isDark ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-100 text-neutral-600';
    }
  };

  const metrics = usageMetrics[selectedPeriod];

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
              AI Governance
            </h1>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Monitor AI model performance, usage, and audit compliance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Metrics
            </Button>
          </div>
        </div>

        {/* Usage Summary */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn(
              "font-semibold",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              AI Usage Summary
            </h2>
            <div className="flex gap-1">
              {(['today', 'week', 'month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-colors capitalize",
                    selectedPeriod === period
                      ? isDark
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-amber-100 text-amber-700"
                      : isDark
                        ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  )}
                >
                  {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              key={`predictions-${selectedPeriod}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "p-4 rounded-xl",
                isDark ? "bg-teal-500/10" : "bg-teal-50"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className={cn("h-5 w-5", isDark ? "text-teal-400" : "text-teal-600")} />
                <span className={cn("text-sm font-medium", isDark ? "text-teal-400" : "text-teal-700")}>
                  Denial Predictions
                </span>
              </div>
              <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
                {metrics.predictions.toLocaleString()}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                Avg. 45ms latency
              </p>
            </motion.div>

            <motion.div
              key={`appeals-${selectedPeriod}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className={cn(
                "p-4 rounded-xl",
                isDark ? "bg-purple-500/10" : "bg-purple-50"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className={cn("h-5 w-5", isDark ? "text-purple-400" : "text-purple-600")} />
                <span className={cn("text-sm font-medium", isDark ? "text-purple-400" : "text-purple-700")}>
                  Appeals Generated
                </span>
              </div>
              <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
                {metrics.appeals.toLocaleString()}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                Avg. 850ms latency
              </p>
            </motion.div>

            <motion.div
              key={`equity-${selectedPeriod}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "p-4 rounded-xl",
                isDark ? "bg-blue-500/10" : "bg-blue-50"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
                <span className={cn("text-sm font-medium", isDark ? "text-blue-400" : "text-blue-700")}>
                  Equity Analyses
                </span>
              </div>
              <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-neutral-900")}>
                {metrics.equity.toLocaleString()}
              </p>
              <p className={cn("text-xs mt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>
                Avg. 1.2s latency
              </p>
            </motion.div>
          </div>
        </Card>

        {/* Model Registry */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className={cn(
              "font-semibold",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Model Registry
            </h2>
            <Button variant="ghost" size="sm">
              <GitBranch className="h-4 w-4 mr-1" />
              Version History
            </Button>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {aiModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "p-4 transition-colors",
                  isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      model.status === 'active'
                        ? isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-600"
                        : isDark ? "bg-neutral-800 text-neutral-500" : "bg-neutral-100 text-neutral-400"
                    )}>
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          "font-medium",
                          isDark ? "text-white" : "text-neutral-900"
                        )}>
                          {model.name}
                        </h3>
                        <span className={cn(
                          "px-1.5 py-0.5 text-xs font-mono rounded",
                          isDark ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600"
                        )}>
                          {model.version}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                          getStatusColor(model.status)
                        )}>
                          {model.status}
                        </span>
                        {model.isDefault && (
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full",
                            isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"
                          )}>
                            Default
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm mt-0.5",
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      )}>
                        {getModelTypeLabel(model.type)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                {/* Model Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4 ml-14">
                  {model.accuracy && (
                    <div>
                      <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        Accuracy
                      </p>
                      <p className={cn("text-sm font-semibold mt-0.5", isDark ? "text-white" : "text-neutral-900")}>
                        {(model.accuracy * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {model.aucRoc && (
                    <div>
                      <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        AUC-ROC
                      </p>
                      <p className={cn("text-sm font-semibold mt-0.5", isDark ? "text-white" : "text-neutral-900")}>
                        {model.aucRoc.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                      Total Inferences
                    </p>
                    <p className={cn("text-sm font-semibold mt-0.5", isDark ? "text-white" : "text-neutral-900")}>
                      {model.totalInferences.toLocaleString()}
                    </p>
                  </div>
                  {model.avgLatency && (
                    <div>
                      <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                        Avg Latency
                      </p>
                      <p className={cn("text-sm font-semibold mt-0.5", isDark ? "text-white" : "text-neutral-900")}>
                        {model.avgLatency}ms
                      </p>
                    </div>
                  )}
                  <div>
                    <p className={cn("text-xs uppercase tracking-wider", isDark ? "text-neutral-500" : "text-neutral-500")}>
                      {model.retiredAt ? 'Retired' : 'Deployed'}
                    </p>
                    <p className={cn("text-sm font-semibold mt-0.5", isDark ? "text-white" : "text-neutral-900")}>
                      {model.retiredAt || model.deployedAt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Performance Trend */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className={cn(
              "font-semibold mb-4",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              7-Day Performance Trend
            </h3>
            <div className="space-y-3">
              {performanceTrend.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className={cn(
                    "w-10 text-sm",
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  )}>
                    {day.day}
                  </span>
                  <div className="flex-1">
                    <div className={cn(
                      "h-2 rounded-full overflow-hidden",
                      isDark ? "bg-neutral-800" : "bg-neutral-200"
                    )}>
                      <div
                        className={cn(
                          "h-full rounded-full",
                          day.accuracy >= 0.9
                            ? "bg-green-500"
                            : day.accuracy >= 0.85
                              ? "bg-teal-500"
                              : "bg-amber-500"
                        )}
                        style={{ width: `${day.accuracy * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-medium w-14 text-right",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    {(day.accuracy * 100).toFixed(1)}%
                  </span>
                  <span className={cn(
                    "text-xs w-12 text-right",
                    isDark ? "text-neutral-500" : "text-neutral-500"
                  )}>
                    {day.latency}ms
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className={cn(
              "font-semibold mb-4",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Governance Compliance
            </h3>
            <div className="space-y-4">
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                isDark ? "bg-green-500/10" : "bg-green-50"
              )}>
                <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                    Model Fairness Check
                  </p>
                  <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Last run: 2 hours ago • No bias detected
                  </p>
                </div>
                <ChevronRight className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
              </div>

              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                isDark ? "bg-green-500/10" : "bg-green-50"
              )}>
                <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                    Data Privacy Audit
                  </p>
                  <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Last run: 1 day ago • HIPAA compliant
                  </p>
                </div>
                <ChevronRight className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
              </div>

              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                isDark ? "bg-amber-500/10" : "bg-amber-50"
              )}>
                <AlertTriangle className={cn("h-5 w-5", isDark ? "text-amber-400" : "text-amber-600")} />
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                    Model Drift Monitor
                  </p>
                  <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Minor drift detected • Review recommended
                  </p>
                </div>
                <ChevronRight className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
              </div>

              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                isDark ? "bg-green-500/10" : "bg-green-50"
              )}>
                <CheckCircle2 className={cn("h-5 w-5", isDark ? "text-green-400" : "text-green-600")} />
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-neutral-900")}>
                    Explainability Validation
                  </p>
                  <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
                    Last run: 3 hours ago • All outputs explainable
                  </p>
                </div>
                <ChevronRight className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAIGovernancePage;
