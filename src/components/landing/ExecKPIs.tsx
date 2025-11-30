import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  PieChart,
  Building2,
  RefreshCw,
  Sparkles,
  Activity
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// ============================================================================
// EXEC KPI DASHBOARD - COMPACT ANIMATED COMPONENT (Theme-Aware)
// ============================================================================

// Mini sparkline component
const Sparkline: React.FC<{ data: number[]; color: string; height?: number }> = ({ data, color, height = 24 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const gradientId = `gradient-${color.replace('#', '')}`;

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#${gradientId})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ExecKPIs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [animatedValues, setAnimatedValues] = useState({
    claimsProcessed: 0,
    denialRate: 0,
    appealWinRate: 0,
    revenueRecovered: 0,
  });
  const [activeTimeframe, setActiveTimeframe] = useState('7d');
  const [showForecast, setShowForecast] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Chart data for sparklines
  const chartData = {
    claims: [65, 72, 68, 85, 92, 88, 95, 102, 98, 108, 115, 127],
    denials: [12, 11.5, 11, 10.2, 9.8, 9.5, 9.2, 8.8, 8.5, 8.4, 8.3, 8.2],
    revenue: [1.2, 1.4, 1.5, 1.6, 1.8, 1.9, 2.0, 2.1, 2.15, 2.2, 2.28, 2.34],
    appeals: [78, 79, 80, 82, 83, 84, 85, 85, 86, 86, 87, 87]
  };

  // Denial reasons breakdown
  const denialReasons = [
    { reason: 'Medical Necessity', percentage: 34, colorClass: 'bg-violet-500' },
    { reason: 'Prior Auth Missing', percentage: 28, colorClass: 'bg-clarity-secondary' },
    { reason: 'Coding Errors', percentage: 22, colorClass: 'bg-clarity-accent' },
    { reason: 'Other', percentage: 16, colorClass: 'bg-neutral-400' }
  ];

  // Payer performance
  const payerPerformance = [
    { name: 'Anthem', approvalRate: 92, trend: 'up' as const },
    { name: 'United', approvalRate: 89, trend: 'up' as const },
    { name: 'Aetna', approvalRate: 86, trend: 'down' as const },
  ];

  // Animate values on view
  useEffect(() => {
    if (!isInView) return;

    const targetValues = {
      claimsProcessed: 127843,
      denialRate: 8.2,
      appealWinRate: 87,
      revenueRecovered: 2.34,
    };

    const duration = 1500;
    const steps = 40;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        claimsProcessed: Math.round(targetValues.claimsProcessed * easeOut),
        denialRate: parseFloat((targetValues.denialRate * easeOut).toFixed(1)),
        appealWinRate: Math.round(targetValues.appealWinRate * easeOut),
        revenueRecovered: parseFloat((targetValues.revenueRecovered * easeOut).toFixed(2)),
      });

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => setShowForecast(true), 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <motion.div 
      ref={containerRef} 
      className={`animation-container relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] group cursor-pointer ${
        isDark 
          ? 'bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-blue-900/20 border-neutral-700/80 hover:border-clarity-primary/50 hover:shadow-lg hover:shadow-blue-500/20' 
          : 'bg-gradient-to-br from-neutral-50 via-white to-blue-50/50 border-neutral-200 hover:border-clarity-primary/50 hover:shadow-lg hover:shadow-blue-300/20'
      }`}
      style={{ height: '620px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-15'}`}
          style={{
            backgroundImage: `linear-gradient(${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 58, 95, 0.1)'} 1px, transparent 1px),
                              linear-gradient(90deg, ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 58, 95, 0.1)'} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        <div className={`absolute top-0 right-0 w-32 h-32 ${isDark ? 'bg-blue-600/10' : 'bg-blue-200/40'} rounded-full blur-2xl`} />
        <div className={`absolute bottom-0 left-0 w-32 h-32 ${isDark ? 'bg-cyan-600/10' : 'bg-cyan-200/40'} rounded-full blur-2xl`} />
      </div>

      <div className="relative p-4 h-full overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className={`rounded-xl ${isDark ? 'bg-neutral-800/80' : 'bg-neutral-100'} px-3 py-2 mb-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br from-clarity-primary to-blue-600 flex items-center justify-center shadow-sm`}>
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-800'}`}>Exec Dashboard</h3>
                <p className={`text-[9px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Real-time Analytics</p>
              </div>
            </div>
            
            {/* Time Range */}
            <div className={`flex items-center gap-0.5 p-0.5 ${isDark ? 'bg-neutral-700/50' : 'bg-neutral-200'} rounded-md`}>
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveTimeframe(range)}
                  className={`px-1.5 py-0.5 text-[8px] font-medium rounded transition-all ${
                    activeTimeframe === range
                      ? 'bg-clarity-primary text-white'
                      : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
              />
              <span className={`text-[9px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Live</span>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className={`w-3 h-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
            </motion.div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Claims Processed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className={`rounded-xl p-2.5 border ${isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-white border-neutral-200'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[9px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Claims</span>
              <div className="flex items-center gap-0.5 text-emerald-500">
                <ArrowUpRight className="w-2.5 h-2.5" />
                <span className="text-[8px] font-medium">+12%</span>
              </div>
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-800'} mb-1`}>
              {(animatedValues.claimsProcessed / 1000).toFixed(0)}K
            </div>
            <Sparkline data={chartData.claims} color="#3b82f6" height={20} />
          </motion.div>

          {/* Denial Rate */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className={`rounded-xl p-2.5 border ${isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-white border-neutral-200'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[9px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Denial Rate</span>
              <div className="flex items-center gap-0.5 text-emerald-500">
                <ArrowDownRight className="w-2.5 h-2.5" />
                <span className="text-[8px] font-medium">-2.1%</span>
              </div>
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-800'} mb-1`}>
              {animatedValues.denialRate}%
            </div>
            <Sparkline data={chartData.denials} color="#10b981" height={20} />
          </motion.div>

          {/* Revenue Recovered */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className={`rounded-xl p-2.5 border ${isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-white border-neutral-200'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[9px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Revenue</span>
              <div className="flex items-center gap-0.5 text-emerald-500">
                <ArrowUpRight className="w-2.5 h-2.5" />
                <span className="text-[8px] font-medium">+18%</span>
              </div>
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-800'} mb-1`}>
              ${animatedValues.revenueRecovered}M
            </div>
            <Sparkline data={chartData.revenue} color="#f59e0b" height={20} />
          </motion.div>

          {/* Appeal Win Rate */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className={`rounded-xl p-2.5 border ${isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-white border-neutral-200'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[9px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Win Rate</span>
              <div className="flex items-center gap-0.5 text-emerald-500">
                <ArrowUpRight className="w-2.5 h-2.5" />
                <span className="text-[8px] font-medium">+4.5%</span>
              </div>
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-800'} mb-1`}>
              {animatedValues.appealWinRate}%
            </div>
            <Sparkline data={chartData.appeals} color="#8b5cf6" height={20} />
          </motion.div>
        </div>

        {/* Denial Reasons Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className={`rounded-xl p-2.5 border mb-3 ${isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-white border-neutral-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-medium ${isDark ? 'text-white' : 'text-neutral-800'}`}>Denial Reasons</span>
            <PieChart className={`w-3 h-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
          </div>
          
          {/* Horizontal stacked bar */}
          <div className={`h-2 rounded-full overflow-hidden flex mb-2 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}>
            {denialReasons.map((item, i) => (
              <motion.div
                key={item.reason}
                className={`${item.colorClass} h-full`}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
              />
            ))}
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {denialReasons.map((item) => (
              <div key={item.reason} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${item.colorClass}`} />
                <span className={`text-[8px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'} truncate`}>{item.reason}</span>
                <span className={`text-[8px] font-medium ${isDark ? 'text-white' : 'text-neutral-700'} ml-auto`}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payer Performance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className={`rounded-xl p-2.5 border ${isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-white border-neutral-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-medium ${isDark ? 'text-white' : 'text-neutral-800'}`}>Top Payers</span>
            <Building2 className={`w-3 h-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
          </div>
          
          <div className="space-y-1.5">
            {payerPerformance.map((payer, i) => (
              <motion.div
                key={payer.name}
                initial={{ opacity: 0, x: -5 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className={`w-12 text-[9px] ${isDark ? 'text-neutral-300' : 'text-neutral-600'} truncate`}>{payer.name}</div>
                <div className={`flex-1 h-1.5 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'} rounded-full overflow-hidden`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-clarity-primary to-clarity-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${payer.approvalRate}%` }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.4 }}
                  />
                </div>
                <div className="flex items-center gap-1 w-12">
                  <span className={`text-[9px] font-medium ${isDark ? 'text-white' : 'text-neutral-800'}`}>{payer.approvalRate}%</span>
                  {payer.trend === 'up' && <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />}
                  {payer.trend === 'down' && <TrendingDown className="w-2.5 h-2.5 text-red-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Forecast Panel - Always rendered, visibility controlled by max-height and opacity */}
        <div
          className={`overflow-hidden mt-3 transition-all duration-300 ${
            showForecast ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`rounded-xl p-2.5 border ${isDark ? 'bg-violet-500/10 border-violet-500/30' : 'bg-violet-50 border-violet-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-clarity-primary flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <div>
                <h4 className={`text-[9px] font-medium ${isDark ? 'text-white' : 'text-neutral-800'}`}>AI Forecast</h4>
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-auto flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-violet-500" />
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className={`rounded-lg p-2 text-center ${isDark ? 'bg-neutral-900/50' : 'bg-white'}`}>
                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>7.8%</div>
                <div className={`text-[7px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Next Mo.</div>
              </div>
              <div className={`rounded-lg p-2 text-center ${isDark ? 'bg-neutral-900/50' : 'bg-white'}`}>
                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>$8.2M</div>
                <div className={`text-[7px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Q2 Est.</div>
              </div>
              <div className={`rounded-lg p-2 text-center ${isDark ? 'bg-neutral-900/50' : 'bg-white'}`}>
                <div className="text-sm font-bold text-amber-500">2</div>
                <div className={`text-[7px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Alerts</div>
              </div>
            </div>
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
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-clarity-primary to-blue-600 flex items-center justify-center`}>
              <Activity className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>100K+</div>
              <div className={`text-[8px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Claims/Day</div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'} border`}>
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center`}>
              <DollarSign className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>$2.3M</div>
              <div className={`text-[8px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Recovered</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExecKPIs;
