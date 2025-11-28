import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Lock,
  FileSearch,
  ClipboardCheck,
  Activity,
  CircleDot,
  Loader2,
  Zap,
  BadgeCheck
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// ============================================================================
// VALIDATION CHECKLIST - COMPACT ANIMATED COMPONENT (Theme-Aware)
// ============================================================================

const ValidationChecklist: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [validationPhase, setValidationPhase] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Validation categories and their checks
  const validationCategories = [
    {
      id: 'authorization',
      name: 'Prior Authorization',
      icon: Lock,
      gradientDark: 'from-violet-500 to-purple-600',
      gradientLight: 'from-violet-400 to-purple-500',
      checks: [
        { id: 'auth-1', label: 'Auth number valid', status: 'success' },
        { id: 'auth-2', label: 'Date of service covered', status: 'success' },
        { id: 'auth-3', label: 'Units within limit', status: 'warning', note: '8/10 used' },
      ]
    },
    {
      id: 'coding',
      name: 'CPT/ICD-10 Validation',
      icon: FileSearch,
      gradientDark: 'from-clarity-secondary to-teal-600',
      gradientLight: 'from-clarity-secondary to-teal-500',
      checks: [
        { id: 'code-1', label: 'CPT code valid', status: 'success' },
        { id: 'code-2', label: 'ICD-10 specificity OK', status: 'success' },
        { id: 'code-3', label: 'Modifier check', status: 'error', note: 'Missing mod 25' },
      ]
    },
    {
      id: 'payer',
      name: 'Payer Policy Rules',
      icon: Shield,
      gradientDark: 'from-emerald-500 to-teal-600',
      gradientLight: 'from-emerald-400 to-teal-500',
      checks: [
        { id: 'payer-1', label: 'Eligibility active', status: 'success' },
        { id: 'payer-2', label: 'Benefit verified', status: 'success' },
        { id: 'payer-3', label: 'Timely filing OK', status: 'success' },
      ]
    },
    {
      id: 'documentation',
      name: 'Documentation',
      icon: ClipboardCheck,
      gradientDark: 'from-clarity-accent to-orange-500',
      gradientLight: 'from-amber-400 to-orange-400',
      checks: [
        { id: 'doc-1', label: 'Notes attached', status: 'success' },
        { id: 'doc-2', label: 'Medical necessity', status: 'success' },
        { id: 'doc-3', label: 'Forms complete', status: 'warning', note: 'ABN needed' },
      ]
    }
  ];

  // Auto-run validation sequence
  useEffect(() => {
    if (!isInView) return;
    
    const startValidation = () => {
      setIsValidating(true);
      setValidationComplete(false);
      setValidationPhase(0);
      
      const phases = validationCategories.length;
      let currentPhase = 0;
      
      const phaseInterval = setInterval(() => {
        currentPhase++;
        if (currentPhase <= phases) {
          setValidationPhase(currentPhase);
        } else {
          clearInterval(phaseInterval);
          setIsValidating(false);
          setValidationComplete(true);
          
          setTimeout(() => {
            startValidation();
          }, 3500);
        }
      }, 1200);
    };

    const initialDelay = setTimeout(startValidation, 800);
    return () => clearTimeout(initialDelay);
  }, [isInView]);

  // Calculate stats
  const allChecks = validationCategories.flatMap(cat => cat.checks);
  const successCount = allChecks.filter(c => c.status === 'success').length;
  const warningCount = allChecks.filter(c => c.status === 'warning').length;
  const errorCount = allChecks.filter(c => c.status === 'error').length;

  return (
    <motion.div 
      ref={containerRef} 
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] group cursor-pointer ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-900/20 border-slate-700/80 hover:border-clarity-secondary/50 hover:shadow-lg hover:shadow-clarity-secondary/20' 
          : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 border-slate-200 hover:border-clarity-secondary/50 hover:shadow-lg hover:shadow-clarity-secondary/20'
      }`}
      style={{ minHeight: '320px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div 
          className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-20'}`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(13, 148, 136, 0.2)'} 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />
        <div className={`absolute top-0 right-0 w-32 h-32 ${isDark ? 'bg-emerald-600/10' : 'bg-emerald-200/30'} rounded-full blur-2xl`} />
        <div className={`absolute bottom-0 left-0 w-32 h-32 ${isDark ? 'bg-violet-600/10' : 'bg-violet-200/30'} rounded-full blur-2xl`} />
      </div>

      <div className="relative p-4">
        {/* Header */}
        <div className={`rounded-xl ${isDark ? 'bg-slate-800/80' : 'bg-slate-100'} px-3 py-2 mb-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white'} flex items-center justify-center`}>
                <Shield className={`w-4 h-4 ${isDark ? 'text-white' : 'text-slate-700'}`} />
              </div>
              <div>
                <h3 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Claim Validation</h3>
                <p className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CLM-2024-78432</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {isValidating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-3.5 h-3.5 text-clarity-secondary" />
                </motion.div>
              ) : validationComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <CircleDot className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              )}
              <span className={`text-[10px] font-medium ${
                isValidating ? 'text-clarity-secondary' : validationComplete ? 'text-emerald-500' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {isValidating ? 'Validating...' : validationComplete ? 'Complete' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className={`h-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
              <motion.div
                className="h-full bg-gradient-to-r from-clarity-secondary to-emerald-400"
                initial={{ width: '0%' }}
                animate={{ 
                  width: `${(validationPhase / validationCategories.length) * 100}%` 
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className={`flex justify-between mt-1 text-[8px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>{validationPhase}/{validationCategories.length} categories</span>
              <span>{Math.round((validationPhase / validationCategories.length) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Validation Categories */}
        <div className="space-y-2">
          {validationCategories.map((category, catIndex) => {
            const isActive = validationPhase > catIndex;
            const isCurrent = validationPhase === catIndex + 1;
            const Icon = category.icon;
            const categorySuccess = category.checks.filter(c => c.status === 'success').length;
            const categoryWarnings = category.checks.filter(c => c.status === 'warning').length;
            const categoryErrors = category.checks.filter(c => c.status === 'error').length;
            const gradient = isDark ? category.gradientDark : category.gradientLight;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: isActive || isCurrent ? 1 : 0.5,
                  scale: isCurrent ? 1.02 : 1
                }}
                className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
                  isCurrent 
                    ? isDark 
                      ? 'border-clarity-secondary/50 bg-clarity-secondary/10' 
                      : 'border-clarity-secondary/50 bg-emerald-50'
                    : isActive 
                      ? isDark 
                        ? 'border-slate-700 bg-slate-800/50' 
                        : 'border-slate-200 bg-white'
                      : isDark 
                        ? 'border-slate-800 bg-slate-900/50' 
                        : 'border-slate-100 bg-slate-50'
                }`}
                onMouseEnter={() => isActive && setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {/* Category Header */}
                <div className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <h4 className={`text-[11px] font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{category.name}</h4>
                      <p className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{category.checks.length} checks</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5">
                    {isCurrent ? (
                      <motion.div
                        className={`flex items-center gap-1 px-2 py-0.5 ${isDark ? 'bg-clarity-secondary/20' : 'bg-emerald-100'} rounded-full`}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Activity className="w-2.5 h-2.5 text-clarity-secondary" />
                        <span className="text-[9px] font-medium text-clarity-secondary">Checking</span>
                      </motion.div>
                    ) : isActive ? (
                      <div className="flex items-center gap-1">
                        {categoryErrors > 0 && (
                          <span className="flex items-center gap-0.5 text-[9px] text-red-500">
                            <XCircle className="w-3 h-3" />
                            {categoryErrors}
                          </span>
                        )}
                        {categoryWarnings > 0 && (
                          <span className="flex items-center gap-0.5 text-[9px] text-amber-500">
                            <AlertTriangle className="w-3 h-3" />
                            {categoryWarnings}
                          </span>
                        )}
                        <span className="flex items-center gap-0.5 text-[9px] text-emerald-500">
                          <CheckCircle2 className="w-3 h-3" />
                          {categorySuccess}
                        </span>
                      </div>
                    ) : (
                      <span className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Pending</span>
                    )}
                  </div>
                </div>

                {/* Expanded Checks */}
                <AnimatePresence>
                  {(isCurrent || activeCategory === category.id) && isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                    >
                      <div className="p-2 space-y-1">
                        {category.checks.map((check, checkIndex) => (
                          <motion.div
                            key={check.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: checkIndex * 0.05 }}
                            className={`flex items-center justify-between py-1 px-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}
                          >
                            <div className="flex items-center gap-2">
                              {check.status === 'success' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : check.status === 'warning' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-red-500" />
                              )}
                              <div>
                                <span className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{check.label}</span>
                                {check.note && (
                                  <p className={`text-[8px] ${
                                    check.status === 'error' ? 'text-red-400' : 'text-amber-400'
                                  }`}>
                                    {check.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <AnimatePresence>
          {validationComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3"
            >
              <div className={`rounded-xl ${isDark ? 'bg-slate-800/80' : 'bg-slate-100'} p-3`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-[10px] font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Summary</h4>
                  <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>2.3s</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-emerald-500">{successCount}</div>
                    <div className={`text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-amber-500">{warningCount}</div>
                    <div className={`text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-red-500">{errorCount}</div>
                    <div className={`text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Errors</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-3 flex justify-between gap-2"
        >
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} border`}>
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center`}>
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>&lt;100ms</div>
              <div className={`text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Response</div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} border`}>
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-clarity-secondary to-emerald-500 flex items-center justify-center`}>
              <BadgeCheck className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>200K+</div>
              <div className={`text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Payer Rules</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ValidationChecklist;
