import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  Scan,
  Zap,
  FileEdit,
  Banknote,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Shield,
  TrendingUp,
  Database,
  Brain,
  FileCheck,
  DollarSign,
  Activity,
  ChevronRight,
} from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import { useState, useEffect, useRef } from "react";
import { useInViewAnimation } from "../../hooks/useInViewAnimation";
import { Button } from "../ui/button";
import { useTheme } from "../../hooks/useTheme";

const steps = [
  {
    id: 1,
    label: "INTEGRATE",
    icon: Plug,
    title: "Connect Your Systems",
    description:
      "Seamless integration with Epic, Cerner, and major clearinghouses via HL7 FHIR and EDI X12 standards.",
    time: "Setup in < 2 weeks",
    color: "from-blue-500 to-cyan-500",
    colorLight: "from-blue-400 to-cyan-400",
    bgGlow: "bg-blue-500/20",
    stats: [
      { label: "EHR Systems", value: "50+" },
      { label: "Clearinghouses", value: "200+" },
    ],
    visualElements: [
      { icon: Database, label: "Epic" },
      { icon: Database, label: "Cerner" },
      { icon: Shield, label: "HIPAA" },
    ],
  },
  {
    id: 2,
    label: "ANALYZE",
    icon: Scan,
    title: "AI Scans Every Claim",
    description:
      "Real-time analysis against payer policies, coding standards, and historical denial patterns.",
    time: "< 100ms per claim",
    color: "from-violet-500 to-purple-500",
    colorLight: "from-violet-400 to-purple-400",
    bgGlow: "bg-violet-500/20",
    stats: [
      { label: "Claims/Second", value: "10K+" },
      { label: "Accuracy", value: "99.2%" },
    ],
    visualElements: [
      { icon: Brain, label: "ML Model" },
      { icon: FileCheck, label: "Policy DB" },
      { icon: Activity, label: "Patterns" },
    ],
  },
  {
    id: 3,
    label: "OPTIMIZE",
    icon: Zap,
    title: "Pre-Submission Fixes",
    description:
      "Automated suggestions for coding errors, missing documentation, and authorization issues.",
    time: "Instant recommendations",
    color: "from-amber-500 to-orange-500",
    colorLight: "from-amber-400 to-orange-400",
    bgGlow: "bg-amber-500/20",
    stats: [
      { label: "Error Detection", value: "94%" },
      { label: "Auto-Fix Rate", value: "78%" },
    ],
    visualElements: [
      { icon: CheckCircle2, label: "Codes" },
      { icon: FileCheck, label: "Auth" },
      { icon: Shield, label: "Docs" },
    ],
  },
  {
    id: 4,
    label: "APPEAL",
    icon: FileEdit,
    title: "Generate Winning Appeals",
    description:
      "AI creates personalized appeal letters with policy citations and clinical evidence.",
    time: "2.3 seconds average",
    color: "from-rose-500 to-pink-500",
    colorLight: "from-rose-400 to-pink-400",
    bgGlow: "bg-rose-500/20",
    stats: [
      { label: "Win Rate", value: "87%" },
      { label: "Gen Time", value: "2.3s" },
    ],
    visualElements: [
      { icon: Sparkles, label: "GPT-4" },
      { icon: FileCheck, label: "Citations" },
      { icon: Brain, label: "Evidence" },
    ],
  },
  {
    id: 5,
    label: "RECOVER",
    icon: Banknote,
    title: "Recover Revenue",
    description:
      "Track success rates, monitor equity metrics, and continuously improve with ML feedback loops.",
    time: "53% faster resolution",
    color: "from-emerald-500 to-teal-500",
    colorLight: "from-emerald-400 to-teal-400",
    bgGlow: "bg-emerald-500/20",
    stats: [
      { label: "Recovered", value: "$2.3M" },
      { label: "Faster", value: "53%" },
    ],
    visualElements: [
      { icon: DollarSign, label: "Revenue" },
      { icon: TrendingUp, label: "Growth" },
      { icon: Activity, label: "Analytics" },
    ],
  },
];

// Animated flowing particle along the path
const FlowParticle = ({ delay, isDark }: { delay: number; isDark: boolean }) => (
  <motion.div
    className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-clarity-secondary' : 'bg-clarity-primary'} shadow-lg`}
    style={{ filter: `blur(1px)`, boxShadow: isDark ? '0 0 10px rgba(13, 148, 136, 0.8)' : '0 0 10px rgba(30, 58, 95, 0.6)' }}
    initial={{ left: '0%', opacity: 0 }}
    animate={{
      left: ['0%', '100%'],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

// Step visualization component
const StepVisual = ({ step, isActive, isDark }: { step: typeof steps[0]; isActive: boolean; isDark: boolean }) => {
  const Icon = step.icon;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background glow */}
      <motion.div
        className={`absolute inset-0 ${step.bgGlow} rounded-2xl blur-xl`}
        animate={{ opacity: isActive ? 0.6 : 0.2, scale: isActive ? 1.1 : 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Central icon */}
      <motion.div
        className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${isDark ? step.color : step.colorLight} flex items-center justify-center shadow-xl`}
        animate={{ 
          scale: isActive ? [1, 1.05, 1] : 1,
          rotate: isActive ? [0, 5, -5, 0] : 0,
        }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
      >
        <Icon className="w-10 h-10 text-white" />
        
        {/* Pulse ring */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 rounded-2xl border-2 border-white/50`}
            animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      {/* Orbiting elements */}
      {step.visualElements.map((el, i) => {
        const angle = (i * 120) - 90;
        const radius = 60;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <motion.div
            key={el.label}
            className={`absolute w-10 h-10 rounded-xl ${isDark ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-sm border ${isDark ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-center shadow-lg`}
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isActive ? { 
              opacity: 1, 
              scale: 1,
              x: [x, x + 3, x],
              y: [y, y - 3, y],
            } : { opacity: 0.4, scale: 0.8 }}
            transition={{ 
              duration: 0.5, 
              delay: i * 0.1,
              x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <el.icon className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
          </motion.div>
        );
      })}
    </div>
  );
};

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(steps[0]);
  const [autoPlay, setAutoPlay] = useState(true);
  const { ref, isInView } = useInViewAnimation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance steps
  useEffect(() => {
    if (!isInView || !autoPlay) return;
    
    intervalRef.current = setInterval(() => {
      setActiveStep(prev => {
        const nextIdx = (steps.findIndex(s => s.id === prev.id) + 1) % steps.length;
        return steps[nextIdx];
      });
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isInView, autoPlay]);

  const handleStepClick = (step: typeof steps[0]) => {
    setActiveStep(step);
    setAutoPlay(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setAutoPlay(true), 10000);
  };

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
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(30, 58, 95, 0.15)'} 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <motion.div 
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDark ? 'bg-clarity-secondary/10' : 'bg-clarity-primary/10'} rounded-full blur-3xl`}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDark ? 'bg-violet-500/10' : 'bg-violet-400/10'} rounded-full blur-3xl`}
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div ref={ref} className="relative">
        <SectionHeader
          eyebrow="HOW IT WORKS"
          title={
            <span>
              From Submission to Success in{' '}
              <span className={`bg-gradient-to-r ${isDark ? 'from-clarity-secondary via-cyan-400 to-clarity-secondary' : 'from-clarity-primary via-blue-500 to-clarity-primary'} bg-clip-text text-transparent`}>
                5 Steps
              </span>
            </span>
          }
          subtitle="Our AI handles the complexity while you focus on patient care"
          align="center"
        />

        {/* Main Content Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
          
          {/* Left: Step Navigation */}
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`flex-1 h-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden`}>
                <motion.div
                  className={`h-full bg-gradient-to-r ${isDark ? activeStep.color : activeStep.colorLight}`}
                  animate={{ width: `${(activeStep.id / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeStep.id}/{steps.length}
              </span>
            </div>

            {/* Step Cards */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep.id === step.id;
                const isPast = activeStep.id > step.id;
                
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => handleStepClick(step)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden group ${
                      isActive
                        ? isDark 
                          ? 'border-slate-600 bg-slate-800/80 shadow-xl' 
                          : 'border-slate-300 bg-white shadow-xl'
                        : isDark
                          ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-700'
                          : 'border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Active indicator bar */}
                    <motion.div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${isDark ? step.color : step.colorLight}`}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="p-4 pl-5">
                      <div className="flex items-start gap-4">
                        {/* Step number/icon */}
                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? `bg-gradient-to-br ${isDark ? step.color : step.colorLight} shadow-lg`
                            : isPast
                              ? isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                              : isDark ? 'bg-slate-800' : 'bg-slate-200'
                        }`}>
                          {isPast ? (
                            <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          ) : (
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                          )}
                          
                          {/* Pulse for active */}
                          {isActive && (
                            <motion.div
                              className={`absolute inset-0 rounded-xl bg-gradient-to-br ${isDark ? step.color : step.colorLight}`}
                              animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold tracking-[0.2em] ${
                              isActive 
                                ? isDark ? 'text-clarity-secondary' : 'text-clarity-primary'
                                : isDark ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              STEP {step.id}
                            </span>
                            <span className={`text-[10px] font-semibold tracking-wider ${
                              isActive 
                                ? isDark ? 'text-slate-300' : 'text-slate-600'
                                : isDark ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                              • {step.label}
                            </span>
                          </div>
                          <h4 className={`text-sm font-semibold mb-1 ${
                            isActive
                              ? isDark ? 'text-white' : 'text-slate-900'
                              : isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {step.title}
                          </h4>
                          
                          {/* Expandable content */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-3`}>
                                  {step.description}
                                </p>
                                
                                {/* Stats */}
                                <div className="flex gap-4">
                                  {step.stats.map((stat) => (
                                    <div key={stat.label}>
                                      <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {stat.value}
                                      </div>
                                      <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {stat.label}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Time badge */}
                                <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                                  isDark ? 'bg-slate-700/50' : 'bg-slate-100'
                                }`}>
                                  <Clock className={`w-3 h-3 ${isDark ? 'text-clarity-accent' : 'text-amber-600'}`} />
                                  <span className={`text-[10px] font-medium ${isDark ? 'text-clarity-accent' : 'text-amber-600'}`}>
                                    {step.time}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Arrow */}
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                          isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                        } ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: Visualization */}
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Main Visual Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className={`relative rounded-3xl border overflow-hidden ${
                isDark 
                  ? 'bg-slate-900/80 border-slate-700/50' 
                  : 'bg-white/80 border-slate-200'
              } backdrop-blur-xl shadow-2xl`}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700/50 bg-slate-800/50' : 'border-slate-200 bg-slate-50/80'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      key={activeStep.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isDark ? activeStep.color : activeStep.colorLight} flex items-center justify-center`}
                    >
                      <activeStep.icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <motion.h3
                        key={activeStep.title}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}
                      >
                        {activeStep.title}
                      </motion.h3>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Step {activeStep.id} of {steps.length}
                      </p>
                    </div>
                  </div>
                  
                  {/* Live indicator */}
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Live</span>
                  </div>
                </div>
              </div>
              
              {/* Visualization Area */}
              <div className="relative h-64 sm:h-72 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <StepVisual step={activeStep} isActive={true} isDark={isDark} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Flow Progress Bar */}
              <div className={`px-6 py-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <div className="relative">
                  {/* Track */}
                  <div className={`h-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden`}>
                    {/* Particles */}
                    <div className="absolute inset-0">
                      {[0, 1, 2].map((i) => (
                        <FlowParticle key={i} delay={i * 1.3} isDark={isDark} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Step markers */}
                  <div className="absolute inset-0 flex justify-between items-center px-1">
                    {steps.map((step) => (
                      <motion.div
                        key={step.id}
                        className={`w-3 h-3 rounded-full border-2 transition-all ${
                          activeStep.id >= step.id
                            ? `bg-gradient-to-br ${isDark ? step.color : step.colorLight} border-transparent`
                            : isDark 
                              ? 'bg-slate-800 border-slate-600' 
                              : 'bg-white border-slate-300'
                        }`}
                        animate={activeStep.id === step.id ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 1, repeat: activeStep.id === step.id ? Infinity : 0 }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Step labels */}
                <div className="flex justify-between mt-3">
                  {steps.map((step) => (
                    <span
                      key={step.id}
                      className={`text-[9px] font-semibold tracking-wider transition-colors ${
                        activeStep.id === step.id
                          ? isDark ? 'text-white' : 'text-slate-800'
                          : isDark ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className={`rounded-2xl border p-6 ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50' 
                  : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-clarity-secondary to-cyan-500 flex items-center justify-center shadow-lg`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    See It In Action
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Watch the entire workflow live
                  </p>
                </div>
              </div>
              
              <Button size="lg" className="w-full group">
                <BadgeCheck className="h-4 w-4" />
                <span>Schedule a Demo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <p className={`text-xs text-center mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No commitment required • See real results
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default HowItWorksSection;
