import { motion } from 'framer-motion';
import { RiskFactor } from '../../lib/claims';

interface RiskScoreIndicatorProps {
  score: number | null;
  level?: 'low' | 'medium' | 'high' | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function RiskScoreIndicator({ 
  score, 
  level,
  size = 'md', 
  showLabel = true,
  animated = true 
}: RiskScoreIndicatorProps) {
  if (score === null || score === undefined) {
    return (
      <span className="text-neutral-400 dark:text-neutral-500 text-sm">
        Not calculated
      </span>
    );
  }

  // Determine level from score if not provided
  const riskLevel = level || (score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low');

  const levelConfig = {
    low: {
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-100 dark:bg-emerald-900/30',
      label: 'Low Risk',
    },
    medium: {
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-100 dark:bg-amber-900/30',
      label: 'Medium Risk',
    },
    high: {
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-500',
      bgLight: 'bg-red-100 dark:bg-red-900/30',
      label: 'High Risk',
    },
  };

  const config = levelConfig[riskLevel];

  const sizeConfig = {
    sm: { width: 40, height: 40, strokeWidth: 3, fontSize: 'text-xs' },
    md: { width: 56, height: 56, strokeWidth: 4, fontSize: 'text-sm' },
    lg: { width: 80, height: 80, strokeWidth: 5, fontSize: 'text-lg' },
  };

  const { width, height, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width, height }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={width} height={height}>
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-neutral-200 dark:text-neutral-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={config.color}
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: circumference - progress }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className={`font-bold ${fontSize} ${config.color}`}
            initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {Math.round(score)}
          </motion.span>
        </div>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-semibold ${config.color}`}>{config.label}</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Denial Risk Score
          </span>
        </div>
      )}
    </div>
  );
}

// Compact risk indicator for tables
export function RiskBadge({ 
  score, 
  level 
}: { 
  score: number | null; 
  level?: 'low' | 'medium' | 'high' | null;
}) {
  if (score === null || score === undefined) {
    return <span className="text-neutral-400 text-sm">-</span>;
  }

  const riskLevel = level || (score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low');

  const config = {
    low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config[riskLevel]}`}>
      {Math.round(score)}%
    </span>
  );
}

// Risk Factors List Component
interface RiskFactorsListProps {
  factors: RiskFactor[];
  compact?: boolean;
}

export function RiskFactorsList({ factors, compact = false }: RiskFactorsListProps) {
  if (!factors?.length) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
        No risk factors identified
      </p>
    );
  }

  const impactColors = {
    low: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    high: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  };

  const impactIcons = {
    low: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    medium: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    high: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  if (compact) {
    return (
      <ul className="space-y-1">
        {factors.map((factor, index) => (
          <li 
            key={index}
            className={`flex items-center gap-2 text-sm px-2 py-1 rounded ${impactColors[factor.impact]}`}
          >
            {impactIcons[factor.impact]}
            <span>{factor.factor}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-3">
      {factors.map((factor, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-3 rounded-lg border ${
            factor.impact === 'high' 
              ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
              : factor.impact === 'medium'
              ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
              : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className={impactColors[factor.impact] + ' p-1.5 rounded'}>
              {impactIcons[factor.impact]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 dark:text-white">
                {factor.factor}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {factor.description}
              </p>
            </div>
            <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded ${impactColors[factor.impact]}`}>
              {factor.impact}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
