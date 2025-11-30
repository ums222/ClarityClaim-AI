import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Scale,
  Users,
  MapPin,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// ============================================================================
// EQUITY DASHBOARD - COMPACT ANIMATED COMPONENT (Theme-Aware)
// ============================================================================

const EquityDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [equityScore, setEquityScore] = useState(0);
  const [activeTab, setActiveTab] = useState<'demographics' | 'geography' | 'provider'>('demographics');
  const [showAlert, setShowAlert] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Demographics data
  const demographicsData = [
    { group: 'White', approvalRate: 89, count: '45.2K', flagged: false },
    { group: 'Black', approvalRate: 82, count: '28.1K', flagged: true },
    { group: 'Hispanic', approvalRate: 84, count: '22.7K', flagged: false },
    { group: 'Asian', approvalRate: 88, count: '15.3K', flagged: false },
  ];

  // Geographic data
  const geographicData = [
    { region: 'Urban', approvalRate: 87, population: '65%', flagged: false },
    { region: 'Suburban', approvalRate: 86, population: '25%', flagged: false },
    { region: 'Rural', approvalRate: 79, population: '10%', flagged: true },
  ];

  // Provider data
  const providerData = [
    { type: 'Academic Medical', approvalRate: 91, status: 'excellent' },
    { type: 'Community Hospital', approvalRate: 85, status: 'good' },
    { type: 'FQHC', approvalRate: 78, status: 'attention' },
  ];

  // Compliance metrics
  const complianceMetrics = [
    { name: 'CMS Standards', status: 'compliant', score: 94 },
    { name: 'EO 14110', status: 'compliant', score: 91 },
    { name: 'State Report', status: 'pending', score: 88 },
  ];

  // Animate score and cycle tabs
  useEffect(() => {
    if (!isInView) return;

    // Animate equity score
    let score = 0;
    const targetScore = 78;
    const increment = targetScore / 40;
    const scoreInterval = setInterval(() => {
      score += increment;
      if (score >= targetScore) {
        setEquityScore(targetScore);
        clearInterval(scoreInterval);
      } else {
        setEquityScore(Math.round(score));
      }
    }, 40);

    // Show alert after delay
    const alertTimeout = setTimeout(() => setShowAlert(true), 2000);

    // Cycle through tabs
    const tabCycle = setInterval(() => {
      setActiveTab(prev => {
        if (prev === 'demographics') return 'geography';
        if (prev === 'geography') return 'provider';
        return 'demographics';
      });
    }, 4000);

    return () => {
      clearInterval(scoreInterval);
      clearTimeout(alertTimeout);
      clearInterval(tabCycle);
    };
  }, [isInView]);

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <motion.div 
      ref={containerRef} 
      className={`animation-container relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] group cursor-pointer ${
        isDark 
          ? 'bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-rose-900/20 border-neutral-700/80 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/20' 
          : 'bg-gradient-to-br from-neutral-50 via-white to-rose-50/50 border-neutral-200 hover:border-rose-400/50 hover:shadow-lg hover:shadow-rose-300/20'
      }`}
      style={{ height: '620px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-20'}`}
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.15)'} 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        <div className={`absolute top-0 left-0 w-32 h-32 ${isDark ? 'bg-rose-600/10' : 'bg-rose-200/40'} rounded-full blur-2xl`} />
        <div className={`absolute bottom-0 right-0 w-32 h-32 ${isDark ? 'bg-violet-600/10' : 'bg-violet-200/40'} rounded-full blur-2xl`} />
      </div>

      <div className="relative p-4 h-full overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className={`rounded-xl ${isDark ? 'bg-neutral-800/80' : 'bg-neutral-100'} px-3 py-2 mb-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm`}>
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-800'}`}>Equity Dashboard</h3>
                <p className={`text-[9px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Real-time Monitoring</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
              />
              <span className="text-[9px] font-medium text-emerald-500">Live</span>
            </div>
          </div>
        </div>

        {/* Alert Banner - Always rendered, visibility controlled by max-height and opacity */}
        <div
          className={`overflow-hidden mb-3 transition-all duration-300 ${
            showAlert ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`rounded-lg ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'} border px-2.5 py-2`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Disparity Alert</p>
                <p className={`text-[9px] ${isDark ? 'text-amber-500/80' : 'text-amber-600'}`}>7% gap in rural clinic rates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score and Summary Row */}
        <div className="flex items-center gap-3 mb-3">
          {/* Score Ring */}
          <div className="relative flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke={isDark ? '#334155' : '#e2e8f0'}
                strokeWidth="5"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="url(#equityGradientCompact)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${equityScore * 1.63} 163`}
                initial={{ strokeDasharray: '0 163' }}
                animate={{ strokeDasharray: `${equityScore * 1.63} 163` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="equityGradientCompact" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-lg font-bold ${getScoreColor(equityScore)}`}>{equityScore}</span>
              <span className={`text-[8px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Score</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h4 className={`text-[11px] font-semibold ${isDark ? 'text-white' : 'text-neutral-800'}`}>Equity Index</h4>
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] text-emerald-500 font-medium">+3.2%</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className={`px-1.5 py-0.5 ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'} text-[8px] font-medium rounded-full`}>
                12 passing
              </span>
              <span className={`px-1.5 py-0.5 ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'} text-[8px] font-medium rounded-full`}>
                2 attention
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex gap-1 mb-3 p-0.5 ${isDark ? 'bg-neutral-800/50' : 'bg-neutral-100'} rounded-lg`}>
          {[
            { id: 'demographics' as const, label: 'Demo', icon: Users },
            { id: 'geography' as const, label: 'Geo', icon: MapPin },
            { id: 'provider' as const, label: 'Provider', icon: Building2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[9px] font-medium transition-all ${
                activeTab === tab.id
                  ? isDark 
                    ? 'bg-neutral-700 text-white shadow-sm' 
                    : 'bg-white text-neutral-900 shadow-sm'
                  : isDark 
                    ? 'text-neutral-400 hover:text-neutral-300' 
                    : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'demographics' && (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-1.5"
            >
              {demographicsData.map((item, i) => (
                <motion.div
                  key={item.group}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-2 rounded-lg border ${
                    item.flagged 
                      ? isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'
                      : isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-medium ${isDark ? 'text-white' : 'text-neutral-800'}`}>{item.group}</span>
                      {item.flagged && <AlertCircle className="w-3 h-3 text-rose-500" />}
                    </div>
                    <span className={`text-[9px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{item.count}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`flex-1 h-1.5 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'} rounded-full overflow-hidden`}>
                      <motion.div
                        className={`h-full rounded-full ${item.flagged ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.approvalRate}%` }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                      />
                    </div>
                    <span className={`text-[10px] font-semibold ${item.flagged ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {item.approvalRate}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'geography' && (
            <motion.div
              key="geography"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-1.5"
            >
              {geographicData.map((item, i) => (
                <motion.div
                  key={item.region}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-2 rounded-lg border ${
                    item.flagged
                      ? isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                      : isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        item.flagged 
                          ? isDark ? 'bg-amber-500/20' : 'bg-amber-100' 
                          : isDark ? 'bg-clarity-secondary/20' : 'bg-teal-100'
                      }`}>
                        <MapPin className={`w-3 h-3 ${item.flagged ? 'text-amber-500' : 'text-clarity-secondary'}`} />
                      </div>
                      <div>
                        <h5 className={`text-[10px] font-medium ${isDark ? 'text-white' : 'text-neutral-800'}`}>{item.region}</h5>
                        <p className={`text-[8px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{item.population}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${item.flagged ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {item.approvalRate}%
                    </span>
                  </div>
                  {item.flagged && (
                    <div className={`flex items-center gap-1.5 mt-1.5 p-1.5 rounded ${isDark ? 'bg-amber-500/10' : 'bg-amber-100'}`}>
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      <span className={`text-[8px] ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>8% below benchmark</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'provider' && (
            <motion.div
              key="provider"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-1.5"
            >
              {providerData.map((item, i) => (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-neutral-50 border-neutral-200'}`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    item.status === 'excellent' ? isDark ? 'bg-emerald-500/20' : 'bg-emerald-100' :
                    item.status === 'good' ? isDark ? 'bg-clarity-secondary/20' : 'bg-teal-100' : 
                    isDark ? 'bg-amber-500/20' : 'bg-amber-100'
                  }`}>
                    <Building2 className={`w-3 h-3 ${
                      item.status === 'excellent' ? 'text-emerald-500' :
                      item.status === 'good' ? 'text-clarity-secondary' : 'text-amber-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className={`text-[10px] font-medium truncate ${isDark ? 'text-white' : 'text-neutral-800'}`}>{item.type}</h5>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-10 h-1.5 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'} rounded-full overflow-hidden`}>
                      <motion.div
                        className={`h-full rounded-full ${
                          item.status === 'excellent' ? 'bg-emerald-500' :
                          item.status === 'good' ? 'bg-clarity-secondary' : 'bg-amber-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.approvalRate}%` }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                      />
                    </div>
                    <span className={`text-[10px] font-semibold ${
                      item.status === 'excellent' ? 'text-emerald-500' :
                      item.status === 'good' ? 'text-clarity-secondary' : 'text-amber-500'
                    }`}>
                      {item.approvalRate}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compliance Footer */}
        <div className={`mt-3 pt-3 border-t ${isDark ? 'border-neutral-700/50' : 'border-neutral-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>Compliance</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {complianceMetrics.map((metric, i) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 5 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.1 }}
                className={`p-1.5 rounded-lg text-center ${
                  metric.status === 'compliant' 
                    ? isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                    : isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                } border`}
              >
                {metric.status === 'compliant' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 mx-auto mb-0.5" />
                ) : (
                  <Clock className="w-3 h-3 text-amber-500 mx-auto mb-0.5" />
                )}
                <div className={`text-[9px] font-bold ${metric.status === 'compliant' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {metric.score}%
                </div>
                <div className={`text-[7px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'} truncate`}>{metric.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-3 flex justify-between gap-2"
        >
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'} border`}>
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center`}>
              <Target className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>50%</div>
              <div className={`text-[8px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Goal</div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'} border`}>
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center`}>
              <Activity className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>Real-time</div>
              <div className={`text-[8px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Monitor</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EquityDashboard;
