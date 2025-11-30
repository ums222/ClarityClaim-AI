import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService, AppealLetter } from '../../lib/ai';
import { Claim } from '../../lib/claims';

interface AppealGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: Claim;
}

export function AppealGeneratorModal({ 
  isOpen, 
  onClose, 
  claim 
}: AppealGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [appeal, setAppeal] = useState<AppealLetter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Form state for customization
  const [denialReason, setDenialReason] = useState(claim.denial_reasons?.[0] || '');
  const [denialCode, setDenialCode] = useState(claim.denial_codes?.[0] || '');
  const [additionalContext, setAdditionalContext] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAppeal(null);
      setError(null);
      setCopied(false);
      setDenialReason(claim.denial_reasons?.[0] || '');
      setDenialCode(claim.denial_codes?.[0] || '');
      setAdditionalContext('');
    }
  }, [isOpen, claim]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await aiService.generateAppeal(claim.id, {
        denial_reason: denialReason,
        denial_code: denialCode,
        additional_context: additionalContext,
      });
      
      setAppeal(result.appeal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate appeal');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!appeal) return;
    
    try {
      await navigator.clipboard.writeText(appeal.letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = appeal.letter;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!appeal) return;
    
    const blob = new Blob([appeal.letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appeal-${claim.claim_number}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    AI Appeal Generator
                  </h2>
                  <p className="text-sm text-white/80">
                    Generate professional appeal letter for {claim.claim_number}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
              {/* Left Panel - Configuration */}
              <div className="lg:w-1/3 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Denial Details
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Denial Reason
                  </label>
                  <textarea
                    value={denialReason}
                    onChange={(e) => setDenialReason(e.target.value)}
                    rows={3}
                    placeholder="Enter the reason given for denial..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Denial Code
                  </label>
                  <input
                    type="text"
                    value={denialCode}
                    onChange={(e) => setDenialCode(e.target.value)}
                    placeholder="e.g., CO-4, PR-96"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Context
                  </label>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    rows={3}
                    placeholder="Any additional information to include..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Claim Summary */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Claim Summary
                  </h4>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="text-gray-500">Patient:</span> {claim.patient_name}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="text-gray-500">Payer:</span> {claim.payer_name}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="text-gray-500">Amount:</span> ${claim.billed_amount?.toLocaleString()}
                    </p>
                    {claim.procedure_codes?.length > 0 && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="text-gray-500">CPT:</span> {claim.procedure_codes.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Appeal Letter
                    </>
                  )}
                </button>
              </div>

              {/* Right Panel - Generated Letter */}
              <div className="lg:w-2/3 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Generated Letter
                  </h3>
                  {appeal && (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appeal.type === 'ai-generated' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {appeal.type === 'ai-generated' ? '✨ AI Generated' : '📝 Template'}
                      </span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex-1 min-h-[400px] max-h-[500px] overflow-y-auto">
                  {appeal ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed"
                    >
                      {appeal.letter}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">
                        No appeal letter generated yet
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Fill in the denial details and click Generate
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {appeal && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleCopy}
                      className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="py-2 px-4 bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default AppealGeneratorModal;
