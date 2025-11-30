import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Brain,
  FileText,
  Shield,
  Zap,
  CheckCircle,
  Scale,
  Database,
  Sparkles,
  ArrowRight,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// ============================================================================
// AI PATTERN MAP - ANIMATED COMPONENT (Theme-Aware)
// ============================================================================

interface PatternNodeProps {
  node: {
    id: string;
    label: string;
    icon: React.ElementType;
    colorLight: string;
    colorDark: string;
    glowColorLight: string;
    glowColorDark: string;
    description: string;
    stats: string;
    position: { x: number; y: number };
  };
  isActive: boolean;
  isHighlighted: boolean;
  onHover: (id: string | null) => void;
  delay: number;
  isInView: boolean;
  isCenter?: boolean;
  isDark: boolean;
}

const PatternNode: React.FC<PatternNodeProps> = ({ 
  node, 
  isActive, 
  isHighlighted, 
  onHover, 
  delay, 
  isInView,
  isCenter = false,
  isDark
}) => {
  const Icon = node.icon;
  const color = isDark ? node.colorDark : node.colorLight;
  const glowColor = isDark ? node.glowColorDark : node.glowColorLight;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        duration: 0.5, 
        delay,
        type: 'spring',
        stiffness: 200
      }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className="relative group cursor-pointer"
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 ${
          isActive ? 'opacity-60' : 'opacity-0'
        }`}
        style={{ backgroundColor: glowColor }}
        animate={isHighlighted ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1, repeat: isHighlighted ? Infinity : 0 }}
      />
      
      {/* Pulse rings for center node */}
      {isCenter && isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-clarity-secondary/50"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-violet-500/50"
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      {/* Main node */}
      <motion.div
        className={`relative ${isCenter ? 'w-20 h-20 md:w-24 md:h-24' : 'w-14 h-14 md:w-18 md:h-18'} rounded-2xl bg-gradient-to-br ${color} p-0.5 transition-transform duration-300 ${
          isHighlighted ? 'scale-110' : ''
        }`}
        animate={isActive ? { 
          boxShadow: [
            `0 0 15px ${glowColor}`,
            `0 0 30px ${glowColor}`,
            `0 0 15px ${glowColor}`
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`w-full h-full rounded-xl ${isDark ? 'bg-neutral-900/80' : 'bg-white/90'} backdrop-blur-sm flex flex-col items-center justify-center gap-0.5`}>
          <Icon className={`${isCenter ? 'w-6 h-6 md:w-7 md:h-7' : 'w-4 h-4 md:w-5 md:h-5'} ${isDark ? 'text-white' : 'text-neutral-800'}`} />
          <span className={`${isCenter ? 'text-[8px] md:text-[9px]' : 'text-[7px] md:text-[8px]'} font-medium ${isDark ? 'text-white/80' : 'text-neutral-700'} text-center px-1 leading-tight`}>
            {node.label}
          </span>
        </div>
      </motion.div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping" />
        </motion.div>
      )}

      {/* Stats badge on hover */}
      <AnimatePresence>
        {isHighlighted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-10"
          >
            <div className={`px-2 py-0.5 ${isDark ? 'bg-white/10 border-white/20' : 'bg-neutral-900/10 border-neutral-900/20'} backdrop-blur-sm rounded-lg border`}>
              <span className="text-[9px] font-bold text-clarity-secondary">{node.stats}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// MAIN AI PATTERN MAP COMPONENT
// ============================================================================

const AIPatternMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [dataFlowStep, setDataFlowStep] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Auto-cycle through data flow animation
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setDataFlowStep((prev) => (prev + 1) % 6);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isInView]);

  // Node definitions with theme-aware colors
  const nodes = {
    input: {
      id: 'input',
      label: 'Claims Input',
      icon: FileText,
      colorDark: 'from-neutral-500 to-neutral-600',
      colorLight: 'from-neutral-400 to-neutral-500',
      glowColorDark: 'rgba(100, 116, 139, 0.4)',
      glowColorLight: 'rgba(100, 116, 139, 0.3)',
      description: 'EHR, Clearinghouse & EDI X12 data ingestion',
      stats: '100K+ claims/day',
      position: { x: 10, y: 50 }
    },
    prediction: {
      id: 'prediction',
      label: 'Denial Prediction',
      icon: Brain,
      colorDark: 'from-violet-500 to-purple-600',
      colorLight: 'from-violet-400 to-purple-500',
      glowColorDark: 'rgba(139, 92, 246, 0.5)',
      glowColorLight: 'rgba(139, 92, 246, 0.35)',
      description: 'ML ensemble predicts denial risk before submission',
      stats: '94.2% accuracy',
      position: { x: 30, y: 25 }
    },
    validation: {
      id: 'validation',
      label: 'Smart Validation',
      icon: Shield,
      colorDark: 'from-emerald-500 to-teal-600',
      colorLight: 'from-emerald-400 to-teal-500',
      glowColorDark: 'rgba(16, 185, 129, 0.5)',
      glowColorLight: 'rgba(16, 185, 129, 0.35)',
      description: 'Real-time coding & documentation validation',
      stats: '25% first-pass lift',
      position: { x: 30, y: 75 }
    },
    rag: {
      id: 'rag',
      label: 'RAG Knowledge',
      icon: Database,
      colorDark: 'from-clarity-secondary to-teal-600',
      colorLight: 'from-clarity-secondary to-teal-500',
      glowColorDark: 'rgba(13, 148, 136, 0.5)',
      glowColorLight: 'rgba(13, 148, 136, 0.35)',
      description: '200K+ policies indexed for instant retrieval',
      stats: '2.3s generation',
      position: { x: 50, y: 50 }
    },
    appeal: {
      id: 'appeal',
      label: 'Appeal Generator',
      icon: Sparkles,
      colorDark: 'from-clarity-accent to-orange-500',
      colorLight: 'from-amber-400 to-orange-400',
      glowColorDark: 'rgba(245, 158, 11, 0.5)',
      glowColorLight: 'rgba(245, 158, 11, 0.35)',
      description: 'GPT-powered appeal letters with citations',
      stats: '87% win rate',
      position: { x: 70, y: 25 }
    },
    equity: {
      id: 'equity',
      label: 'Equity Monitor',
      icon: Scale,
      colorDark: 'from-rose-500 to-pink-600',
      colorLight: 'from-rose-400 to-pink-500',
      glowColorDark: 'rgba(244, 63, 94, 0.5)',
      glowColorLight: 'rgba(244, 63, 94, 0.35)',
      description: 'Real-time disparity detection & alerts',
      stats: 'Sub-second alerts',
      position: { x: 70, y: 75 }
    },
    output: {
      id: 'output',
      label: 'Optimized Output',
      icon: CheckCircle,
      colorDark: 'from-teal-500 to-cyan-600',
      colorLight: 'from-teal-400 to-cyan-500',
      glowColorDark: 'rgba(20, 184, 166, 0.5)',
      glowColorLight: 'rgba(20, 184, 166, 0.35)',
      description: 'Clean claims, appeals & compliance reports',
      stats: '35% denial reduction',
      position: { x: 90, y: 50 }
    }
  };

  // Connection paths between nodes
  const connections = [
    { from: 'input', to: 'prediction', step: 0 },
    { from: 'input', to: 'validation', step: 0 },
    { from: 'prediction', to: 'rag', step: 1 },
    { from: 'validation', to: 'rag', step: 1 },
    { from: 'rag', to: 'appeal', step: 2 },
    { from: 'rag', to: 'equity', step: 2 },
    { from: 'appeal', to: 'output', step: 3 },
    { from: 'equity', to: 'output', step: 3 },
  ];

  // Floating particles - memoized to avoid impure function during render
  const particles = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: ((i * 31) % 100),
    y: ((i * 17 + 23) % 100),
    size: (i % 3) + 1,
    duration: (i % 8) + 8,
    delay: i % 4
  })), []);

  return (
    <motion.div 
      ref={containerRef} 
      className={`animation-container relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] group cursor-pointer ${
        isDark 
          ? 'bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-clarity-primary/20 border-neutral-700/80 hover:border-clarity-secondary/50 hover:shadow-lg hover:shadow-clarity-secondary/20' 
          : 'bg-gradient-to-br from-neutral-50 via-white to-clarity-secondary/10 border-neutral-200 hover:border-clarity-secondary/50 hover:shadow-lg hover:shadow-clarity-secondary/20'
      }`}
      style={{ height: '440px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div 
          className={`absolute inset-0 ${isDark ? 'opacity-15' : 'opacity-10'}`}
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? 'rgba(13, 148, 136, 0.15)' : 'rgba(30, 58, 95, 0.1)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? 'rgba(13, 148, 136, 0.15)' : 'rgba(30, 58, 95, 0.1)'} 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${isDark ? 'bg-clarity-secondary/30' : 'bg-clarity-primary/20'}`}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Gradient orbs */}
        <div className={`absolute top-1/4 left-1/4 w-32 h-32 ${isDark ? 'bg-violet-600/15' : 'bg-violet-400/10'} rounded-full blur-2xl`} />
        <div className={`absolute bottom-1/4 right-1/4 w-32 h-32 ${isDark ? 'bg-clarity-secondary/15' : 'bg-clarity-secondary/10'} rounded-full blur-2xl`} />
      </div>

      <div className="relative p-4 md:p-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-4"
        >
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-900/5 border-neutral-900/10'} backdrop-blur-sm rounded-full border`}>
            <Brain className="w-3 h-3 text-clarity-secondary" />
            <span className={`text-[10px] font-medium ${isDark ? 'text-clarity-secondary' : 'text-clarity-primary'}`}>AI Pattern Map</span>
          </div>
          
          {/* Processing Indicator */}
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-3 h-3 text-clarity-secondary" />
            </motion.div>
            <span className="text-[9px] text-clarity-secondary">Live</span>
          </div>
        </motion.div>

        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '200px' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines */}
          {connections.map((conn, i) => {
            const from = nodes[conn.from as keyof typeof nodes];
            const to = nodes[conn.to as keyof typeof nodes];
            const isActive = dataFlowStep >= conn.step;
            
            const x1 = from.position.x;
            const y1 = from.position.y;
            const x2 = to.position.x;
            const y2 = to.position.y;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const curveOffset = (y2 - y1) * 0.3;
            
            return (
              <g key={i}>
                <motion.path
                  d={`M ${x1}% ${y1}% Q ${midX}% ${midY + curveOffset}% ${x2}% ${y2}%`}
                  fill="none"
                  stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                />
                
                {isActive && (
                  <motion.circle
                    r="2.5"
                    fill={isDark ? '#8b5cf6' : '#0D9488'}
                    filter="url(#glow)"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      offsetDistance: ['0%', '100%']
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: conn.step * 0.25
                    }}
                    style={{
                      offsetPath: `path("M ${x1 * 3}% ${y1 * 2}% Q ${midX * 3}% ${(midY + curveOffset) * 2}% ${x2 * 3}% ${y2 * 2}%")`
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes Grid */}
        <div className="relative grid grid-cols-7 gap-2" style={{ minHeight: '180px' }}>
          {/* Input Node */}
          <div className="col-span-1 flex items-center justify-center">
            <PatternNode 
              node={nodes.input} 
              isActive={dataFlowStep >= 0}
              isHighlighted={activeNode === 'input'}
              onHover={setActiveNode}
              delay={0}
              isInView={isInView}
              isDark={isDark}
            />
          </div>

          {/* Prediction & Validation */}
          <div className="col-span-2 flex flex-col justify-around py-4">
            <PatternNode 
              node={nodes.prediction} 
              isActive={dataFlowStep >= 1}
              isHighlighted={activeNode === 'prediction'}
              onHover={setActiveNode}
              delay={0.15}
              isInView={isInView}
              isDark={isDark}
            />
            <PatternNode 
              node={nodes.validation} 
              isActive={dataFlowStep >= 1}
              isHighlighted={activeNode === 'validation'}
              onHover={setActiveNode}
              delay={0.2}
              isInView={isInView}
              isDark={isDark}
            />
          </div>

          {/* RAG Center */}
          <div className="col-span-1 flex items-center justify-center">
            <PatternNode 
              node={nodes.rag} 
              isActive={dataFlowStep >= 2}
              isHighlighted={activeNode === 'rag'}
              onHover={setActiveNode}
              delay={0.25}
              isInView={isInView}
              isCenter={true}
              isDark={isDark}
            />
          </div>

          {/* Appeal & Equity */}
          <div className="col-span-2 flex flex-col justify-around py-4">
            <PatternNode 
              node={nodes.appeal} 
              isActive={dataFlowStep >= 3}
              isHighlighted={activeNode === 'appeal'}
              onHover={setActiveNode}
              delay={0.3}
              isInView={isInView}
              isDark={isDark}
            />
            <PatternNode 
              node={nodes.equity} 
              isActive={dataFlowStep >= 3}
              isHighlighted={activeNode === 'equity'}
              onHover={setActiveNode}
              delay={0.35}
              isInView={isInView}
              isDark={isDark}
            />
          </div>

          {/* Output Node */}
          <div className="col-span-1 flex items-center justify-center">
            <PatternNode 
              node={nodes.output} 
              isActive={dataFlowStep >= 4}
              isHighlighted={activeNode === 'output'}
              onHover={setActiveNode}
              delay={0.4}
              isInView={isInView}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Flow Direction Indicator */}
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'} text-[9px]`}>
          <span>Data Flow</span>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <ArrowRight className="w-3 h-3" />
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-4 grid grid-cols-4 gap-2"
        >
          {[
            { label: 'Accuracy', value: '94.2%', icon: Brain, color: 'text-violet-400' },
            { label: 'Win Rate', value: '87%', icon: Sparkles, color: 'text-clarity-accent' },
            { label: 'Speed', value: '<100ms', icon: Zap, color: 'text-clarity-secondary' },
            { label: 'Reduction', value: '35%', icon: BarChart3, color: 'text-emerald-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-900/5 border-neutral-900/10'} backdrop-blur-sm rounded-lg border px-2 py-1.5 text-center`}
            >
              <stat.icon className={`w-3 h-3 ${stat.color} mx-auto mb-0.5`} />
              <div className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>{stat.value}</div>
              <div className={`text-[8px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Detail Panel on hover */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-0 left-0 right-0 ${isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'} backdrop-blur-xl rounded-b-2xl border-t p-3`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${isDark ? nodes[activeNode as keyof typeof nodes].colorDark : nodes[activeNode as keyof typeof nodes].colorLight}`}>
                {React.createElement(nodes[activeNode as keyof typeof nodes].icon, { className: 'w-4 h-4 text-white' })}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-800'} mb-0.5`}>
                  {nodes[activeNode as keyof typeof nodes].label}
                </h3>
                <p className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'} line-clamp-2`}>
                  {nodes[activeNode as keyof typeof nodes].description}
                </p>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 ${isDark ? 'bg-white/10' : 'bg-neutral-100'} rounded-full shrink-0`}>
                <BarChart3 className="w-3 h-3 text-clarity-secondary" />
                <span className="text-[9px] font-medium text-clarity-secondary">
                  {nodes[activeNode as keyof typeof nodes].stats}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// MOBILE VERSION
// ============================================================================

const AIPatternMapMobile: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-30px' });
  const [activeStep, setActiveStep] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(interval);
  }, [isInView]);

  const steps = [
    { icon: FileText, label: 'Claims Ingestion', colorDark: 'from-neutral-500 to-neutral-600', colorLight: 'from-neutral-400 to-neutral-500', stat: '100K+/day' },
    { icon: Brain, label: 'AI Prediction', colorDark: 'from-violet-500 to-purple-600', colorLight: 'from-violet-400 to-purple-500', stat: '94.2% accuracy' },
    { icon: Database, label: 'RAG Processing', colorDark: 'from-clarity-secondary to-teal-600', colorLight: 'from-clarity-secondary to-teal-500', stat: '200K+ policies' },
    { icon: Sparkles, label: 'Appeal Generation', colorDark: 'from-clarity-accent to-orange-500', colorLight: 'from-amber-400 to-orange-400', stat: '87% win rate' },
    { icon: CheckCircle, label: 'Optimized Output', colorDark: 'from-emerald-500 to-teal-600', colorLight: 'from-emerald-400 to-teal-500', stat: '35% reduction' },
  ];

  return (
    <motion.div 
      ref={containerRef} 
      className={`animation-container relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
        isDark 
          ? 'bg-gradient-to-br from-neutral-900 to-clarity-primary/20 border-neutral-700/80 hover:border-clarity-secondary/50' 
          : 'bg-gradient-to-br from-neutral-50 to-clarity-secondary/10 border-neutral-200 hover:border-clarity-secondary/50'
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center gap-2 mb-3"
        >
          <Brain className="w-4 h-4 text-clarity-secondary" />
          <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-800'}`}>AI Pattern Map</span>
        </motion.div>

        <div className="space-y-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className={`relative p-2 rounded-lg border transition-all duration-300 ${
                activeStep === i
                  ? isDark 
                    ? 'bg-white/10 border-clarity-secondary/50 scale-[1.02]'
                    : 'bg-clarity-secondary/10 border-clarity-secondary/50 scale-[1.02]'
                  : isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${isDark ? step.colorDark : step.colorLight}`}>
                  <step.icon className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[11px] font-semibold ${isDark ? 'text-white' : 'text-neutral-800'}`}>{step.label}</h3>
                  <p className="text-[9px] text-clarity-secondary">{step.stat}</p>
                </div>
                {activeStep === i && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-clarity-secondary rounded-full"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// RESPONSIVE WRAPPER
// ============================================================================

const AIPatternMapResponsive: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <AIPatternMapMobile /> : <AIPatternMap />;
};

export default AIPatternMapResponsive;
export { AIPatternMap, AIPatternMapMobile };
