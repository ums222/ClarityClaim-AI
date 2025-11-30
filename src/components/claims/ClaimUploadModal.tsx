import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  claimsService, 
  Claim, 
  ClaimStatus,
  getDefaultClaim,
} from '../../lib/claims';
import { RiskScoreIndicator, RiskFactorsList } from './RiskScoreIndicator';

interface ClaimUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (claims: Claim[]) => void;
  editClaim?: Claim;
}

type TabType = 'manual' | 'import';

export function ClaimUploadModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  editClaim 
}: ClaimUploadModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Claim>>(
    editClaim || getDefaultClaim()
  );

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Partial<Claim>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate risk in real-time
  const riskAnalysis = claimsService.calculateDenialRisk(formData);

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle array fields (codes)
  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [field]: items,
    }));
  };

  // Handle file selection for import
  const handleFileSelect = useCallback(async (file: File) => {
    setImportFile(file);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setError('CSV file must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
      const claims: Partial<Claim>[] = [];

      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const values = parseCSVLine(lines[i]);
        const claim: Partial<Claim> = getDefaultClaim();

        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          if (!value) return;

          // Map CSV columns to claim fields
          switch (header) {
            case 'claim_number':
            case 'claim_#':
            case 'claimnumber':
              claim.claim_number = value;
              break;
            case 'patient_name':
            case 'patient':
            case 'name':
              claim.patient_name = value;
              break;
            case 'patient_id':
            case 'patientid':
            case 'member_id':
              claim.patient_id = value;
              break;
            case 'payer_name':
            case 'payer':
            case 'insurance':
              claim.payer_name = value;
              break;
            case 'billed_amount':
            case 'amount':
            case 'charge':
              claim.billed_amount = parseFloat(value) || 0;
              break;
            case 'service_date':
            case 'date_of_service':
            case 'dos':
              claim.service_date = value;
              break;
            case 'procedure_codes':
            case 'cpt_codes':
            case 'cpt':
              claim.procedure_codes = value.split(';').map(s => s.trim());
              break;
            case 'diagnosis_codes':
            case 'icd_codes':
            case 'icd':
              claim.diagnosis_codes = value.split(';').map(s => s.trim());
              break;
            case 'status':
              claim.status = value.toLowerCase() as ClaimStatus;
              break;
            case 'provider_name':
            case 'provider':
              claim.provider_name = value;
              break;
            case 'provider_npi':
            case 'npi':
              claim.provider_npi = value;
              break;
          }
        });

        if (claim.patient_name && claim.payer_name) {
          claims.push(claim);
        }
      }

      setImportPreview(claims);

      if (claims.length === 0) {
        setError('No valid claims found in file. Make sure it has patient_name and payer_name columns.');
      }
    } catch (err) {
      setError('Failed to parse CSV file. Please check the format.');
    }
  }, []);

  // Parse CSV line handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleFileSelect(file);
    } else {
      setError('Please upload a CSV file');
    }
  }, [handleFileSelect]);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (activeTab === 'manual') {
        // Validate required fields
        if (!formData.patient_name || !formData.payer_name) {
          throw new Error('Patient name and payer name are required');
        }

        // Add risk scoring
        const claimWithRisk = {
          ...formData,
          denial_risk_score: riskAnalysis.score,
          denial_risk_level: riskAnalysis.level,
          denial_risk_factors: riskAnalysis.factors,
        };

        const newClaim = await claimsService.createClaim(claimWithRisk);
        onSuccess([newClaim]);
      } else {
        // Import claims
        if (importPreview.length === 0) {
          throw new Error('No claims to import');
        }

        const importedClaims = await claimsService.importClaims(importPreview);
        onSuccess(importedClaims);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(getDefaultClaim());
    setImportFile(null);
    setImportPreview([]);
    setError(null);
    setShowRiskAnalysis(false);
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
            className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editClaim ? 'Edit Claim' : 'New Claim'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            {!editClaim && (
              <div className="px-6 pt-4">
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'manual'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Manual Entry
                  </button>
                  <button
                    onClick={() => setActiveTab('import')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'import'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Import CSV
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {activeTab === 'manual' ? (
                  <div className="space-y-6">
                    {/* Patient Information */}
                    <section>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                        Patient Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Patient Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="patient_name"
                            value={formData.patient_name || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Patient ID
                          </label>
                          <input
                            type="text"
                            name="patient_id"
                            value={formData.patient_id || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="PT-12345"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="patient_dob"
                            value={formData.patient_dob || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Member ID
                          </label>
                          <input
                            type="text"
                            name="patient_member_id"
                            value={formData.patient_member_id || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="MEM-12345"
                          />
                        </div>
                      </div>
                    </section>

                    {/* Payer Information */}
                    <section>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                        Payer Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Payer Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="payer_name"
                            value={formData.payer_name || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Blue Cross Blue Shield"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Plan Type
                          </label>
                          <select
                            name="plan_type"
                            value={formData.plan_type || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select plan type</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Medicare">Medicare</option>
                            <option value="Medicaid">Medicaid</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Payer ID
                          </label>
                          <input
                            type="text"
                            name="payer_id"
                            value={formData.payer_id || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="BCBS01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            name="plan_name"
                            value={formData.plan_name || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="PPO Gold"
                          />
                        </div>
                      </div>
                    </section>

                    {/* Provider Information */}
                    <section>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                        Provider Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Provider Name
                          </label>
                          <input
                            type="text"
                            name="provider_name"
                            value={formData.provider_name || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Dr. Jane Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Provider NPI
                          </label>
                          <input
                            type="text"
                            name="provider_npi"
                            value={formData.provider_npi || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234567890"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Facility Name
                          </label>
                          <input
                            type="text"
                            name="facility_name"
                            value={formData.facility_name || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="General Hospital"
                          />
                        </div>
                      </div>
                    </section>

                    {/* Service Information */}
                    <section>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                        Service Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Service Date
                          </label>
                          <input
                            type="date"
                            name="service_date"
                            value={formData.service_date || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Service End Date
                          </label>
                          <input
                            type="date"
                            name="service_date_end"
                            value={formData.service_date_end || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Procedure Codes (CPT)
                          </label>
                          <input
                            type="text"
                            value={formData.procedure_codes?.join(', ') || ''}
                            onChange={(e) => handleArrayChange('procedure_codes', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="99213, 99214"
                          />
                          <p className="mt-1 text-xs text-gray-500">Separate multiple codes with commas</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Diagnosis Codes (ICD-10)
                          </label>
                          <input
                            type="text"
                            value={formData.diagnosis_codes?.join(', ') || ''}
                            onChange={(e) => handleArrayChange('diagnosis_codes', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="J06.9, R05"
                          />
                          <p className="mt-1 text-xs text-gray-500">Separate multiple codes with commas</p>
                        </div>
                      </div>
                    </section>

                    {/* Financial Information */}
                    <section>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                        Financial Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Billed Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              name="billed_amount"
                              value={formData.billed_amount || ''}
                              onChange={handleChange}
                              step="0.01"
                              min="0"
                              required
                              className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Priority
                          </label>
                          <select
                            name="priority"
                            value={formData.priority || 'normal'}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                    </section>

                    {/* Notes */}
                    <section>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                        Notes
                      </h3>
                      <textarea
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Add any additional notes..."
                      />
                    </section>

                    {/* Risk Analysis Preview */}
                    <section>
                      <button
                        type="button"
                        onClick={() => setShowRiskAnalysis(!showRiskAnalysis)}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3"
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${showRiskAnalysis ? 'rotate-90' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Denial Risk Analysis
                      </button>
                      
                      <AnimatePresence>
                        {showRiskAnalysis && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                              <RiskScoreIndicator 
                                score={riskAnalysis.score} 
                                level={riskAnalysis.level}
                                size="lg"
                              />
                              <RiskFactorsList factors={riskAnalysis.factors} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  </div>
                ) : (
                  /* Import Tab */
                  <div className="space-y-6">
                    {/* Drop Zone */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className={`
                        border-2 border-dashed rounded-xl p-8 text-center transition-colors
                        ${importFile 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }
                      `}
                    >
                      {importFile ? (
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="font-medium text-gray-900 dark:text-white">{importFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {importPreview.length} claim(s) ready to import
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setImportFile(null);
                              setImportPreview([]);
                            }}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-gray-600 dark:text-gray-400">
                            Drag and drop your CSV file here, or
                          </p>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Browse Files
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>

                    {/* CSV Format Help */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        CSV Format Requirements
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Required columns: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">patient_name</code>, <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">payer_name</code></li>
                        <li>• Optional columns: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">claim_number</code>, <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">billed_amount</code>, <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">service_date</code>, <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">procedure_codes</code>, <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">diagnosis_codes</code></li>
                        <li>• Use semicolons (;) to separate multiple codes</li>
                      </ul>
                    </div>

                    {/* Import Preview */}
                    {importPreview.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Preview (First {importPreview.length} claims)
                        </h4>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Patient</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Payer</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {importPreview.map((claim, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 text-gray-900 dark:text-white">{claim.patient_name}</td>
                                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{claim.payer_name}</td>
                                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">${claim.billed_amount || 0}</td>
                                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{claim.service_date || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  Reset
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (activeTab === 'import' && importPreview.length === 0)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : activeTab === 'import' ? (
                      `Import ${importPreview.length} Claim${importPreview.length !== 1 ? 's' : ''}`
                    ) : editClaim ? (
                      'Update Claim'
                    ) : (
                      'Create Claim'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default ClaimUploadModal;
