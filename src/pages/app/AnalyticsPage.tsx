import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '../../components/app/AppLayout';
import { aiService, PatternAnalysis, AIStatus, PatternData } from '../../lib/ai';
import { formatCurrency } from '../../lib/claims';

export function AnalyticsPage() {
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(90);
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'payers' | 'risk'>('overview');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [analysisResult, statusResult] = await Promise.all([
        aiService.analyzePatterns(selectedDays),
        aiService.getStatus(),
      ]);
      
      setAnalysis(analysisResult);
      setAIStatus(statusResult);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              AI Analytics & Insights
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              AI-powered analysis of your claims data and denial patterns
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last year</option>
            </select>

            <button
              onClick={fetchData}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Refresh
            </button>
          </div>
        </div>

        {/* AI Status Banner */}
        {aiStatus && (
          <div className={`p-4 rounded-xl border ${
            aiStatus.enabled 
              ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                aiStatus.enabled 
                  ? 'bg-purple-100 dark:bg-purple-900/40'
                  : 'bg-amber-100 dark:bg-amber-900/40'
              }`}>
                {aiStatus.enabled ? (
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  aiStatus.enabled 
                    ? 'text-purple-900 dark:text-purple-100'
                    : 'text-amber-900 dark:text-amber-100'
                }`}>
                  {aiStatus.enabled 
                    ? `AI Engine Active (${aiStatus.model})`
                    : 'AI Running in Fallback Mode'}
                </p>
                <p className={`text-sm ${
                  aiStatus.enabled 
                    ? 'text-purple-700 dark:text-purple-300'
                    : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {aiStatus.enabled 
                    ? 'Enhanced AI analysis with GPT-4o is enabled'
                    : 'Using rule-based analysis. Add OPENAI_API_KEY for enhanced insights.'}
                </p>
              </div>
              <div className="flex gap-2">
                {Object.entries(aiStatus.capabilities).map(([key, enabled]) => (
                  <span 
                    key={key}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      enabled 
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button onClick={fetchData} className="ml-auto text-sm text-red-700 dark:text-red-300 hover:underline font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-6">
            {(['overview', 'patterns', 'payers', 'risk'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'risk' ? 'Risk Analysis' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">Analyzing claims data...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && analysis && analysis.stats && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <OverviewTab analysis={analysis} />
              )}
              
              {activeTab === 'patterns' && (
                <PatternsTab patterns={analysis.patterns || []} />
              )}
              
              {activeTab === 'payers' && (
                <PayersTab stats={analysis.stats} />
              )}
              
              {activeTab === 'risk' && (
                <RiskTab analysis={analysis} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
        
        {/* No Stats State */}
        {!isLoading && analysis && !analysis.stats && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Unable to load analytics data</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Please try refreshing the page</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && analysis?.claimsAnalyzed === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-2">No claims data to analyze</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Create some claims first to see analytics</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Overview Tab
function OverviewTab({ analysis }: { analysis: PatternAnalysis }) {
  const stats = analysis.stats || {
    total: 0,
    byStatus: {},
    byPayer: {},
    byDenialCategory: {},
    avgBilledAmount: 0,
    avgRiskScore: 0,
    totalBilled: 0,
    totalPaid: 0,
    denialRate: 0,
  };
  
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Claims"
          value={(stats.total || 0).toString()}
          icon={<ClipboardIcon />}
          color="blue"
        />
        <MetricCard
          label="Denial Rate"
          value={`${(stats.denialRate || 0).toFixed(1)}%`}
          icon={<AlertIcon />}
          color={(stats.denialRate || 0) > 15 ? 'red' : (stats.denialRate || 0) > 10 ? 'amber' : 'green'}
          trend={(stats.denialRate || 0) > 15 ? 'up' : 'down'}
        />
        <MetricCard
          label="Total Billed"
          value={formatCurrency(stats.totalBilled || 0)}
          icon={<DollarIcon />}
          color="emerald"
        />
        <MetricCard
          label="Avg Risk Score"
          value={(stats.avgRiskScore || 0).toFixed(0)}
          icon={<ChartIcon />}
          color={(stats.avgRiskScore || 0) > 50 ? 'red' : (stats.avgRiskScore || 0) > 30 ? 'amber' : 'green'}
        />
      </div>

      {/* Status Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Claims by Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(stats.byStatus || {}).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">
                {status.replace(/_/g, ' ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Patterns Summary */}
      {analysis.patterns.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI-Detected Patterns ({analysis.patterns.length})
          </h3>
          <div className="space-y-3">
            {analysis.patterns.slice(0, 3).map((pattern, index) => (
              <PatternCard key={index} pattern={pattern} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Patterns Tab
function PatternsTab({ patterns }: { patterns: PatternData[] }) {
  if (patterns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <svg className="w-16 h-16 text-green-300 dark:text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 mb-2">No concerning patterns detected</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Your claims data looks healthy!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patterns.map((pattern, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PatternCard pattern={pattern} />
        </motion.div>
      ))}
    </div>
  );
}

// Payers Tab
function PayersTab({ stats }: { stats: PatternAnalysis['stats'] }) {
  const byPayer = stats?.byPayer || {};
  const payerData = Object.entries(byPayer)
    .map(([name, data]) => ({
      name,
      ...data,
      denialRate: data.count > 0 ? (data.denied / data.count) * 100 : 0,
    }))
    .sort((a, b) => b.total_billed - a.total_billed);

  if (payerData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500 dark:text-gray-400">No payer data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Payer
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Claims
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Total Billed
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Denied
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Denial Rate
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {payerData.map((payer) => (
            <tr key={payer.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {payer.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{payer.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {payer.count}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {formatCurrency(payer.total_billed)}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {payer.denied}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  payer.denialRate > 20 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                    : payer.denialRate > 10
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                }`}>
                  {payer.denialRate.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Risk Tab
function RiskTab({ analysis }: { analysis: PatternAnalysis }) {
  const stats = analysis.stats || {
    total: 0,
    byStatus: {},
    byPayer: {},
    byDenialCategory: {},
    avgBilledAmount: 0,
    avgRiskScore: 0,
    totalBilled: 0,
    totalPaid: 0,
    denialRate: 0,
  };
  
  const riskDistribution = {
    high: 0,
    medium: 0,
    low: 0,
  };
  
  // Calculate from denial categories
  Object.entries(stats.byDenialCategory || {}).forEach(([category, count]) => {
    if (['Authorization', 'Medical Necessity'].includes(category)) {
      riskDistribution.high += count;
    } else if (['Coding', 'Documentation'].includes(category)) {
      riskDistribution.medium += count;
    } else {
      riskDistribution.low += count;
    }
  });

  return (
    <div className="space-y-6">
      {/* Risk Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Average Risk Score
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              (stats.avgRiskScore || 0) > 50 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                : (stats.avgRiskScore || 0) > 30
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
            }`}>
              {(stats.avgRiskScore || 0) > 50 ? 'High' : (stats.avgRiskScore || 0) > 30 ? 'Medium' : 'Low'}
            </span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {(stats.avgRiskScore || 0).toFixed(0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Out of 100
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Denial Categories
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byDenialCategory || {}).slice(0, 5).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Revenue Impact
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Billed</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(stats.totalBilled || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Collected</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(stats.totalPaid || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Lost Revenue</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {formatCurrency((stats.totalBilled || 0) - (stats.totalPaid || 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Recommendations */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecommendationCard
            title="Improve Documentation"
            description="Add complete clinical notes to reduce documentation-related denials by up to 30%"
            icon="📝"
          />
          <RecommendationCard
            title="Verify Eligibility"
            description="Check patient coverage before service dates to prevent eligibility denials"
            icon="✓"
          />
          <RecommendationCard
            title="Prior Authorization"
            description="Implement pre-authorization workflow for high-cost procedures"
            icon="🔐"
          />
          <RecommendationCard
            title="Code Validation"
            description="Use AI-powered code checking to ensure diagnosis-procedure alignment"
            icon="🔍"
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ 
  label, 
  value, 
  icon, 
  color,
  trend
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down';
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={trend === 'up' ? 'text-red-500' : 'text-green-500'}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function PatternCard({ pattern, compact = false }: { pattern: PatternData; compact?: boolean }) {
  const severityColors = {
    high: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
    medium: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20',
    low: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
  };

  const severityText = {
    high: 'text-red-700 dark:text-red-300',
    medium: 'text-amber-700 dark:text-amber-300',
    low: 'text-blue-700 dark:text-blue-300',
  };

  return (
    <div className={`p-4 rounded-lg border ${severityColors[pattern.severity]}`}>
      <div className="flex items-start gap-3">
        <span className={`text-2xl ${compact ? '' : ''}`}>
          {pattern.severity === 'high' ? '🚨' : pattern.severity === 'medium' ? '⚠️' : 'ℹ️'}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${severityText[pattern.severity]}`}>
            {pattern.title}
          </p>
          <p className={`text-sm mt-1 ${severityText[pattern.severity]} opacity-80`}>
            {pattern.description}
          </p>
          {!compact && (
            <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                Recommendation
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {pattern.recommendation}
              </p>
            </div>
          )}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded uppercase ${severityText[pattern.severity]} bg-white/50 dark:bg-gray-800/50`}>
          {pattern.severity}
        </span>
      </div>
    </div>
  );
}

function RecommendationCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white/10 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-white/80 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Icons
function ClipboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export default AnalyticsPage;
