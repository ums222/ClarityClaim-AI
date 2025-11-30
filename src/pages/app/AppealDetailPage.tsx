import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '../../components/app/AppLayout';
import {
  ArrowLeft,
  FileText,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  Send,
  Edit,
  Trash,
  MoreVertical,
  Building,
  ExternalLink,
  History,
  Paperclip,
  MessageSquare,
  TrendingUp,
  Copy,
  Download,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { 
  Appeal, 
  AppealActivity,
  getAppeal, 
  getAppealActivities,
  updateAppeal,
  submitAppeal,
  STATUS_LABELS, 
  STATUS_COLORS,
  PRIORITY_LABELS,
  APPEAL_TYPE_LABELS,
  OUTCOME_LABELS,
  AppealStatus,
} from '../../lib/appeals';
import { AppealEditor } from '../../components/appeals/AppealEditor';
import { AppealTemplateSelector } from '../../components/appeals/AppealTemplateSelector';
import { OutcomeRecorder } from '../../components/appeals/OutcomeRecorder';

// Status Badge Component
function StatusBadge({ status, size = 'md' }: { status: AppealStatus; size?: 'sm' | 'md' | 'lg' }) {
  const colorMap: Record<string, string> = {
    gray: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    lime: 'bg-lime-50 text-lime-700 border-lime-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const color = STATUS_COLORS[status] || 'gray';
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${colorMap[color]}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// Activity Item Component
function ActivityItem({ activity }: { activity: AppealActivity }) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'status_changed':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case 'submitted':
        return <Send className="w-4 h-4 text-indigo-500" />;
      case 'outcome_received':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'letter_generated':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getActivityDescription = (activity: AppealActivity) => {
    switch (activity.action) {
      case 'created':
        return `Appeal ${activity.action_details?.appeal_number} was created`;
      case 'status_changed':
        return `Status changed from ${activity.action_details?.from} to ${activity.action_details?.to}`;
      case 'submitted':
        return `Appeal submitted via ${activity.action_details?.method}`;
      case 'outcome_received':
        return `Outcome received: ${activity.action_details?.outcome}`;
      case 'letter_generated':
        return `Appeal letter generated (${activity.action_details?.type})`;
      default:
        return activity.action;
    }
  };

  return (
    <div className="flex gap-3 py-3">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon(activity.action)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-900">{getActivityDescription(activity)}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {new Date(activity.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function AppealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [activities, setActivities] = useState<AppealActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'letter' | 'details' | 'history' | 'documents'>('letter');
  
  // Modals
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showOutcomeRecorder, setShowOutcomeRecorder] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const fetchAppeal = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [appealData, activitiesData] = await Promise.all([
        getAppeal(id),
        getAppealActivities(id),
      ]);
      setAppeal(appealData);
      setActivities(activitiesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load appeal');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAppeal();
  }, [fetchAppeal]);

  const handleSaveLetter = async (content: string) => {
    if (!appeal) return;
    
    setSaving(true);
    try {
      await updateAppeal(appeal.id, { appeal_letter: content });
      setAppeal({ ...appeal, appeal_letter: content });
    } catch (err) {
      console.error('Failed to save letter:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitAppeal = async (method: string = 'portal') => {
    if (!appeal) return;
    
    setSaving(true);
    try {
      const updatedAppeal = await submitAppeal(appeal.id, method);
      setAppeal(updatedAppeal);
      setShowSubmitConfirm(false);
      fetchAppeal(); // Refresh activities
    } catch (err) {
      console.error('Failed to submit appeal:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateSelect = (letter: string) => {
    if (!appeal) return;
    setAppeal({ ...appeal, appeal_letter: letter });
    handleSaveLetter(letter);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-500">Loading appeal...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !appeal) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Appeal Not Found</h2>
            <p className="text-neutral-500 mb-4">{error || 'The appeal you\'re looking for doesn\'t exist.'}</p>
            <button
              onClick={() => navigate('/app/appeals')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Appeals
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const daysToDeadline = appeal.days_to_deadline;
  const isUrgent = daysToDeadline !== null && daysToDeadline !== undefined && daysToDeadline <= 7 && daysToDeadline >= 0;
  const isPastDeadline = daysToDeadline !== null && daysToDeadline !== undefined && daysToDeadline < 0;

  const canSubmit = appeal.status === 'draft' || appeal.status === 'ready_to_submit';
  const canRecordOutcome = appeal.status === 'submitted' || appeal.status === 'under_review';

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/app/appeals')}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-neutral-900">{appeal.appeal_number}</h1>
                <StatusBadge status={appeal.status} size="lg" />
                {appeal.ai_generated && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    AI Generated
                  </span>
                )}
              </div>
              <p className="text-neutral-500 mt-1">
                Level {appeal.appeal_level} {APPEAL_TYPE_LABELS[appeal.appeal_type]} Appeal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Record Outcome Button */}
            {canRecordOutcome && (
              <button
                onClick={() => setShowOutcomeRecorder(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Record Outcome
              </button>
            )}

            {/* Submit Button */}
            {canSubmit && (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Appeal
              </button>
            )}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2.5 text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-10">
                  <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </button>
                  <hr className="my-1" />
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="border-b border-neutral-100">
                <nav className="flex">
                  {[
                    { id: 'letter', label: 'Appeal Letter', icon: FileText },
                    { id: 'details', label: 'Claim Details', icon: Building },
                    { id: 'history', label: 'History', icon: History },
                    { id: 'documents', label: 'Documents', icon: Paperclip },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                          : 'text-neutral-500 border-transparent hover:text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Letter Tab */}
                {activeTab === 'letter' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-neutral-900">Appeal Letter</h3>
                      <button
                        onClick={() => setShowTemplateSelector(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Use Template
                      </button>
                    </div>
                    <AppealEditor
                      appealId={appeal.id}
                      initialContent={appeal.appeal_letter || ''}
                      denialReason={appeal.original_denial_reason}
                      denialCode={appeal.original_denial_code}
                      onSave={handleSaveLetter}
                      readOnly={appeal.status === 'submitted' || appeal.status === 'approved' || appeal.status === 'denied'}
                    />
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && appeal.claim && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-neutral-900">Linked Claim</h3>
                      <Link
                        to={`/app/claims/${appeal.claim_id}`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        View Full Claim
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-neutral-500">Claim Number</label>
                          <p className="font-medium text-neutral-900">{appeal.claim.claim_number}</p>
                        </div>
                        <div>
                          <label className="text-sm text-neutral-500">Patient Name</label>
                          <p className="font-medium text-neutral-900">{appeal.claim.patient_name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-neutral-500">Payer</label>
                          <p className="font-medium text-neutral-900">{appeal.claim.payer_name}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-neutral-500">Service Date</label>
                          <p className="font-medium text-neutral-900">
                            {appeal.claim.service_date
                              ? new Date(appeal.claim.service_date).toLocaleDateString()
                              : 'N/A'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-neutral-500">Billed Amount</label>
                          <p className="font-medium text-neutral-900">
                            ${appeal.claim.billed_amount?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-4">Activity Timeline</h3>
                    {activities.length === 0 ? (
                      <p className="text-neutral-500 text-center py-8">No activity yet</p>
                    ) : (
                      <div className="divide-y divide-neutral-100">
                        {activities.map((activity) => (
                          <ActivityItem key={activity.id} activity={activity} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-neutral-900">Supporting Documents</h3>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Paperclip className="w-4 h-4" />
                        Attach File
                      </button>
                    </div>
                    <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl">
                      <Paperclip className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-neutral-500">No documents attached</p>
                      <p className="text-sm text-neutral-400 mt-1">
                        Drag and drop files here or click to browse
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Appeal Summary */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Appeal Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Priority</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    appeal.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    appeal.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    appeal.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                    'bg-neutral-100 text-neutral-700'
                  }`}>
                    {PRIORITY_LABELS[appeal.priority]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Appeal Level</span>
                  <span className="text-sm font-medium text-neutral-900">Level {appeal.appeal_level}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Type</span>
                  <span className="text-sm font-medium text-neutral-900">{APPEAL_TYPE_LABELS[appeal.appeal_type]}</span>
                </div>

                <hr className="border-neutral-100" />

                <div>
                  <span className="text-sm text-neutral-500">Amount Appealed</span>
                  <p className="text-xl font-bold text-neutral-900 mt-1">
                    ${(appeal.amount_appealed || 0).toLocaleString()}
                  </p>
                </div>

                {appeal.amount_recovered !== null && appeal.amount_recovered !== undefined && appeal.amount_recovered > 0 && (
                  <div>
                    <span className="text-sm text-neutral-500">Amount Recovered</span>
                    <p className="text-xl font-bold text-green-600 mt-1">
                      ${appeal.amount_recovered.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Deadline Card */}
            {appeal.deadline && (
              <div className={`rounded-2xl border p-6 ${
                isPastDeadline ? 'bg-red-50 border-red-200' :
                isUrgent ? 'bg-amber-50 border-amber-200' :
                'bg-white border-neutral-100'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {isPastDeadline ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : isUrgent ? (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Calendar className="w-5 h-5 text-neutral-600" />
                  )}
                  <span className={`font-semibold ${
                    isPastDeadline ? 'text-red-800' :
                    isUrgent ? 'text-amber-800' :
                    'text-neutral-900'
                  }`}>
                    Filing Deadline
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  isPastDeadline ? 'text-red-600' :
                  isUrgent ? 'text-amber-600' :
                  'text-neutral-900'
                }`}>
                  {new Date(appeal.deadline).toLocaleDateString()}
                </p>
                <p className={`text-sm mt-1 ${
                  isPastDeadline ? 'text-red-600' :
                  isUrgent ? 'text-amber-600' :
                  'text-neutral-500'
                }`}>
                  {isPastDeadline
                    ? `${Math.abs(daysToDeadline!)} days overdue`
                    : daysToDeadline === 0
                    ? 'Due today!'
                    : `${daysToDeadline} days remaining`
                  }
                </p>
              </div>
            )}

            {/* Denial Information */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Denial Information</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-neutral-500">Denial Reason</span>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {appeal.original_denial_reason || 'Not specified'}
                  </p>
                </div>

                {appeal.original_denial_code && (
                  <div>
                    <span className="text-sm text-neutral-500">Denial Code</span>
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {appeal.original_denial_code}
                    </p>
                  </div>
                )}

                {appeal.original_denial_date && (
                  <div>
                    <span className="text-sm text-neutral-500">Denial Date</span>
                    <p className="text-sm font-medium text-neutral-900 mt-1">
                      {new Date(appeal.original_denial_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Outcome (if available) */}
            {appeal.outcome && (
              <div className={`rounded-2xl border p-6 ${
                appeal.outcome === 'approved' ? 'bg-green-50 border-green-200' :
                appeal.outcome === 'partially_approved' ? 'bg-lime-50 border-lime-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {appeal.outcome === 'approved' || appeal.outcome === 'partially_approved' ? (
                    <CheckCircle className={`w-5 h-5 ${appeal.outcome === 'approved' ? 'text-green-600' : 'text-lime-600'}`} />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-semibold text-neutral-900">Appeal Outcome</span>
                </div>
                <p className={`text-xl font-bold ${
                  appeal.outcome === 'approved' ? 'text-green-700' :
                  appeal.outcome === 'partially_approved' ? 'text-lime-700' :
                  'text-red-700'
                }`}>
                  {OUTCOME_LABELS[appeal.outcome]}
                </p>
                {appeal.outcome_date && (
                  <p className="text-sm text-neutral-600 mt-1">
                    Decided on {new Date(appeal.outcome_date).toLocaleDateString()}
                  </p>
                )}
                {appeal.outcome_reason && (
                  <p className="text-sm text-neutral-700 mt-3">
                    {appeal.outcome_reason}
                  </p>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                  <FileText className="w-5 h-5 text-neutral-400" />
                  <span>Apply Template</span>
                  <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto" />
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors">
                  <Paperclip className="w-5 h-5 text-neutral-400" />
                  <span>Attach Documents</span>
                  <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto" />
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors">
                  <MessageSquare className="w-5 h-5 text-neutral-400" />
                  <span>Add Note</span>
                  <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      <AppealTemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
        claimData={appeal.claim}
      />

      {/* Outcome Recorder Modal */}
      {appeal && (
        <OutcomeRecorder
          isOpen={showOutcomeRecorder}
          onClose={() => setShowOutcomeRecorder(false)}
          appeal={appeal}
          onSuccess={fetchAppeal}
        />
      )}

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 text-center mb-2">
                  Submit Appeal?
                </h3>
                <p className="text-neutral-500 text-center mb-6">
                  This will mark the appeal as submitted. Make sure all documents and the appeal letter are complete.
                </p>

                <div className="space-y-2 mb-6">
                  <button
                    onClick={() => handleSubmitAppeal('portal')}
                    disabled={saving}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-left hover:bg-neutral-50 transition-colors"
                  >
                    <p className="font-medium text-neutral-900">Submit via Payer Portal</p>
                    <p className="text-sm text-neutral-500">Manually submit through the payer's online portal</p>
                  </button>
                  <button
                    onClick={() => handleSubmitAppeal('fax')}
                    disabled={saving}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-left hover:bg-neutral-50 transition-colors"
                  >
                    <p className="font-medium text-neutral-900">Submit via Fax</p>
                    <p className="text-sm text-neutral-500">Fax the appeal to the payer</p>
                  </button>
                  <button
                    onClick={() => handleSubmitAppeal('mail')}
                    disabled={saving}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-left hover:bg-neutral-50 transition-colors"
                  >
                    <p className="font-medium text-neutral-900">Submit via Mail</p>
                    <p className="text-sm text-neutral-500">Send the appeal by postal mail</p>
                  </button>
                </div>

                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="w-full px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
