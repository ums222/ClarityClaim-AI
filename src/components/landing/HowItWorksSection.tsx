import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Link2,
  Brain,
  Sparkles,
  FileText,
  DollarSign,
  Check,
  Database,
  Server,
  Cloud,
  Cpu,
  BarChart3,
  Shield,
  Target,
  Zap,
  FileCheck,
  Scale,
  TrendingUp,
  BadgeCheck,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import { useTheme } from "../../hooks/useTheme";

// ============================================================================
// 5-STEP WORKFLOW ANIMATION COMPONENT (Theme-Aware)
// ============================================================================

// Step definitions
const steps = [
  {
    id: 0,
    key: 'integrate',
    title: 'INTEGRATE',
    subtitle: 'Connect Your Systems',
    description: 'Seamlessly connect to your existing EHR, practice management, and clearinghouse systems with our plug-and-play integrations.',
    icon: Link2,
    gradient: 'from-blue-500 to-cyan-500',
    gradientLight: 'from-blue-400 to-cyan-400',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    glowColorLight: 'rgba(59, 130, 246, 0.25)',
    bgGlow: 'bg-blue-500/20',
    bgGlowLight: 'bg-blue-400/15',
    borderColor: 'border-blue-500',
    stats: [
      { label: 'EHR Systems', value: '50+' },
      { label: 'Setup Time', value: '<24hrs' },
      { label: 'Data Formats', value: 'EDI/FHIR' }
    ],
    orbitingElements: [
      { icon: Database, label: 'EHR' },
      { icon: Server, label: 'PMS' },
      { icon: Cloud, label: 'Cloud' }
    ],
    timing: 'Day 1'
  },
  {
    id: 1,
    key: 'analyze',
    title: 'ANALYZE',
    subtitle: 'AI-Powered Analysis',
    description: 'Our ML models analyze every claim against 200K+ payer policies, predicting denial risk with 94% accuracy before submission.',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-600',
    gradientLight: 'from-violet-400 to-purple-500',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    glowColorLight: 'rgba(139, 92, 246, 0.25)',
    bgGlow: 'bg-violet-500/20',
    bgGlowLight: 'bg-violet-400/15',
    borderColor: 'border-violet-500',
    stats: [
      { label: 'Accuracy', value: '94.2%' },
      { label: 'Policies', value: '200K+' },
      { label: 'Latency', value: '<100ms' }
    ],
    orbitingElements: [
      { icon: Cpu, label: 'ML' },
      { icon: BarChart3, label: 'Analytics' },
      { icon: Shield, label: 'Validate' }
    ],
    timing: 'Real-time'
  },
  {
    id: 2,
    key: 'optimize',
    title: 'OPTIMIZE',
    subtitle: 'Smart Corrections',
    description: 'Automatically fix coding errors, add missing modifiers, and ensure documentation completeness before claims go out.',
    icon: Sparkles,
    gradient: 'from-amber-500 to-orange-500',
    gradientLight: 'from-amber-400 to-orange-400',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    glowColorLight: 'rgba(245, 158, 11, 0.25)',
    bgGlow: 'bg-amber-500/20',
    bgGlowLight: 'bg-amber-400/15',
    borderColor: 'border-amber-500',
    stats: [
      { label: 'First-Pass Rate', value: '+25%' },
      { label: 'Auto-Fixes', value: '85%' },
      { label: 'Validation', value: '99.2%' }
    ],
    orbitingElements: [
      { icon: FileCheck, label: 'Codes' },
      { icon: Target, label: 'Optimize' },
      { icon: Zap, label: 'Speed' }
    ],
    timing: 'Instant'
  },
  {
    id: 3,
    key: 'appeal',
    title: 'APPEAL',
    subtitle: 'Generate Appeals',
    description: 'When denials occur, our RAG-powered engine generates custom appeal letters with precise citations in under 3 seconds.',
    icon: FileText,
    gradient: 'from-rose-500 to-pink-600',
    gradientLight: 'from-rose-400 to-pink-500',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    glowColorLight: 'rgba(244, 63, 94, 0.25)',
    bgGlow: 'bg-rose-500/20',
    bgGlowLight: 'bg-rose-400/15',
    borderColor: 'border-rose-500',
    stats: [
      { label: 'Win Rate', value: '87%' },
      { label: 'Generation', value: '<3s' },
      { label: 'Citations', value: 'Auto' }
    ],
    orbitingElements: [
      { icon: FileText, label: 'Letter' },
      { icon: Scale, label: 'Policy' },
      { icon: BadgeCheck, label: 'Cite' }
    ],
    timing: '< 3 seconds'
  },
  {
    id: 4,
    key: 'recover',
    title: 'RECOVER',
    subtitle: 'Maximize Revenue',
    description: 'Track appeal outcomes, recover denied revenue, and continuously improve with AI-driven insights and recommendations.',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-500',
    gradientLight: 'from-emerald-400 to-teal-400',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    glowColorLight: 'rgba(16, 185, 129, 0.25)',
    bgGlow: 'bg-emerald-500/20',
    bgGlowLight: 'bg-emerald-400/15',
    borderColor: 'border-emerald-500',
    stats: [
      { label: 'Recovered', value: '$2.3M' },
      { label: 'Denial Drop', value: '-35%' },
      { label: 'ROI', value: '10x' }
    ],
    orbitingElements: [
      { icon: DollarSign, label: 'Revenue' },
      { icon: TrendingUp, label: 'Growth' },
      { icon: BarChart3, label: 'Insights' }
    ],
    timing: 'Ongoing'
  }
];

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Auto-advance logic
  useEffect(() => {
    if (!isInView) return;

    const advanceStep = () => {
      if (!isPaused) {
        setCompletedSteps(prev => {
          if (!prev.includes(activeStep)) {
            return [...prev, activeStep];
          }
          return prev;
        });
        setActiveStep(prev => (prev + 1) % steps.length);
      }
    };

    autoAdvanceRef.current = setInterval(advanceStep, 4000);

    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    };
  }, [isInView, isPaused, activeStep]);

  // Resume after inactivity
  useEffect(() => {
    if (isPaused) {
      resumeRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 10000);
    }

    return () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, [isPaused, lastInteraction]);

  // Handle step click
  const handleStepClick = useCallback((stepId: number) => {
    setActiveStep(stepId);
    setIsPaused(true);
    setLastInteraction(Date.now());
    
    // Mark previous steps as completed
    const newCompleted: number[] = [];
    for (let i = 0; i < stepId; i++) {
      newCompleted.push(i);
    }
    setCompletedSteps(newCompleted);
  }, []);

  const currentStep = steps[activeStep];

  return (
    <SectionContainer
      id="how-it-works"
      className="relative overflow-hidden section-bg-dark"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div 
          className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-10'}`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(30, 58, 95, 0.15)'} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Dynamic glow based on active step */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isDark ? currentStep.bgGlow : currentStep.bgGlowLight} rounded-full blur-3xl`}
        />
      </div>

      <div ref={containerRef} className="relative">
        {/* Header */}
        <SectionHeader
          eyebrow="HOW IT WORKS"
          title={
            <span>
              From Submission to Success in{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                5 Steps
              </span>
            </span>
          }
          subtitle="Our AI handles the complexity while you focus on patient care"
          align="center"
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mt-12 mb-16">
          
          {/* Left - Step Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="animation-container space-y-3"
          >
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const isCompleted = completedSteps.includes(index);
              const StepIcon = step.icon;

              return (
                <div
                  key={step.key}
                  onClick={() => handleStepClick(index)}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                    isActive
                      ? isDark
                        ? 'border-transparent bg-neutral-800/80 shadow-lg'
                        : 'border-transparent bg-white shadow-lg'
                      : isCompleted
                        ? isDark
                          ? 'border-neutral-700 bg-neutral-800/40 hover:bg-neutral-800/60'
                          : 'border-neutral-300 bg-neutral-100/60 hover:bg-neutral-100'
                        : isDark
                          ? 'border-neutral-700/50 bg-neutral-800/20 hover:bg-neutral-800/40'
                          : 'border-neutral-200 bg-white/60 hover:bg-white'
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${isDark ? step.gradient : step.gradientLight}`} />
                  )}

                  <div className="p-3 pl-4">
                    <div className="flex items-center gap-3">
                      {/* Step Number / Check */}
                      <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                        isActive
                          ? `bg-gradient-to-br ${isDark ? step.gradient : step.gradientLight} shadow-md`
                          : isCompleted
                            ? isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                            : isDark ? 'bg-neutral-700/50' : 'bg-neutral-200'
                      }`}>
                        {isCompleted && !isActive ? (
                          <Check className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        ) : (
                          <span className={`text-xs font-bold ${isActive ? 'text-white' : isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-bold transition-colors ${
                          isActive
                            ? isDark ? 'text-white' : 'text-neutral-900'
                            : isDark ? 'text-neutral-300' : 'text-neutral-600'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{step.subtitle}</p>
                      </div>

                      {/* Icon & Timing */}
                      <StepIcon className={`w-4 h-4 flex-shrink-0 ${
                        isActive
                          ? isDark ? 'text-white' : 'text-neutral-700'
                          : isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Play/Pause Control */}
            <div className="flex items-center justify-center pt-4">
              <button
                onClick={() => {
                  setIsPaused(!isPaused);
                  setLastInteraction(Date.now());
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-400 hover:text-white' 
                    : 'bg-neutral-200/80 hover:bg-neutral-300 text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Resume Auto-Play</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="text-sm">Pause</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Right - Visualization Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background glow */}
              <motion.div
                key={`glow-${activeStep}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${isDark ? currentStep.glowColor : currentStep.glowColorLight} 0%, transparent 70%)`
                }}
              />

              {/* Outer ring */}
              <div className={`absolute inset-8 rounded-full border-2 ${isDark ? 'border-neutral-700/30' : 'border-neutral-300/50'}`} />
              
              {/* Middle ring */}
              <div className={`absolute inset-16 rounded-full border ${isDark ? 'border-neutral-700/20' : 'border-neutral-300/30'}`} />

              {/* Orbiting Elements */}
              {currentStep.orbitingElements.map((element, i) => {
                const angle = (i * 120) - 90; // Distribute evenly
                const radius = 42; // Percentage from center
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                const OrbitIcon = element.icon;

                return (
                  <motion.div
                    key={`${activeStep}-${element.label}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      opacity: { delay: 0.2 + i * 0.1, duration: 0.3 },
                      scale: { delay: 0.2 + i * 0.1, duration: 0.3 },
                      rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
                    }}
                    className="absolute"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, -360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${isDark ? currentStep.gradient : currentStep.gradientLight} p-0.5 shadow-lg`}
                    >
                      <div className={`w-full h-full rounded-xl ${isDark ? 'bg-neutral-900' : 'bg-white'} flex flex-col items-center justify-center`}>
                        <OrbitIcon className={`w-5 h-5 ${isDark ? 'text-white' : 'text-neutral-700'}`} />
                        <span className={`text-[10px] mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{element.label}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${isDark ? currentStep.gradient : currentStep.gradientLight} p-1 shadow-2xl`}
                  >
                    <div className={`w-full h-full rounded-3xl ${isDark ? 'bg-neutral-900/90' : 'bg-white/90'} flex items-center justify-center`}>
                      <currentStep.icon className={`w-16 h-16 ${isDark ? 'text-white' : 'text-neutral-700'}`} />
                    </div>
                    
                    {/* Pulse rings */}
                    <motion.div
                      className={`absolute inset-0 rounded-3xl border-2 ${currentStep.borderColor}`}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Step Label */}
              <motion.div
                key={`label-${activeStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              >
                <div className={`px-6 py-2 rounded-full bg-gradient-to-r ${isDark ? currentStep.gradient : currentStep.gradientLight} text-white font-bold text-lg shadow-lg`}>
                  {currentStep.title}
                </div>
              </motion.div>
            </div>

            {/* Step Details Panel */}
            <motion.div
              key={`details-${activeStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-8 p-4 rounded-2xl ${isDark ? 'bg-neutral-800/60' : 'bg-white/80'} border ${isDark ? 'border-neutral-700/50' : 'border-neutral-200'}`}
            >
              <p className={`text-sm mb-4 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {currentStep.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                {currentStep.stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-xl p-3 text-center ${isDark ? 'bg-neutral-900/50' : 'bg-neutral-100'}`}
                  >
                    <div className={`text-lg font-bold bg-gradient-to-r ${isDark ? currentStep.gradient : currentStep.gradientLight} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Timing Badge */}
              <div className="mt-3 flex justify-center">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-neutral-700/50 text-neutral-300' : 'bg-neutral-200 text-neutral-600'}`}>
                  {currentStep.timing}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Flow Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative"
        >
          {/* Track */}
          <div className={`relative h-2 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
            {/* Progress fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-violet-500 via-amber-500 via-rose-500 to-emerald-500"
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Flowing particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute top-1/2 -translate-y-1/2 w-8 h-1 rounded-full ${isDark ? 'bg-white/30' : 'bg-white/60'}`}
                  animate={{
                    x: ['-100%', '1200%'],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: 'linear'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Step Markers */}
          <div className="relative flex justify-between mt-4">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const isCompleted = completedSteps.includes(index) || activeStep > index;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => handleStepClick(index)}
                >
                  {/* Marker */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${isDark ? step.gradient : step.gradientLight} shadow-lg`
                        : isCompleted
                          ? 'bg-emerald-500'
                          : isDark 
                            ? 'bg-neutral-700 group-hover:bg-neutral-600' 
                            : 'bg-neutral-300 group-hover:bg-neutral-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className={`w-5 h-5 ${
                        isActive 
                          ? 'text-white' 
                          : isDark 
                            ? 'text-neutral-400 group-hover:text-white' 
                            : 'text-neutral-500 group-hover:text-white'
                      }`} />
                    )}
                  </motion.div>
                  
                  {/* Label */}
                  <span className={`mt-2 text-xs font-medium transition-colors ${
                    isActive 
                      ? isDark ? 'text-white' : 'text-neutral-900' 
                      : isDark 
                        ? 'text-neutral-500 group-hover:text-neutral-300' 
                        : 'text-neutral-400 group-hover:text-neutral-600'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Connector lines (for visual appeal) */}
          <div className="absolute top-6 left-0 right-0 flex justify-between px-5 -z-10">
            {steps.slice(0, -1).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  i < activeStep 
                    ? 'bg-emerald-500' 
                    : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-clarity-secondary to-cyan-500 hover:from-clarity-secondary/90 hover:to-cyan-600 rounded-xl text-white font-semibold shadow-lg transition-all ${isDark ? 'shadow-clarity-secondary/25' : 'shadow-clarity-secondary/20'}`}
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </SectionContainer>
  );
};

export default HowItWorksSection;
