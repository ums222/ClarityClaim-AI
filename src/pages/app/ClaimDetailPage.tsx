import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '../../components/app/AppLayout';
import { StatusBadge, PriorityBadge } from '../../components/claims/StatusBadge';
import { RiskScoreIndicator, RiskFactorsList } from '../../components/claims/RiskScoreIndicator';
import { ClaimWorkflow } from '../../components/claims/ClaimWorkflow';
import { ClaimUploadModal } from '../../components/claims/ClaimUploadModal';
import { AppealGeneratorModal } from '../../components/claims/AppealGeneratorModal';
import { aiService } from '../../lib/ai';
import {
  claimsService,
  Claim,
  ClaimActivity,
  ClaimStatus,
  STATUS_ORDER,
  formatCurrency,
  formatDate,
  formatDateTime,
} from '../../lib/claims';

type TabType = 'details' | 'history' | 'documents' | 'ai';

export function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [claim, setClaim] = useState<Claim | null>(null);
  const [activities, setActivities] = useState<ClaimActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Run AI prediction
  const runAIPrediction = async () => {
    if (!claim) return;
    
    setIsAnalyzing(true);
    try {
      await aiService.predictDenialRisk(claim.id);
      // Refresh claim to get updated risk data
      const updatedClaim = await claimsService.getClaim(claim.id);
      setClaim(updatedClaim);
    } catch (err) {
      console.error('AI prediction failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fetch claim data
  const fetchClaim = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [claimData, activitiesData] = await Promise.all([
        claimsService.getClaim(id),
        claimsService.getClaimActivities(id),
      ]);

      setClaim(claimData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error fetching claim:', err);
      setError('Failed to load claim. It may have been deleted or you may not have access.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClaim();
  }, [fetchClaim]);

  // Update claim status
  const handleStatusChange = async (newStatus: ClaimStatus) => {
    if (!claim) return;

    setIsUpdatingStatus(true);
    setShowStatusMenu(false);

    try {
      const updated = await claimsService.updateClaim(claim.id, { status: newStatus });
      setClaim(updated);
      
      // Refresh activities
      const activitiesData = await claimsService.getClaimActivities(claim.id);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Delete claim
  const handleDelete = async () => {
    if (!claim || !confirm('Are you sure you want to delete this claim? This action cannot be undone.')) {
      return;
    }

    try {
      await claimsService.deleteClaim(claim.id);
      navigate('/app/claims');
    } catch (err) {
      console.error('Error deleting claim:', err);
      alert('Failed to delete claim. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-500 dark:text-neutral-400">Loading claim...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !claim) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <svg className="w-16 h-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-neutral-600 dark:text-neutral-400">{error || 'Claim not found'}</p>
          <Link
            to="/app/claims"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            ← Back to Claims
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              to="/app/claims"
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors mt-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-mono">
                  {claim.claim_number}
                </h1>
                <StatusBadge status={claim.status} size="lg" animated />
                <PriorityBadge priority={claim.priority} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                <span>Created {formatDateTime(claim.created_at)}</span>
                <span>•</span>
                <span>Last updated {formatDateTime(claim.updated_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Change Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={isUpdatingStatus}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                {isUpdatingStatus ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Change Status
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showStatusMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowStatusMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-20 py-1 max-h-64 overflow-y-auto"
                    >
                      {STATUS_ORDER.map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={status === claim.status}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2 ${
                            status === claim.status
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <StatusBadge status={status} size="sm" showDot={false} />
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
            Claim Progress
          </h3>
          <ClaimWorkflow currentStatus={claim.status} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex gap-6">
                {(['details', 'history', 'documents', 'ai'] as TabType[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                    }`}
                  >
                    {tab === 'ai' ? 'AI Insights' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Patient Info */}
                    <InfoSection title="Patient Information">
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Patient Name" value={claim.patient_name} />
                        <InfoField label="Patient ID" value={claim.patient_id} />
                        <InfoField label="Date of Birth" value={formatDate(claim.patient_dob)} />
                        <InfoField label="Member ID" value={claim.patient_member_id} />
                      </div>
                    </InfoSection>

                    {/* Payer Info */}
                    <InfoSection title="Payer Information">
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Payer Name" value={claim.payer_name} />
                        <InfoField label="Payer ID" value={claim.payer_id} />
                        <InfoField label="Plan Name" value={claim.plan_name} />
                        <InfoField label="Plan Type" value={claim.plan_type} />
                      </div>
                    </InfoSection>

                    {/* Provider Info */}
                    <InfoSection title="Provider Information">
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Provider Name" value={claim.provider_name} />
                        <InfoField label="Provider NPI" value={claim.provider_npi} />
                        <InfoField label="Facility" value={claim.facility_name} className="col-span-2" />
                      </div>
                    </InfoSection>

                    {/* Service Info */}
                    <InfoSection title="Service Information">
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Service Date" value={formatDate(claim.service_date)} />
                        <InfoField label="Service End Date" value={formatDate(claim.service_date_end)} />
                        <InfoField label="Place of Service" value={claim.place_of_service} />
                        <div />
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                            Procedure Codes (CPT)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {claim.procedure_codes?.length ? (
                              claim.procedure_codes.map((code, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded font-mono"
                                >
                                  {code}
                                </span>
                              ))
                            ) : (
                              <span className="text-neutral-400">-</span>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                            Diagnosis Codes (ICD-10)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {claim.diagnosis_codes?.length ? (
                              claim.diagnosis_codes.map((code, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded font-mono"
                                >
                                  {code}
                                </span>
                              ))
                            ) : (
                              <span className="text-neutral-400">-</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </InfoSection>

                    {/* Notes */}
                    {claim.notes && (
                      <InfoSection title="Notes">
                        <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                          {claim.notes}
                        </p>
                      </InfoSection>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    {activities.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-12 h-12 text-neutral-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-neutral-500 dark:text-neutral-400">No activity history yet</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700" />
                        <div className="space-y-4">
                          {activities.map((activity, index) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative pl-10"
                            >
                              <div className="absolute left-2.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800" />
                              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium text-neutral-900 dark:text-white capitalize">
                                      {activity.action.replace(/_/g, ' ')}
                                    </p>
                                    {activity.action === 'status_changed' && activity.action_details && (
                                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                        Changed from{' '}
                                        <StatusBadge status={activity.action_details.from as ClaimStatus} size="sm" showDot={false} />
                                        {' → '}
                                        <StatusBadge status={activity.action_details.to as ClaimStatus} size="sm" showDot={false} />
                                      </p>
                                    )}
                                    {activity.user && (
                                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                        by {activity.user.full_name}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {formatDateTime(activity.created_at)}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-neutral-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                      No documents attached yet
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Upload Document
                    </button>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="space-y-6">
                    {/* Risk Analysis */}
                    <InfoSection title="Denial Risk Analysis">
                      <div className="flex flex-col md:flex-row gap-6">
                        <RiskScoreIndicator
                          score={claim.denial_risk_score}
                          level={claim.denial_risk_level}
                          size="lg"
                        />
                        <div className="flex-1">
                          <RiskFactorsList factors={claim.denial_risk_factors || []} />
                        </div>
                      </div>
                    </InfoSection>

                    {/* AI Recommendations */}
                    <InfoSection title="AI Recommendations">
                      {claim.ai_recommendations?.length ? (
                        <div className="space-y-3">
                          {claim.ai_recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                            >
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <div>
                                  <p className="font-medium text-blue-900 dark:text-blue-100">
                                    {rec.type}
                                  </p>
                                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                    {rec.recommendation}
                                  </p>
                                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                    Confidence: {Math.round(rec.confidence * 100)}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 dark:text-neutral-400 italic">
                          No AI recommendations available yet. Run analysis to get suggestions.
                        </p>
                      )}
                    </InfoSection>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Summary & Quick Actions */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
                Financial Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 dark:text-neutral-400">Billed Amount</span>
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">
                    {formatCurrency(claim.billed_amount)}
                  </span>
                </div>
                {claim.allowed_amount !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 dark:text-neutral-400">Allowed Amount</span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {formatCurrency(claim.allowed_amount)}
                    </span>
                  </div>
                )}
                {claim.paid_amount !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 dark:text-neutral-400">Paid Amount</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(claim.paid_amount)}
                    </span>
                  </div>
                )}
                {claim.adjustment_amount !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 dark:text-neutral-400">Adjustment</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(Math.abs(claim.adjustment_amount))}
                    </span>
                  </div>
                )}
                {claim.patient_responsibility !== null && (
                  <div className="flex justify-between items-center pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-500 dark:text-neutral-400">Patient Responsibility</span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {formatCurrency(claim.patient_responsibility)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Dates */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
                Key Dates
              </h3>
              <div className="space-y-3">
                <DateRow label="Received" date={claim.received_date} />
                <DateRow label="Service Date" date={claim.service_date} />
                <DateRow label="Submitted" date={claim.submitted_at} />
                <DateRow label="Due Date" date={claim.due_date} highlight />
                <DateRow label="Follow Up" date={claim.follow_up_date} />
              </div>
            </div>

            {/* Denial Info (if denied) */}
            {['denied', 'partially_denied', 'appealed', 'appeal_won', 'appeal_lost'].includes(claim.status) && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider mb-4">
                  Denial Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">Denial Date</span>
                    <p className="text-red-900 dark:text-red-100">{formatDate(claim.denial_date) || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">Category</span>
                    <p className="text-red-900 dark:text-red-100">{claim.denial_category || '-'}</p>
                  </div>
                  {claim.denial_codes?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">Denial Codes</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {claim.denial_codes.map((code, i) => (
                          <span key={i} className="px-2 py-0.5 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 text-xs rounded font-mono">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {claim.denial_reasons?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">Reasons</span>
                      <ul className="mt-1 space-y-1">
                        {claim.denial_reasons.map((reason, i) => (
                          <li key={i} className="text-sm text-red-900 dark:text-red-100">• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {/* AI Analysis Button */}
                <button 
                  onClick={runAIPrediction}
                  disabled={isAnalyzing}
                  className="w-full px-4 py-2 text-left text-sm font-medium bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/50 dark:hover:to-indigo-900/50 rounded-lg transition-colors flex items-center gap-2 border border-purple-200 dark:border-purple-800"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Run AI Analysis
                    </>
                  )}
                </button>
                
                <button className="w-full px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Claim
                </button>
                <button 
                  onClick={() => setIsAppealModalOpen(true)}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Generate Appeal Letter
                </button>
                <button className="w-full px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicate Claim
                </button>
                <button className="w-full px-4 py-2 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export to PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ClaimUploadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchClaim();
        }}
        editClaim={claim}
      />

      {/* Appeal Generator Modal */}
      <AppealGeneratorModal
        isOpen={isAppealModalOpen}
        onClose={() => setIsAppealModalOpen(false)}
        claim={claim}
      />
    </AppLayout>
  );
}

// Helper Components
function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoField({ 
  label, 
  value, 
  className = '' 
}: { 
  label: string; 
  value: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <p className="text-neutral-900 dark:text-white">
        {value || <span className="text-neutral-400">-</span>}
      </p>
    </div>
  );
}

function DateRow({ 
  label, 
  date, 
  highlight = false 
}: { 
  label: string; 
  date: string | null | undefined;
  highlight?: boolean;
}) {
  const formattedDate = formatDate(date);
  const isOverdue = highlight && date && new Date(date) < new Date();

  return (
    <div className="flex justify-between items-center">
      <span className="text-neutral-500 dark:text-neutral-400 text-sm">{label}</span>
      <span 
        className={`text-sm font-medium ${
          isOverdue 
            ? 'text-red-600 dark:text-red-400' 
            : highlight 
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-neutral-900 dark:text-white'
        }`}
      >
        {formattedDate}
        {isOverdue && (
          <span className="ml-1 text-xs text-red-500">(Overdue)</span>
        )}
      </span>
    </div>
  );
}

export default ClaimDetailPage;
