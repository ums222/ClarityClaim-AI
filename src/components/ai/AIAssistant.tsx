import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  AlertTriangle,
  Loader2,
  Scale,
  TrendingUp,
  Zap,
  Copy,
  Download,
  Brain,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { aiService } from '../../lib/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'appeal' | 'analysis' | 'action';
  data?: { letter?: string; [key: string]: unknown };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  action: () => void;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  claimId?: string;
  claimData?: {
    claim_number: string;
    patient_name: string;
    payer_name: string;
    billed_amount: number;
    status: string;
    denial_risk_score?: number;
  };
}

export function AIAssistant({ isOpen, onClose, claimId, claimData }: AIAssistantProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: claimData 
          ? `I'm ready to help you with claim **${claimData.claim_number}** for ${claimData.patient_name}. This ${claimData.status} claim is for $${claimData.billed_amount.toLocaleString()} from ${claimData.payer_name}.\n\nWhat would you like me to do?`
          : "Hello! I'm your AI Claims Assistant. I can help you:\n\n• **Analyze denial risk** for any claim\n• **Generate appeal letters** using AI\n• **Identify patterns** in your claims\n• **Recommend actions** to reduce denials\n\nSelect a quick action below or ask me anything!",
        timestamp: new Date(),
        type: 'text',
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, claimData]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleAnalyzeRisk = async () => {
    if (!claimId) {
      addMessage({
        role: 'assistant',
        content: 'Please select a claim first to analyze its denial risk.',
        type: 'text',
      });
      return;
    }

    setShowQuickActions(false);
    addMessage({
      role: 'user',
      content: 'Analyze the denial risk for this claim',
      type: 'text',
    });

    setIsLoading(true);
    try {
      const result = await aiService.predictDenialRisk(claimId);
      
      const riskLevel = result.prediction.level;
      const riskScore = Math.round(result.prediction.score * 100);
      const factors = result.prediction.factors || [];
      const recommendations = result.prediction.recommendations || [];

      let content = `## Denial Risk Analysis\n\n`;
      content += `**Risk Level:** ${riskLevel.toUpperCase()} (${riskScore}%)\n\n`;
      
      if (factors.length > 0) {
        content += `### Risk Factors\n`;
        factors.forEach((f, i) => {
          content += `${i + 1}. **${f.factor}** - ${f.impact} impact\n`;
          if (f.recommendation) content += `   → ${f.recommendation}\n`;
        });
        content += '\n';
      }

      if (recommendations.length > 0) {
        content += `### Recommendations\n`;
        recommendations.forEach((r, i) => {
          content += `${i + 1}. ${r.recommendation}\n`;
        });
      }

      if (result.prediction.aiInsights?.insights) {
        content += `\n### AI Insights\n${result.prediction.aiInsights.insights}`;
      }

      addMessage({
        role: 'assistant',
        content,
        type: 'analysis',
        data: result.prediction,
      });
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: `I encountered an error analyzing the risk: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the AI service is configured.`,
        type: 'text',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAppeal = async () => {
    if (!claimId) {
      addMessage({
        role: 'assistant',
        content: 'Please select a denied claim first to generate an appeal letter.',
        type: 'text',
      });
      return;
    }

    setShowQuickActions(false);
    addMessage({
      role: 'user',
      content: 'Generate an AI appeal letter for this claim',
      type: 'text',
    });

    setIsLoading(true);
    try {
      const result = await aiService.generateAppeal(claimId, {
        denial_reason: claimData?.status === 'denied' ? 'Medical necessity not established' : undefined,
      });

      let content = `## AI-Generated Appeal Letter\n\n`;
      content += `*Generated using ${result.aiEnabled ? 'Gemini AI' : 'Template Engine'}*\n\n`;
      content += `---\n\n${result.appeal.letter}\n\n---\n\n`;
      content += `You can copy this letter or download it as a file.`;

      addMessage({
        role: 'assistant',
        content,
        type: 'appeal',
        data: { letter: result.appeal.letter },
      });
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: `I couldn't generate the appeal letter: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the claim has denial information.`,
        type: 'text',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzePatterns = async () => {
    setShowQuickActions(false);
    addMessage({
      role: 'user',
      content: 'Analyze patterns across all claims',
      type: 'text',
    });

    setIsLoading(true);
    try {
      const result = await aiService.analyzePatterns(90);

      let content = `## Claims Pattern Analysis (Last 90 Days)\n\n`;
      content += `**Claims Analyzed:** ${result.claimsAnalyzed}\n`;
      content += `**Denial Rate:** ${(result.stats.denialRate * 100).toFixed(1)}%\n`;
      content += `**Total Billed:** $${result.stats.totalBilled.toLocaleString()}\n\n`;

      if (result.patterns && result.patterns.length > 0) {
        content += `### Detected Patterns\n`;
        result.patterns.forEach((p, i) => {
          content += `\n**${i + 1}. ${p.title}** (${p.severity} severity)\n`;
          content += `${p.description}\n`;
          content += `→ ${p.recommendation}\n`;
        });
      } else {
        content += `No significant patterns detected in your claims data.`;
      }

      addMessage({
        role: 'assistant',
        content,
        type: 'analysis',
        data: result,
      });
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: `Pattern analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'text',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setShowQuickActions(false);

    addMessage({
      role: 'user',
      content: userMessage,
      type: 'text',
    });

    setIsLoading(true);

    // Simple intent detection
    const lowerInput = userMessage.toLowerCase();
    
    if (lowerInput.includes('risk') || lowerInput.includes('denial') || lowerInput.includes('analyze')) {
      await handleAnalyzeRisk();
    } else if (lowerInput.includes('appeal') || lowerInput.includes('letter') || lowerInput.includes('generate')) {
      await handleGenerateAppeal();
    } else if (lowerInput.includes('pattern') || lowerInput.includes('trend') || lowerInput.includes('insight')) {
      await handleAnalyzePatterns();
    } else {
      // Generic response
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: `I understand you're asking about "${userMessage}". Here's what I can help you with:\n\n• **"Analyze risk"** - Predict denial probability\n• **"Generate appeal"** - Create an AI appeal letter\n• **"Show patterns"** - Analyze claim trends\n\nTry one of these commands or select a quick action below!`,
          type: 'text',
        });
        setIsLoading(false);
        setShowQuickActions(true);
      }, 500);
      return;
    }
  };

  const handleCopyAppeal = async (letter: string) => {
    await navigator.clipboard.writeText(letter);
  };

  const handleDownloadAppeal = (letter: string) => {
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appeal-letter-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'analyze',
      label: 'Analyze Risk',
      icon: AlertTriangle,
      description: 'Predict denial probability',
      action: handleAnalyzeRisk,
    },
    {
      id: 'appeal',
      label: 'Generate Appeal',
      icon: Scale,
      description: 'Create AI appeal letter',
      action: handleGenerateAppeal,
    },
    {
      id: 'patterns',
      label: 'Find Patterns',
      icon: TrendingUp,
      description: 'Analyze claim trends',
      action: handleAnalyzePatterns,
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={cn(
          "fixed bottom-4 right-4 w-96 h-[600px] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden",
          isDark
            ? "bg-neutral-900 border border-neutral-800"
            : "bg-white border border-neutral-200"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isDark ? "bg-teal-500/20" : "bg-teal-100"
            )}>
              <Brain className={cn(
                "h-5 w-5",
                isDark ? "text-teal-400" : "text-teal-600"
              )} />
            </div>
            <div>
              <h3 className={cn(
                "font-semibold",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                AI Assistant
              </h3>
              <p className={cn(
                "text-xs",
                isDark ? "text-neutral-500" : "text-neutral-500"
              )}>
                Powered by Gemini AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isDark
                ? "hover:bg-neutral-800 text-neutral-400"
                : "hover:bg-neutral-100 text-neutral-500"
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === 'user'
                  ? isDark
                    ? "bg-teal-600 text-white"
                    : "bg-teal-500 text-white"
                  : isDark
                    ? "bg-neutral-800 text-neutral-200"
                    : "bg-neutral-100 text-neutral-800"
              )}>
                <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-base font-bold mt-2 mb-1">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-sm font-semibold mt-2 mb-1">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-semibold">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('---')) {
                      return <hr key={i} className="my-2 border-current opacity-20" />;
                    }
                    return <p key={i} className="mb-1">{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>
                
                {/* Action buttons for appeal messages */}
                {message.type === 'appeal' && message.data?.letter && typeof message.data.letter === 'string' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-current/20">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => handleCopyAppeal(message.data!.letter as string)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => handleDownloadAppeal(message.data!.letter as string)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className={cn(
                "rounded-2xl px-4 py-3",
                isDark ? "bg-neutral-800" : "bg-neutral-100"
              )}>
                <div className="flex items-center gap-2">
                  <Loader2 className={cn(
                    "h-4 w-4 animate-spin",
                    isDark ? "text-teal-400" : "text-teal-600"
                  )} />
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  )}>
                    AI is thinking...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {showQuickActions && !isLoading && (
          <div className={cn(
            "px-4 py-3 border-t",
            isDark ? "border-neutral-800" : "border-neutral-200"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className={cn(
                "h-4 w-4",
                isDark ? "text-amber-400" : "text-amber-500"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isDark ? "text-neutral-400" : "text-neutral-500"
              )}>
                Quick Actions
              </span>
            </div>
            <div className="flex gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-center",
                    isDark
                      ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                  )}
                >
                  <action.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className={cn(
          "p-4 border-t",
          isDark ? "border-neutral-800" : "border-neutral-200"
        )}>
          <div className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2",
            isDark ? "bg-neutral-800" : "bg-neutral-100"
          )}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className={cn(
                "flex-1 bg-transparent text-sm outline-none",
                isDark
                  ? "text-white placeholder-neutral-500"
                  : "text-neutral-900 placeholder-neutral-400"
              )}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-2 rounded-lg transition-colors",
                input.trim() && !isLoading
                  ? isDark
                    ? "bg-teal-600 text-white hover:bg-teal-500"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                  : isDark
                    ? "bg-neutral-700 text-neutral-500"
                    : "bg-neutral-200 text-neutral-400"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating AI Button component
export function AIAssistantButton({ onClick }: { onClick: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40",
        isDark
          ? "bg-teal-600 text-white hover:bg-teal-500"
          : "bg-teal-500 text-white hover:bg-teal-600"
      )}
    >
      <Sparkles className="h-6 w-6" />
    </motion.button>
  );
}
