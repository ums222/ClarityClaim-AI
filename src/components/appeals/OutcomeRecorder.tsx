import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Appeal } from '../../lib/appeals';
import axios from 'axios';

interface OutcomeRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  appeal: Appeal;
  onSuccess: () => void;
}

type Outcome = 'approved' | 'partially_approved' | 'denied';

export function OutcomeRecorder({
  isOpen,
  onClose,
  appeal,
  onSuccess,
}: OutcomeRecorderProps) {
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [amountApproved, setAmountApproved] = useState('');
  const [amountRecovered, setAmountRecovered] = useState('');
  const [outcomeReason, setOutcomeReason] = useState('');
  const [payerResponse, setPayerResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!outcome) {
      setError('Please select an outcome');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`/api/appeals/${appeal.id}/outcome`, {
        outcome,
        outcome_reason: outcomeReason,
        payer_response: payerResponse,
        amount_approved: amountApproved ? parseFloat(amountApproved) : null,
        amount_recovered: amountRecovered ? parseFloat(amountRecovered) : null,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record outcome');
    } finally {
      setLoading(false);
    }
  };

  const outcomeOptions: Array<{
    value: Outcome;
    label: string;
    description: string;
    icon: typeof CheckCircle;
    color: 'green' | 'amber' | 'red';
  }> = [
    {
      value: 'approved',
      label: 'Approved',
      description: 'Appeal was fully approved',
      icon: CheckCircle,
      color: 'green',
    },
    {
      value: 'partially_approved',
      label: 'Partially Approved',
      description: 'Appeal was partially approved',
      icon: AlertCircle,
      color: 'amber',
    },
    {
      value: 'denied',
      label: 'Denied',
      description: 'Appeal was denied',
      icon: XCircle,
      color: 'red',
    },
  ];

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Record Outcome</h2>
                  <p className="text-sm text-neutral-500">{appeal.appeal_number}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Appeal Summary */}
            <div className="p-4 bg-neutral-50 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Amount Appealed</p>
                  <p className="font-medium text-neutral-900">
                    ${(appeal.amount_appealed || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Submitted</p>
                  <p className="font-medium text-neutral-900">
                    {appeal.submitted_at
                      ? new Date(appeal.submitted_at).toLocaleDateString()
                      : 'Not submitted'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Outcome Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Select Outcome
              </label>
              <div className="grid grid-cols-3 gap-3">
                {outcomeOptions.map((option) => {
                  const Icon = option.icon;
                  const colorClasses = {
                    green: 'border-green-500 bg-green-50 ring-green-200',
                    amber: 'border-amber-500 bg-amber-50 ring-amber-200',
                    red: 'border-red-500 bg-red-50 ring-red-200',
                  };
                  const iconColorClasses = {
                    green: 'text-green-600',
                    amber: 'text-amber-600',
                    red: 'text-red-600',
                  };
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => setOutcome(option.value)}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${
                        outcome === option.value
                          ? `${colorClasses[option.color]} ring-2`
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        outcome === option.value
                          ? iconColorClasses[option.color]
                          : 'text-neutral-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        outcome === option.value
                          ? 'text-neutral-900'
                          : 'text-neutral-600'
                      }`}>
                        {option.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial Fields (for approved/partially approved) */}
            {(outcome === 'approved' || outcome === 'partially_approved') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Amount Approved
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="number"
                      value={amountApproved}
                      onChange={(e) => setAmountApproved(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Amount Recovered
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="number"
                      value={amountRecovered}
                      onChange={(e) => setAmountRecovered(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Outcome Reason */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Outcome Reason / Notes
              </label>
              <textarea
                value={outcomeReason}
                onChange={(e) => setOutcomeReason(e.target.value)}
                placeholder="Enter payer's response or reason for outcome..."
                rows={3}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Payer Response */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Payer's Official Response (Optional)
              </label>
              <textarea
                value={payerResponse}
                onChange={(e) => setPayerResponse(e.target.value)}
                placeholder="Paste the payer's official response here..."
                rows={2}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
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

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !outcome}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Record Outcome
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
