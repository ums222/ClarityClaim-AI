import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Scale,
  Sparkles,
  FileText,
  Search,
  AlertCircle,
  ChevronRight,
  Calendar,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { createAppeal, AppealPriority, AppealType, PRIORITY_LABELS, APPEAL_TYPE_LABELS } from '../../lib/appeals';
import { claimsService, Claim } from '../../lib/claims';

interface CreateAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedClaim?: Claim;
}

type Step = 'select-claim' | 'appeal-details' | 'review';

export function CreateAppealModal({ isOpen, onClose, onSuccess, preselectedClaim }: CreateAppealModalProps) {
  const [step, setStep] = useState<Step>(preselectedClaim ? 'appeal-details' : 'select-claim');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Claim selection
  const [claims, setClaims] = useState<Claim[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimSearch, setClaimSearch] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(preselectedClaim || null);
  
  // Appeal details
  const [appealType, setAppealType] = useState<AppealType>('standard');
  const [priority, setPriority] = useState<AppealPriority>('normal');
  const [denialReason, setDenialReason] = useState('');
  const [denialCode, setDenialCode] = useState('');
  const [amountAppealed, setAmountAppealed] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [useAI, setUseAI] = useState(true);

  // Fetch denied claims for selection
  useEffect(() => {
    if (isOpen && step === 'select-claim') {
      fetchClaims();
    }
  }, [isOpen, step]);

  // Populate fields from selected claim
  useEffect(() => {
    if (selectedClaim) {
      setDenialReason(selectedClaim.denial_reasons?.[0] || '');
      setDenialCode(selectedClaim.denial_codes?.[0] || '');
      setAmountAppealed(selectedClaim.billed_amount?.toString() || '');
      
      // Calculate deadline (typically 60-90 days from denial)
      if (selectedClaim.created_at) {
        const denialDate = new Date(selectedClaim.created_at);
        denialDate.setDate(denialDate.getDate() + 60);
        setDeadline(denialDate.toISOString().split('T')[0]);
      }
    }
  }, [selectedClaim]);

  const fetchClaims = async () => {
    setClaimsLoading(true);
    try {
      // Fetch denied claims
      const { claims: deniedClaims } = await claimsService.getClaims(
        { status: ['denied'] },
        1,
        50
      );
      setClaims(deniedClaims);
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setClaimsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClaim) {
      setError('Please select a claim to appeal');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createAppeal({
        claim_id: selectedClaim.id,
        appeal_type: appealType,
        priority,
        original_denial_reason: denialReason,
        original_denial_code: denialCode,
        original_denial_date: selectedClaim.created_at?.split('T')[0],
        original_denial_amount: selectedClaim.billed_amount,
        amount_appealed: parseFloat(amountAppealed) || selectedClaim.billed_amount,
        deadline: deadline || undefined,
        notes,
        ai_generated: useAI,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create appeal');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(preselectedClaim ? 'appeal-details' : 'select-claim');
    setSelectedClaim(preselectedClaim || null);
    setAppealType('standard');
    setPriority('normal');
    setDenialReason('');
    setDenialCode('');
    setAmountAppealed('');
    setDeadline('');
    setNotes('');
    setUseAI(true);
    setError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const filteredClaims = claims.filter(claim => 
    claim.claim_number.toLowerCase().includes(claimSearch.toLowerCase()) ||
    claim.patient_name.toLowerCase().includes(claimSearch.toLowerCase()) ||
    claim.payer_name.toLowerCase().includes(claimSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create New Appeal</h2>
                <p className="text-sm text-gray-500">
                  {step === 'select-claim' && 'Step 1: Select a denied claim'}
                  {step === 'appeal-details' && 'Step 2: Enter appeal details'}
                  {step === 'review' && 'Step 3: Review and create'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              {['select-claim', 'appeal-details', 'review'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s 
                      ? 'bg-blue-600 text-white' 
                      : ['appeal-details', 'review'].indexOf(step) > ['appeal-details', 'review'].indexOf(s as Step)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {['appeal-details', 'review'].indexOf(step) > i ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 2 && (
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Step 1: Select Claim */}
            {step === 'select-claim' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search denied claims by number, patient, or payer..."
                    value={claimSearch}
                    onChange={(e) => setClaimSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {claimsLoading ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">Loading denied claims...</p>
                  </div>
                ) : filteredClaims.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No denied claims found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Appeals can only be created for denied claims
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredClaims.map((claim) => (
                      <button
                        key={claim.id}
                        onClick={() => {
                          setSelectedClaim(claim);
                          setStep('appeal-details');
                        }}
                        className={`w-full p-4 border rounded-xl text-left transition-all hover:border-blue-300 hover:bg-blue-50/50 ${
                          selectedClaim?.id === claim.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{claim.claim_number}</p>
                            <p className="text-sm text-gray-500">{claim.patient_name} • {claim.payer_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${claim.billed_amount?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {claim.service_date && new Date(claim.service_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {claim.denial_reasons?.[0] && (
                          <p className="text-sm text-red-600 mt-2 line-clamp-1">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            {claim.denial_reasons[0]}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Appeal Details */}
            {step === 'appeal-details' && (
              <div className="space-y-5">
                {/* Selected Claim Summary */}
                {selectedClaim && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Selected Claim</p>
                        <p className="text-lg font-semibold text-blue-900">{selectedClaim.claim_number}</p>
                        <p className="text-sm text-blue-700">
                          {selectedClaim.patient_name} • {selectedClaim.payer_name}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedClaim(null);
                          setStep('select-claim');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Appeal Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Appeal Type
                    </label>
                    <select
                      value={appealType}
                      onChange={(e) => setAppealType(e.target.value as AppealType)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(APPEAL_TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as AppealPriority)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Denial Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Denial Reason
                  </label>
                  <textarea
                    value={denialReason}
                    onChange={(e) => setDenialReason(e.target.value)}
                    placeholder="Enter the reason for denial..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Denial Code
                    </label>
                    <input
                      type="text"
                      value={denialCode}
                      onChange={(e) => setDenialCode(e.target.value)}
                      placeholder="e.g., CO-50"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Amount to Appeal
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={amountAppealed}
                        onChange={(e) => setAmountAppealed(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Filing Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* AI Option */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAI}
                      onChange={(e) => setUseAI(e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-900">AI-Assisted Appeal</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Let AI analyze the denial and help draft a compelling appeal letter
                      </p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional context or notes..."
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 'review' && selectedClaim && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-medium text-gray-900">Appeal Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Claim Number</p>
                      <p className="font-medium text-gray-900">{selectedClaim.claim_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Patient</p>
                      <p className="font-medium text-gray-900">{selectedClaim.patient_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payer</p>
                      <p className="font-medium text-gray-900">{selectedClaim.payer_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Appeal Type</p>
                      <p className="font-medium text-gray-900">{APPEAL_TYPE_LABELS[appealType]}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Priority</p>
                      <p className="font-medium text-gray-900">{PRIORITY_LABELS[priority]}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium text-gray-900">
                        ${parseFloat(amountAppealed || '0').toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Denial Reason</p>
                      <p className="font-medium text-gray-900">{denialReason || 'Not specified'}</p>
                    </div>
                    {deadline && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Filing Deadline</p>
                        <p className="font-medium text-gray-900">
                          {new Date(deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {useAI && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">AI assistance enabled</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        An AI-generated appeal letter will be created after submission
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button
              onClick={() => {
                if (step === 'appeal-details') setStep('select-claim');
                else if (step === 'review') setStep('appeal-details');
                else onClose();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {step === 'select-claim' ? 'Cancel' : 'Back'}
            </button>

            <button
              onClick={() => {
                if (step === 'select-claim' && selectedClaim) setStep('appeal-details');
                else if (step === 'appeal-details') setStep('review');
                else handleSubmit();
              }}
              disabled={loading || (step === 'select-claim' && !selectedClaim)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : step === 'review' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Create Appeal
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
