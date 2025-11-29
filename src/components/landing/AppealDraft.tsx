import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  BookOpen,
  Brain,
  PenTool,
  Wand2,
  Zap,
  Hash,
  User,
  DollarSign,
  Loader2,
  BadgeCheck
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// ============================================================================
// APPEAL DRAFT - COMPACT ANIMATED COMPONENT (Theme-Aware)
// ============================================================================

const AppealDraft: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'retrieving' | 'generating' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showCitations, setShowCitations] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Sample claim data
  const claimData = {
    claimId: 'CLM-2024-89721',
    patient: 'Sarah Mitchell',
    procedure: '99214',
    amount: '$187.00',
    denialReason: 'Medical Necessity'
  };

  // Policy citations
  const citations = [
    { id: 1, type: 'policy', source: 'Anthem Policy BH-045', relevance: 98 },
    { id: 2, type: 'guideline', source: 'AMA CPT Guidelines', relevance: 95 },
    { id: 3, type: 'clinical', source: 'AAFP Guidelines', relevance: 92 },
  ];

  // Shortened appeal letter
  const appealLetterContent = `Dear Appeals Department,

RE: Appeal for Claim #CLM-2024-89721
Patient: Sarah Mitchell | DOS: 10/15/2024

I am writing to formally appeal the denial of the above-referenced claim.

CLINICAL JUSTIFICATION:
The patient presented with chronic low back pain persisting for 8 weeks, meeting your policy's threshold (Anthem Policy BH-045).

Per AMA CPT Guidelines, this encounter meets all criteria for Level 4 E/M service (99214).

REQUEST FOR ACTION:
Based on clinical evidence and policy alignment, we request immediate reconsideration.

Sincerely,
ClarityClaim AI`;

  // Animation helpers
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const animateProgress = async (from: number, to: number, duration: number) => {
    const steps = 15;
    const increment = (to - from) / steps;
    const stepDuration = duration / steps;
    for (let i = 0; i <= steps; i++) {
      setProgress(from + increment * i);
      await delay(stepDuration);
    }
  };

  const typeText = async (text: string, speed: number) => {
    const lines = text.split('\n');
    let currentText = '';
    for (const line of lines) {
      currentText += line + '\n';
      setTypedText(currentText);
      await delay(speed * Math.min(line.length, 15));
    }
  };

  // Run animation sequence
  useEffect(() => {
    if (!isInView) return;

    const runSequence = async () => {
      setPhase('idle');
      setProgress(0);
      setTypedText('');
      setShowCitations(false);
      setElapsedTime(0);

      await delay(1200);

      setPhase('analyzing');
      await animateProgress(0, 25, 600);

      setPhase('retrieving');
      await animateProgress(25, 60, 800);
      setShowCitations(true);

      setPhase('generating');
      await animateProgress(60, 100, 500);
      await typeText(appealLetterContent, 12);

      setPhase('complete');
      setElapsedTime(2.3);

      await delay(4500);
      runSequence();
    };

    runSequence();
  }, [isInView]);

  // Get phase info
  const getPhaseInfo = () => {
    switch (phase) {
      case 'analyzing':
        return { label: 'Analyzing', icon: Brain, color: 'text-violet-500' };
      case 'retrieving':
        return { label: 'Retrieving', icon: BookOpen, color: 'text-clarity-secondary' };
      case 'generating':
        return { label: 'Generating', icon: PenTool, color: 'text-clarity-accent' };
      case 'complete':
        return { label: 'Complete', icon: CheckCircle2, color: 'text-emerald-500' };
      default:
        return { label: 'Ready', icon: Sparkles, color: isDark ? 'text-slate-400' : 'text-slate-500' };
    }
  };

  const phaseInfo = getPhaseInfo();
  const PhaseIcon = phaseInfo.icon;

  return (
    <motion.div 
      ref={containerRef} 
      className={`animation-container relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] group cursor-pointer ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-900/20 border-slate-700/80 hover:border-clarity-accent/50 hover:shadow-lg hover:shadow-clarity-accent/20' 
          : 'bg-gradient-to-br from-slate-50 via-white to-amber-50/50 border-slate-200 hover:border-clarity-accent/50 hover:shadow-lg hover:shadow-clarity-accent/20'
      }`}
      style={{ height: '420px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-15'}`}
          style={{
            backgroundImage: `linear-gradient(${isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)'} 1px, transparent 1px),
                              linear-gradient(90deg, ${isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)'} 1px, transparent 1px)`,
            backgroundSize: '25px 25px'
          }}
        />
        <div className={`absolute top-0 right-0 w-32 h-32 ${isDark ? 'bg-amber-600/10' : 'bg-amber-200/30'} rounded-full blur-2xl`} />
        <div className={`absolute bottom-0 left-0 w-32 h-32 ${isDark ? 'bg-violet-600/10' : 'bg-violet-200/30'} rounded-full blur-2xl`} />
      </div>

      <div className="relative p-4">
        {/* Header */}
        <div className={`rounded-xl ${isDark ? 'bg-slate-800/80' : 'bg-slate-100'} px-3 py-2 mb-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br from-clarity-accent to-orange-500 flex items-center justify-center shadow-sm`}>
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Appeal Generator</h3>
                <p className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>RAG-Powered</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${
              phase === 'complete' 
                ? isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                : phase === 'idle' 
                  ? isDark ? 'bg-slate-700/50' : 'bg-slate-200'
                  : isDark ? 'bg-clarity-accent/20' : 'bg-amber-100'
            }`}>
              {phase !== 'idle' && phase !== 'complete' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className={`w-3 h-3 ${phaseInfo.color}`} />
                </motion.div>
              ) : (
                <PhaseIcon className={`w-3 h-3 ${phaseInfo.color}`} />
              )}
              <span className={`text-[9px] font-medium ${phaseInfo.color}`}>
                {phaseInfo.label}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className={`h-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
              <motion.div
                className="h-full bg-gradient-to-r from-clarity-accent to-orange-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className={`flex justify-between mt-1 text-[8px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>{Math.round(progress)}%</span>
              {phase === 'complete' && <span className="text-emerald-500">{elapsedTime}s</span>}
            </div>
          </div>
        </div>

        {/* Claim Info */}
        <div className={`rounded-lg ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} border p-2.5 mb-3`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <FileText className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={`text-[10px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Denied Claim</span>
            </div>
            <span className="text-[8px] text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded-full">
              {claimData.denialReason}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div className="flex items-center gap-1.5">
              <Hash className={`w-2.5 h-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{claimData.claimId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className={`w-2.5 h-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{claimData.patient}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className={`w-2.5 h-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{claimData.procedure}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className={`w-2.5 h-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{claimData.amount}</span>
            </div>
          </div>
        </div>

        {/* Citations - Always rendered, visibility controlled by max-height and opacity */}
        <div
          className={`overflow-hidden mb-3 transition-all duration-300 ${
            showCitations ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3 h-3 text-clarity-secondary" />
            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sources</span>
          </div>
          <div className="space-y-1.5">
            {citations.map((citation, i) => (
              <motion.div
                key={citation.id}
                initial={{ opacity: 0, x: -5 }}
                animate={showCitations ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} border`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                    citation.type === 'policy'
                      ? 'bg-violet-500/20 text-violet-400'
                      : citation.type === 'guideline'
                        ? isDark ? 'bg-clarity-secondary/20 text-clarity-secondary' : 'bg-teal-100 text-teal-600'
                        : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {citation.type}
                  </span>
                  <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate max-w-[100px]`}>
                    {citation.source}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-clarity-accent">{citation.relevance}%</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Generated Letter Preview */}
        <div className="relative">
          <div className="flex items-center gap-1.5 mb-2">
            <PenTool className="w-3 h-3 text-clarity-accent" />
            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Generated Appeal</span>
          </div>
          
          <div className={`relative rounded-lg ${isDark ? 'bg-slate-100' : 'bg-white border border-slate-200'} p-2.5 h-28 overflow-hidden`}>
            {/* Paper lines */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `repeating-linear-gradient(transparent, transparent 14px, #e5e7eb 15px)`
            }} />
            
            <div className="relative h-full overflow-y-auto">
              {phase === 'idle' ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <FileText className="w-6 h-6 mb-1 opacity-30" />
                  <span className="text-[9px]">Appeal will appear here...</span>
                </div>
              ) : (
                <pre className="text-[8px] text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {typedText}
                  {phase === 'generating' && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-1 h-2.5 bg-clarity-accent ml-0.5"
                    />
                  )}
                </pre>
              )}
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t ${isDark ? 'from-slate-100' : 'from-white'} to-transparent pointer-events-none`} />
          </div>
        </div>

        {/* Stats badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-3 flex justify-between gap-2"
        >
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} border`}>
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center`}>
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>&lt;3s</div>
              <div className={`text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Generation</div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} border`}>
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br from-clarity-accent to-orange-500 flex items-center justify-center`}>
              <BadgeCheck className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>87%</div>
              <div className={`text-[8px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Win Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AppealDraft;
